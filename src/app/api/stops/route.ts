import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"
import * as z from "zod"

const createStopSchema = z.object({
  tripId: z.string(),
  city: z.string().min(1, "City name is required"),
  country: z.string().optional().default(""),
  cityId: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  notes: z.string().optional(),
  estimatedCost: z.number().optional().default(0),
  order: z.number().optional(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validated = createStopSchema.parse(body)

    const trip = await prisma.trip.findUnique({
      where: { id: validated.tripId },
      include: { stops: true }
    })

    if (!trip) {
      return NextResponse.json({ message: "Trip not found" }, { status: 404 })
    }

    if (trip.ownerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const nextOrder = validated.order !== undefined ? validated.order : trip.stops.length

    // Create the stop
    const stop = await prisma.tripStop.create({
      data: {
        tripId: validated.tripId,
        cityName: validated.city,
        country: validated.country,
        cityId: validated.cityId || null,
        arrivalDate: new Date(validated.startDate),
        departureDate: new Date(validated.endDate),
        notes: validated.notes || "",
        estimatedCost: Number(validated.estimatedCost) || 0,
        order: nextOrder,
      },
      include: {
        city: true,
        days: {
          include: {
            activities: true,
          }
        }
      }
    })

    return NextResponse.json(stop, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input data", errors: error.issues }, { status: 422 })
    }
    console.error("Create stop error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
