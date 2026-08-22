import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"
import * as z from "zod"

const updateTripSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.number().optional(),
  coverImage: z.string().optional(),
  isPublic: z.boolean().optional(),
})

export async function GET(
  req: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { tripId } = await params

    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: {
        owner: {
          select: { id: true, name: true, image: true, email: true }
        },
        stops: {
          orderBy: { order: "asc" },
          include: {
            city: true,
            days: {
              orderBy: { date: "asc" },
              include: {
                activities: {
                  orderBy: { order: "asc" },
                  include: { activity: true }
                }
              }
            }
          }
        },
        expenses: {
          orderBy: { date: "desc" }
        }
      }
    })

    if (!trip) {
      return NextResponse.json({ message: "Trip not found" }, { status: 404 })
    }

    // Check ownership if not public
    if (!trip.isPublic && (!session || session.user?.id !== trip.ownerId)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(trip)
  } catch (error: any) {
    console.error("Get trip error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { tripId } = await params

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const existingTrip = await prisma.trip.findUnique({
      where: { id: tripId }
    })

    if (!existingTrip) {
      return NextResponse.json({ message: "Trip not found" }, { status: 404 })
    }

    if (existingTrip.ownerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const validated = updateTripSchema.parse(body)

    const updatedTrip = await prisma.trip.update({
      where: { id: tripId },
      data: {
        ...(validated.name && { name: validated.name }),
        ...(validated.description !== undefined && { description: validated.description }),
        ...(validated.startDate && { startDate: new Date(validated.startDate) }),
        ...(validated.endDate && { endDate: new Date(validated.endDate) }),
        ...(validated.budget !== undefined && { budget: Number(validated.budget) }),
        ...(validated.coverImage && { coverImage: validated.coverImage }),
        ...(validated.isPublic !== undefined && { isPublic: validated.isPublic }),
      },
      include: {
        stops: {
          orderBy: { order: "asc" },
          include: {
            city: true,
            days: {
              include: { activities: true }
            }
          }
        },
        expenses: true
      }
    })

    return NextResponse.json(updatedTrip)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input data", errors: error.issues }, { status: 422 })
    }
    console.error("Update trip error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { tripId } = await params

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const existingTrip = await prisma.trip.findUnique({
      where: { id: tripId }
    })

    if (!existingTrip) {
      return NextResponse.json({ message: "Trip not found" }, { status: 404 })
    }

    if (existingTrip.ownerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    await prisma.trip.delete({
      where: { id: tripId }
    })

    return NextResponse.json({ message: "Trip deleted successfully" })
  } catch (error: any) {
    console.error("Delete trip error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
