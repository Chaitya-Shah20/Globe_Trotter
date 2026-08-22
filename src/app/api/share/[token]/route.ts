import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    const trip = await prisma.trip.findFirst({
      where: {
        OR: [
          { shareToken: token },
          { id: token },
        ],
        isPublic: true,
      },
      include: {
        owner: {
          select: {
            name: true,
            image: true,
          },
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
                  include: { activity: true },
                },
              },
            },
          },
        },
        expenses: true,
      },
    })

    if (!trip) {
      return NextResponse.json({ message: "Shared itinerary not found or is private" }, { status: 404 })
    }

    return NextResponse.json(trip)
  } catch (error: any) {
    console.error("Public share API error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
