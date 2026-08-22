import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"
import * as z from "zod"

const updateStopSchema = z.object({
  city: z.string().optional(),
  country: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  notes: z.string().optional(),
  estimatedCost: z.number().optional(),
  order: z.number().optional(),
})

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ stopId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { stopId } = await params

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const stop = await prisma.tripStop.findUnique({
      where: { id: stopId },
      include: { trip: true }
    })

    if (!stop) {
      return NextResponse.json({ message: "Stop not found" }, { status: 404 })
    }

    if (stop.trip.ownerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const validated = updateStopSchema.parse(body)

    const updated = await prisma.tripStop.update({
      where: { id: stopId },
      data: {
        ...(validated.city && { cityName: validated.city }),
        ...(validated.country && { country: validated.country }),
        ...(validated.startDate && { arrivalDate: new Date(validated.startDate) }),
        ...(validated.endDate && { departureDate: new Date(validated.endDate) }),
        ...(validated.notes !== undefined && { notes: validated.notes }),
        ...(validated.estimatedCost !== undefined && { estimatedCost: Number(validated.estimatedCost) }),
        ...(validated.order !== undefined && { order: validated.order }),
      }
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.issues }, { status: 422 })
    }
    console.error("Update stop error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ stopId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { stopId } = await params

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const stop = await prisma.tripStop.findUnique({
      where: { id: stopId },
      include: { trip: true }
    })

    if (!stop) {
      return NextResponse.json({ message: "Stop not found" }, { status: 404 })
    }

    if (stop.trip.ownerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    await prisma.tripStop.delete({
      where: { id: stopId }
    })

    return NextResponse.json({ message: "Stop deleted successfully" })
  } catch (error: any) {
    console.error("Delete stop error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
