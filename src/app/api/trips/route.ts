import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"
import * as z from "zod"

const createTripSchema = z.object({
  name: z.string().min(2, "Trip name must be at least 2 characters"),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  budget: z.number().optional().default(0),
  coverImage: z.string().optional(),
  isPublic: z.boolean().optional().default(false),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validated = createTripSchema.parse(body)

    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const shareToken = `gt-${validated.name.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 20)}-${randomSuffix}`

    const trip = await prisma.trip.create({
      data: {
        name: validated.name,
        description: validated.description,
        startDate: new Date(validated.startDate),
        endDate: new Date(validated.endDate),
        budget: Number(validated.budget) || 0,
        coverImage: validated.coverImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
        isPublic: validated.isPublic,
        shareToken,
        ownerId: session.user.id,
      },
      include: {
        stops: {
          include: {
            city: true,
            days: {
              include: {
                activities: true,
              },
            },
          },
        },
        expenses: true,
      },
    })

    return NextResponse.json(trip, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input data", errors: error.issues }, { status: 422 })
    }

    console.error("Trip creation error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const trips = await prisma.trip.findMany({
      where: {
        ownerId: session.user.id,
      },
      orderBy: {
        startDate: "asc",
      },
      include: {
        stops: {
          orderBy: {
            order: "asc",
          },
          include: {
            city: true,
            days: {
              include: {
                activities: true,
              },
            },
          },
        },
        expenses: true,
      },
    })

    return NextResponse.json(trips)
  } catch (error: any) {
    console.error("Fetch trips error:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
