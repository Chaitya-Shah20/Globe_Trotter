import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"
import * as z from "zod"

const addItineraryActivitySchema = z.object({
  stopId: z.string(),
  name: z.string().min(1, "Activity name required"),
  activityId: z.string().optional(),
  category: z.string().optional().default("activities"),
  timeText: z.string().optional().default("10:00"),
  cost: z.number().optional().default(0),
  location: z.string().optional(),
  notes: z.string().optional(),
  date: z.string().optional(),
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const city = searchParams.get("city")
    const category = searchParams.get("category")
    const query = searchParams.get("q")

    const where: any = {}

    if (city) {
      where.city = {
        name: {
          contains: city,
          mode: "insensitive",
        },
      }
    }

    if (category && category !== "All") {
      where.category = {
        equals: category,
        mode: "insensitive",
      }
    }

    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ]
    }

    const activities = await prisma.activity.findMany({
      where,
      include: {
        city: true,
      },
      orderBy: {
        name: "asc",
      },
      take: 50,
    })

    return NextResponse.json(activities)
  } catch (error: any) {
    console.error("Get activities error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validated = addItineraryActivitySchema.parse(body)

    const stop = await prisma.tripStop.findUnique({
      where: { id: validated.stopId },
      include: {
        days: true,
        trip: true,
      },
    })

    if (!stop) {
      return NextResponse.json({ message: "Stop not found" }, { status: 404 })
    }

    if (stop.trip.ownerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    // Get or create itinerary day for this stop
    let targetDay = stop.days[0]
    if (!targetDay) {
      targetDay = await prisma.itineraryDay.create({
        data: {
          stopId: stop.id,
          date: validated.date ? new Date(validated.date) : stop.arrivalDate,
        },
      })
    }

    const itineraryActivity = await prisma.itineraryActivity.create({
      data: {
        dayId: targetDay.id,
        activityId: validated.activityId || null,
        customName: validated.name,
        category: validated.category,
        timeText: validated.timeText,
        customCost: Number(validated.cost) || 0,
        location: validated.location || "",
        notes: validated.notes || "",
      },
      include: {
        activity: true,
      },
    })

    // Also update stop estimatedCost
    await prisma.tripStop.update({
      where: { id: stop.id },
      data: {
        estimatedCost: (stop.estimatedCost || 0) + (Number(validated.cost) || 0),
      },
    })

    return NextResponse.json(itineraryActivity, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.issues }, { status: 422 })
    }
    console.error("Create activity error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
