import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Please sign in to copy this trip" }, { status: 401 })
    }

    const { token } = await params

    const sourceTrip = await prisma.trip.findFirst({
      where: {
        OR: [
          { shareToken: token },
          { id: token },
        ],
      },
      include: {
        stops: {
          orderBy: { order: "asc" },
          include: {
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

    if (!sourceTrip) {
      return NextResponse.json({ message: "Source itinerary not found" }, { status: 404 })
    }

    const randomSuffix = Math.random().toString(36).substring(2, 8)
    const newShareToken = `gt-${sourceTrip.name.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 20)}-${randomSuffix}`

    // Clone trip to the logged in user
    const clonedTrip = await prisma.trip.create({
      data: {
        name: `Copy of ${sourceTrip.name}`,
        description: sourceTrip.description,
        startDate: sourceTrip.startDate,
        endDate: sourceTrip.endDate,
        budget: sourceTrip.budget,
        coverImage: sourceTrip.coverImage,
        isPublic: false,
        shareToken: newShareToken,
        ownerId: session.user.id,
      },
    })

    // Clone stops and activities
    for (const stop of sourceTrip.stops) {
      const clonedStop = await prisma.tripStop.create({
        data: {
          tripId: clonedTrip.id,
          cityId: stop.cityId,
          cityName: stop.cityName,
          country: stop.country,
          arrivalDate: stop.arrivalDate,
          departureDate: stop.departureDate,
          order: stop.order,
          notes: stop.notes,
          estimatedCost: stop.estimatedCost,
        },
      })

      for (const day of stop.days) {
        const clonedDay = await prisma.itineraryDay.create({
          data: {
            stopId: clonedStop.id,
            date: day.date,
          },
        })

        for (const act of day.activities) {
          await prisma.itineraryActivity.create({
            data: {
              dayId: clonedDay.id,
              activityId: act.activityId,
              customName: act.customName,
              category: act.category,
              timeText: act.timeText,
              customCost: act.customCost,
              location: act.location,
              notes: act.notes,
              order: act.order,
            },
          })
        }
      }
    }

    return NextResponse.json({
      message: "Trip copied to your account successfully!",
      tripId: clonedTrip.id,
    }, { status: 201 })
  } catch (error: any) {
    console.error("Clone trip error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
