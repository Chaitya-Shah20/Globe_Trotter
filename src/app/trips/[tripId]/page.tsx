import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import prisma from "@/lib/db"
import { ItineraryBuilder } from "@/components/itinerary/itinerary-builder"

export const metadata: Metadata = {
  title: "Trip Itinerary | GlobeTrotter",
}

export default async function TripPage({ params }: { params: { tripId: string } }) {
  const session = await getServerSession(authOptions)
  
  if (!session || !session.user) {
    redirect("/login")
  }
  
  const trip = await prisma.trip.findUnique({
    where: {
      id: params.tripId,
    },
    include: {
      stops: {
        include: {
          city: true,
          days: {
            include: {
              activities: {
                include: {
                  activity: true,
                },
                orderBy: {
                  order: 'asc'
                }
              },
            },
            orderBy: {
              date: 'asc'
            }
          },
        },
        orderBy: {
          order: 'asc'
        }
      },
    },
  })

  if (!trip) {
    notFound()
  }

  // Check if owner or shared public
  if (trip.ownerId !== session.user.id && !trip.isPublic) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 px-4 h-full flex flex-col">
      <ItineraryBuilder initialTrip={trip} isOwner={trip.ownerId === session.user.id} />
    </div>
  )
}
