import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"
import * as z from "zod"

const addStopSchema = z.object({
  cityId: z.string().min(1, "City is required"),
  arrivalDate: z.string().datetime().or(z.string().min(1)),
  departureDate: z.string().datetime().or(z.string().min(1)),
})

export async function GET(
  req: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { tripId } = await params

    const stops = await prisma.tripStop.findMany({
      where: {
        tripId,
        trip: {
          OR: [
            { ownerId: session.user.id },
            { isPublic: true },
          ],
        },
      },
      include: {
        city: true,
        days: {
          include: {
            activities: {
              include: { activity: true },
              orderBy: { order: "asc" },
            },
          },
          orderBy: { date: "asc" },
        },
      },
      orderBy: { order: "asc" },
    })

    return NextResponse.json(stops)
  } catch (error) {
    console.error("Failed to fetch stops:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { tripId } = await params

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    })

    if (!trip) {
      return NextResponse.json({ message: "Trip not found" }, { status: 404 })
    }

    if (trip.ownerId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden: You do not own this trip" }, { status: 403 })
    }

    const body = await req.json()
    const parsed = addStopSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "Invalid input data" },
        { status: 422 }
      )
    }

    const { cityId, arrivalDate, departureDate } = parsed.data

    const arrival = new Date(arrivalDate)
    const departure = new Date(departureDate)

    if (isNaN(arrival.getTime()) || isNaN(departure.getTime())) {
      return NextResponse.json({ message: "Invalid dates provided" }, { status: 422 })
    }

    // Get current stops count for ordering
    const existingStopsCount = await prisma.tripStop.count({
      where: { tripId },
    })

    // Create Stop
    const newStop = await prisma.tripStop.create({
      data: {
        tripId,
        cityId,
        arrivalDate: arrival,
        departureDate: departure,
        order: existingStopsCount,
      },
      include: {
        city: true,
      },
    })

    // Auto-create ItineraryDay entries for each day in range
    const startMidnight = new Date(arrival.getFullYear(), arrival.getMonth(), arrival.getDate())
    const endMidnight = new Date(departure.getFullYear(), departure.getMonth(), departure.getDate())
    const dayDifference = Math.max(0, Math.round((endMidnight.getTime() - startMidnight.getTime()) / (1000 * 60 * 60 * 24)))

    for (let i = 0; i <= dayDifference; i++) {
      const dayDate = new Date(startMidnight.getTime() + i * (24 * 60 * 60 * 1000))
      await prisma.itineraryDay.create({
        data: {
          stopId: newStop.id,
          date: dayDate,
        },
      })
    }

    // Fetch complete populated stop
    const fullStop = await prisma.tripStop.findUnique({
      where: { id: newStop.id },
      include: {
        city: true,
        days: {
          include: {
            activities: {
              include: { activity: true },
              orderBy: { order: "asc" },
            },
          },
          orderBy: { date: "asc" },
        },
      },
    })

    return NextResponse.json(fullStop, { status: 201 })
  } catch (error) {
    console.error("Failed to add stop to trip:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { tripId } = await params
    const { searchParams } = new URL(req.url)
    const stopId = searchParams.get("stopId")

    if (!stopId) {
      return NextResponse.json({ message: "stopId query param is required" }, { status: 400 })
    }

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    })

    if (!trip || trip.ownerId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    await prisma.tripStop.delete({
      where: { id: stopId },
    })

    return NextResponse.json({ message: "Stop removed from itinerary successfully" }, { status: 200 })
  } catch (error) {
    console.error("Failed to delete stop:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
