import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import { TripListManager } from "@/components/trips/trip-list-manager"
import Link from "next/link"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "My Trips | GlobeTrotter",
  description: "Manage, customize, and share your multi-city travel itineraries",
}

export default async function TripsPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login")
  }

  let trips: any[] = []

  try {
    trips = await prisma.trip.findMany({
      where: {
        ownerId: session.user.id,
      },
      orderBy: {
        startDate: "asc",
      },
      include: {
        stops: {
          orderBy: { order: "asc" },
          include: {
            city: true,
          },
        },
        expenses: true,
      },
    })
  } catch (e) {
    // Graceful fallback
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-950 font-sans antialiased pb-24">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 inline-block" />
              <span>Expedition Repository</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
              My Trips
            </h1>
            <p className="text-sm text-zinc-600 font-light">
              Manage your past, present, and upcoming multi-city adventures.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <TripListManager
          initialTrips={trips.map((t) => ({
            id: t.id,
            name: t.name,
            description: t.description,
            startDate: t.startDate.toISOString(),
            endDate: t.endDate.toISOString(),
            budget: t.budget,
            coverImage: t.coverImage,
            shareToken: t.shareToken,
            stops: t.stops.map((s: any) => ({
              id: s.id,
              cityName: s.cityName || s.city?.name,
              city: s.city,
            })),
          }))}
        />
      </main>
    </div>
  )
}
