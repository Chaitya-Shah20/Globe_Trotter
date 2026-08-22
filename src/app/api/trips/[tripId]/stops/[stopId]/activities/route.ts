import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"
import * as z from "zod"

const addActivitySchema = z.object({
  activityId: z.string().min(1, "Activity ID is required"),
  dayId: z.string().min(1, "Day ID is required"),
  startTime: z.string().optional().nullable(),
  customCost: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
})

export async function POST(
  req: Request,
  { params }: { params: Promise<{ tripId: string; stopId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { tripId, stopId } = await params

    // Verify trip ownership
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    })

    if (!trip) {
      return NextResponse.json({ message: "Trip not found" }, { status: 404 })
    }

    if (trip.ownerId !== session.user.id) {
      return NextResponse.json(
        { message: "Forbidden: You do not own this trip" },
        { status: 403 }
      )
    }

    // Verify stop belongs to trip
    const stop = await prisma.tripStop.findFirst({
      where: { id: stopId, tripId },
    })

    if (!stop) {
      return NextResponse.json(
        { message: "Stop not found in this trip" },
        { status: 404 }
      )
    }

    const body = await req.json()
    const parsed = addActivitySchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "Invalid input data" },
        { status: 422 }
      )
    }

    const { activityId, dayId, startTime, customCost, notes } = parsed.data

    // Verify the day belongs to this stop
    const day = await prisma.itineraryDay.findFirst({
      where: { id: dayId, stopId },
    })

    if (!day) {
      return NextResponse.json(
        { message: "Day not found in this stop" },
        { status: 404 }
      )
    }

    // Verify the activity exists
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
    })

    if (!activity) {
      return NextResponse.json(
        { message: "Activity not found" },
        { status: 404 }
      )
    }

    // Get current count for ordering
    const existingCount = await prisma.itineraryActivity.count({
      where: { dayId },
    })

    // Calculate end time from activity duration if start time provided
    let endTime: Date | null = null
    let parsedStartTime: Date | null = null
    if (startTime) {
      parsedStartTime = new Date(startTime)
      if (!isNaN(parsedStartTime.getTime())) {
        endTime = new Date(
          parsedStartTime.getTime() + activity.durationMinutes * 60 * 1000
        )
      }
    }

    // Create ItineraryActivity
    const itineraryActivity = await prisma.itineraryActivity.create({
      data: {
        dayId,
        activityId,
        startTime: parsedStartTime,
        endTime,
        customCost: customCost ?? null,
        order: existingCount,
        notes: notes ?? null,
      },
      include: {
        activity: {
          include: {
            city: {
              select: { id: true, name: true },
            },
          },
        },
        day: true,
      },
    })

    return NextResponse.json(itineraryActivity, { status: 201 })
  } catch (error) {
    console.error("Failed to add activity to stop:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ tripId: string; stopId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { tripId } = await params
    const { searchParams } = new URL(req.url)
    const itineraryActivityId = searchParams.get("itineraryActivityId")

    if (!itineraryActivityId) {
      return NextResponse.json(
        { message: "itineraryActivityId query param is required" },
        { status: 400 }
      )
    }

    // Verify trip ownership
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
    })

    if (!trip || trip.ownerId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    await prisma.itineraryActivity.delete({
      where: { id: itineraryActivityId },
    })

    return NextResponse.json(
      { message: "Activity removed from itinerary successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Failed to delete itinerary activity:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
