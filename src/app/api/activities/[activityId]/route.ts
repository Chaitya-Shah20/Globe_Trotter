import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ activityId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { activityId } = await params

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const item = await prisma.itineraryActivity.findUnique({
      where: { id: activityId },
      include: {
        day: {
          include: {
            stop: {
              include: { trip: true }
            }
          }
        }
      }
    })

    if (!item) {
      return NextResponse.json({ message: "Activity item not found" }, { status: 404 })
    }

    if (item.day.stop.trip.ownerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    await prisma.itineraryActivity.delete({
      where: { id: activityId }
    })

    return NextResponse.json({ message: "Activity removed successfully" })
  } catch (error: any) {
    console.error("Delete itinerary activity error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
