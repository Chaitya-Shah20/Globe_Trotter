import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import Link from "next/link"
import { Plus, Calendar, MapPin, ArrowRight, Wallet, Compass, Plane, Route, Star } from "lucide-react"

export const metadata: Metadata = {
  title: "Dashboard | GlobeTrotter",
  description: "Overview of your upcoming trips and travel metrics",
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login")
  }

  let userTrips: any[] = []
  let popularCities: any[] = []

  try {
    userTrips = await prisma.trip.findMany({
      where: { ownerId: session.user.id },
      orderBy: { startDate: "asc" },
      include: {
        stops: {
          orderBy: { order: "asc" },
          include: { city: true },
        },
        expenses: true,
      },
    })

    popularCities = await prisma.city.findMany({
      orderBy: { popularityScore: "desc" },
      take: 4,
    })
  } catch (e) {
    // Database fallback
  }

  const upcomingTrips = userTrips.filter((t) => new Date(t.endDate) >= new Date())
  const pastTrips = userTrips.filter((t) => new Date(t.endDate) < new Date())

  const totalSpent = userTrips.reduce((acc, t) => {
    const tripExpenses = t.expenses?.reduce((sum: number, exp: any) => sum + (exp.amount || 0), 0) || 0
    return acc + tripExpenses
  }, 0)

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-950 font-sans antialiased pb-24">
      {/* Dashboard Top Header */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 inline-block" />
              <span>Expedition Control Center</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-950">
              Welcome back, {session.user.name?.split(" ")[0] || "Traveler"}
            </h1>
            <p className="text-sm text-zinc-600 font-light">
              Manage your upcoming multi-city journeys and telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/trips/new">
              <button
                type="button"
                className="px-5 py-2.5 rounded-xl bg-zinc-950 text-white font-mono text-xs uppercase tracking-wider font-semibold shadow-xs hover:bg-zinc-800 active:scale-98 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Plan New Trip</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Quick Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
          <div className="p-5 rounded-2xl border border-zinc-200 bg-white shadow-xs space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 block">Total Expeditions</span>
            <span className="text-2xl font-bold text-zinc-950">{userTrips.length}</span>
            <span className="text-[10px] text-zinc-500 block">{upcomingTrips.length} upcoming</span>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-200 bg-white shadow-xs space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 block">Cities Visited</span>
            <span className="text-2xl font-bold text-zinc-950">
              {userTrips.reduce((acc, t) => acc + (t.stops?.length || 0), 0)}
            </span>
            <span className="text-[10px] text-zinc-500 block">multi-city routes</span>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-200 bg-white shadow-xs space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 block">Total Recorded Spend</span>
            <span className="text-2xl font-bold text-zinc-950">
              ${totalSpent.toLocaleString("en-US")}
            </span>
            <span className="text-[10px] text-zinc-500 block">across all journeys</span>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-200 bg-white shadow-xs space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-zinc-400 block">Platform Status</span>
            <span className="text-2xl font-bold text-zinc-950">Active</span>
            <span className="text-[10px] text-zinc-500 block">PostgreSQL Live</span>
          </div>
        </div>

        {/* Active & Upcoming Trips */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <div>
              <h2 className="text-xl font-bold text-zinc-950 tracking-tight">Active & Upcoming Trips</h2>
              <p className="text-xs text-zinc-500 font-mono">Your scheduled itineraries</p>
            </div>

            <Link href="/trips" className="text-xs font-mono uppercase tracking-wider text-zinc-600 hover:text-zinc-950 flex items-center gap-1">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {upcomingTrips.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-12 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400">
                <Plane className="w-7 h-7 text-zinc-600" />
              </div>
              <div className="space-y-1 max-w-sm mx-auto">
                <h3 className="text-base font-bold text-zinc-950">No upcoming trips planned</h3>
                <p className="text-xs text-zinc-500 font-light">
                  Ready for your next adventure? Start crafting a new multi-city itinerary.
                </p>
              </div>
              <Link href="/trips/new">
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-xl bg-zinc-950 text-white font-mono text-xs uppercase tracking-wider font-semibold hover:bg-zinc-800 transition-all inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Your First Trip</span>
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="group rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all duration-300 overflow-hidden flex flex-col shadow-xs"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-zinc-100">
                    <img
                      src={trip.coverImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80"}
                      alt={trip.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono font-semibold uppercase text-zinc-900 shadow-xs">
                      Upcoming
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-zinc-950 tracking-tight">{trip.name}</h3>
                      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {new Date(trip.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} —{" "}
                          {new Date(trip.endDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {trip.stops?.slice(0, 3).map((stop: any) => (
                          <span
                            key={stop.id}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono bg-zinc-100 text-zinc-800"
                          >
                            {stop.cityName || stop.city?.name || stop.city}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-zinc-950">
                        ${(trip.budget || 0).toLocaleString("en-US")}
                      </span>

                      <Link href={`/trips/${trip.id}`}>
                        <button
                          type="button"
                          className="px-4 py-1.5 rounded-lg bg-zinc-950 text-white font-mono text-xs uppercase tracking-wider font-semibold hover:bg-zinc-800 transition-all"
                        >
                          View
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Destinations Bar */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
            <h2 className="text-xl font-bold text-zinc-950 tracking-tight">Trending Destinations</h2>
            <Link href="/discover" className="text-xs font-mono uppercase tracking-wider text-zinc-600 hover:text-zinc-950">
              Explore All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {popularCities.map((city: any) => (
              <Link key={city.id} href={`/trips/new?city=${encodeURIComponent(city.name)}`}>
                <div className="group rounded-2xl border border-zinc-200 bg-white p-4 hover:border-zinc-300 transition-all shadow-xs flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                    <img src={city.imageUrl} alt={city.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-zinc-950 truncate">{city.name}</h4>
                    <p className="text-xs font-mono text-zinc-500 truncate">{city.country}</p>
                    <span className="text-[10px] font-mono text-zinc-400 block mt-0.5">
                      {Array(city.costIndex || 3).fill('$').join('')} • ★ {city.popularityScore || 4.9}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
