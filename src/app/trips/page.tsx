import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/db"
import { TripListManager } from "@/components/trips/trip-list-manager"
import Link from "next/link"
import { format } from "date-fns"
import {
  Plus,
  Calendar,
  CalendarDays,
  MapPin,
  Route,
  Wallet,
  Clock,
  ArrowRight,
  ArrowUpRight,
  Search,
  Trash2,
  Edit3,
  SlidersHorizontal,
  Layers,
  Globe2,
  CheckCircle2,
  Sparkles,
  Compass,
  ChevronRight,
  Bell,
  User,
  Luggage,
  X,
} from "lucide-react"

export const metadata: Metadata = {
  title: "My Trips | GlobeTrotter",
  description: "Your journeys, all in one place. Explore your past, present, and future multi-city travel itineraries.",
}

// Server Action for securely deleting a trip
async function deleteTripAction(formData: FormData) {
  "use server"
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect("/login")
  }

  const tripId = formData.get("tripId") as string
  if (tripId) {
    await prisma.trip.deleteMany({
      where: {
        id: tripId,
        ownerId: session.user.id,
      },
    })
    revalidatePath("/trips")
  }
}

// Inline GlobeTrotter Logo matching Home Page
function GlobeTrotterLogo({ className = "w-7 h-7" }: { className?: string }) {
  return (
    <div className="flex items-center gap-3 group cursor-pointer">
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-label="GlobeTrotter Emblem"
        >
          {/* Outer Ring */}
          <circle
            cx="20"
            cy="20"
            r="17"
            stroke="currentColor"
            strokeWidth="1.75"
            className="text-zinc-950 opacity-95 transition-opacity group-hover:opacity-100"
          />
          {/* Latitude & Longitude Geometrics */}
          <ellipse
            cx="20"
            cy="20"
            rx="8"
            ry="17"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2.5 2.5"
            className="text-zinc-400 opacity-70"
          />
          <line
            x1="3"
            y1="20"
            x2="37"
            y2="20"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2.5 2.5"
            className="text-zinc-400 opacity-70"
          />
          {/* Dynamic Travel Trajectory Route */}
          <path
            d="M8 27 C13 11, 25 9, 32 13"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            className="text-zinc-950"
          />
          {/* Origin and Destination Pin Nodes */}
          <circle cx="8" cy="27" r="2.25" className="fill-zinc-950" />
          <circle cx="32" cy="13" r="2.75" className="fill-zinc-950" />
          <circle
            cx="32"
            cy="13"
            r="5.5"
            stroke="currentColor"
            strokeWidth="0.75"
            className="text-zinc-950 animate-ping opacity-75"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold tracking-[0.24em] text-zinc-950 uppercase select-none font-mono">
          GLOBETROTTER
        </span>
        <span className="text-[9px] tracking-[0.2em] text-zinc-500 uppercase -mt-0.5 select-none font-sans">
          Expedition OS
        </span>
      </div>
    </div>
  )
}

// Fallback high-resolution travel photography
function getTripCoverImage(trip: {
  coverImage?: string | null
  stops?: Array<{ city?: { name?: string } | null }>
}) {
  if (trip.coverImage) return trip.coverImage

  const cityName = trip.stops?.[0]?.city?.name?.toLowerCase() || ""
  if (cityName.includes("paris"))
    return "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80"
  if (cityName.includes("tokyo"))
    return "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80"
  if (cityName.includes("rome"))
    return "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80"
  if (cityName.includes("amsterdam"))
    return "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1200&q=80"
  if (cityName.includes("dubai"))
    return "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80"
  if (cityName.includes("kyoto"))
    return "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80"
  if (cityName.includes("new york") || cityName.includes("nyc"))
    return "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80"
  if (cityName.includes("london"))
    return "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80"
  if (cityName.includes("barcelona"))
    return "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80"
  if (cityName.includes("zurich") || cityName.includes("swiss") || cityName.includes("alps"))
    return "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80"
  if (cityName.includes("oslo") || cityName.includes("bergen") || cityName.includes("troms"))
    return "https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?auto=format&fit=crop&w=1200&q=80"

  return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80"
}

// Calculate budget display for a trip
function calculateTripBudget(trip: {
  startDate: Date | string
  endDate: Date | string
  stops?: Array<any>
  expenses?: Array<{ amount: number }>
}) {
  if (trip.expenses && trip.expenses.length > 0) {
    const total = trip.expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
    if (total > 0) {
      return `₹${Math.round(total).toLocaleString("en-IN")}`
    }
  }
  const start = new Date(trip.startDate).getTime()
  const end = new Date(trip.endDate).getTime()
  const days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)))
  const stopCount = Math.max(1, trip.stops?.length || 1)
  const estimated = stopCount * 25000 + days * 3500
  return `₹${estimated.toLocaleString("en-IN")}`
}

// Format date range nicely
function formatTripDates(startDate: Date | string, endDate: Date | string) {
  try {
    const start = new Date(startDate)
    const end = new Date(endDate)
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return "Dates to be announced"
    }
    return `${format(start, "d MMM yyyy")} — ${format(end, "d MMM yyyy")}`
  } catch {
    return "Dates to be announced"
  }
}

// Calculate duration in days
function getTripDuration(startDate: Date | string, endDate: Date | string) {
  try {
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    const diff = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)))
    return `${diff} ${diff === 1 ? "Day" : "Days"}`
  } catch {
    return "1 Day"
  }
}

// Determine trip status
function getTripStatus(startDate: Date | string, endDate: Date | string) {
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (end < now) {
    return {
      label: "Completed",
      type: "completed" as const,
      badgeStyle: "bg-zinc-100 text-zinc-700 border-zinc-200",
      dotStyle: "bg-zinc-400",
    }
  }
  if (start > now) {
    return {
      label: "Upcoming",
      type: "upcoming" as const,
      badgeStyle: "bg-zinc-950 text-white border-zinc-900",
      dotStyle: "bg-white",
    }
  }
  return {
    label: "In Progress",
    type: "in_progress" as const,
    badgeStyle: "bg-zinc-900 text-white border-zinc-800",
    dotStyle: "bg-white animate-pulse",
  }
}

interface TripsPageProps {
  searchParams?: Promise<{
    q?: string
    status?: string
  }> | {
    q?: string
    status?: string
  }
}

export default async function TripsPage({ searchParams }: TripsPageProps) {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login")
  }

  const travelerName = session.user.name ? session.user.name.split(" ")[0] : "Traveler"

  // Fetch real trips for this user from Postgres DB
  const trips = await prisma.trip.findMany({
    where: {
      ownerId: session.user.id,
    },
    orderBy: {
      startDate: "asc",
    },
    include: {
      stops: {
        include: {
          city: true,
        },
        orderBy: {
          order: "asc",
        },
      },
      expenses: true,
    },
  })

  const resolvedParams = searchParams ? await searchParams : {}
  const searchQuery = (resolvedParams.q || "").trim().toLowerCase()
  const activeStatusFilter = resolvedParams.status || "all"

  const now = new Date()

  // Calculate statistics across all user trips
  const totalTripsCount = trips.length
  const upcomingCount = trips.filter(
    (t) => new Date(t.startDate) > now || (new Date(t.startDate) <= now && new Date(t.endDate) >= now)
  ).length
  const completedCount = trips.filter((t) => new Date(t.endDate) < now).length

  // Calculate total planned budget sum
  let totalPlannedBudget = 0
  trips.forEach((t) => {
    if (t.expenses && t.expenses.length > 0) {
      const sum = t.expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0)
      totalPlannedBudget += sum > 0 ? sum : 0
    } else {
      const start = new Date(t.startDate).getTime()
      const end = new Date(t.endDate).getTime()
      const days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)))
      const stopCount = Math.max(1, t.stops?.length || 1)
      totalPlannedBudget += stopCount * 25000 + days * 3500
    }
  })

  // Apply search & status filters
  const filteredTrips = trips.filter((trip) => {
    const statusInfo = getTripStatus(trip.startDate, trip.endDate)

    if (activeStatusFilter === "upcoming" && statusInfo.type !== "upcoming" && statusInfo.type !== "in_progress") {
      return false
    }
    if (activeStatusFilter === "completed" && statusInfo.type !== "completed") {
      return false
    }

    if (searchQuery) {
      const nameMatch = trip.name.toLowerCase().includes(searchQuery)
      const descMatch = trip.description?.toLowerCase().includes(searchQuery)
      const stopMatch = trip.stops.some(
        (s) =>
          s.city?.name?.toLowerCase().includes(searchQuery) ||
          s.city?.country?.toLowerCase().includes(searchQuery) ||
          s.cityName?.toLowerCase().includes(searchQuery)
      )
      return nameMatch || descMatch || stopMatch
    }

    return true
  })

  return (
    <div className="min-h-screen bg-zinc-50/60 text-zinc-900 selection:bg-zinc-950 selection:text-white font-sans antialiased pb-24">

      {/* ========================================================================= */}
      {/* 2. PAGE HEADER & PRIMARY CTA                                             */}
      {/* ========================================================================= */}
      <section className="pt-10 sm:pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
            <div className="space-y-2">
              {/* Editorial Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 animate-pulse" />
                <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-600 uppercase font-semibold">
                  Expedition Central • Multi-City OS
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl font-light tracking-tight text-zinc-950 leading-tight">
                My <span className="font-semibold">Trips</span>
              </h1>
              <p className="text-base sm:text-lg text-zinc-500 font-light max-w-xl">
                Your journeys, all in one place.
              </p>
            </div>

            {/* Primary Action Button */}
            <div className="flex items-center gap-3">
              <Link
                href="/trips/new"
                className="group inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-xl bg-zinc-950 text-white font-semibold text-xs tracking-wider uppercase font-mono shadow-sm hover:bg-zinc-800 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
                <span>+ Plan a New Trip</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. TRIP SUMMARY AREA (Monochrome Stat Cards)                              */}
      {/* ========================================================================= */}
      <section className="pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {/* Stat 1: Total Trips */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold">
                  TOTAL TRIPS
                </span>
                <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800">
                  <Route className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl sm:text-4xl font-light text-zinc-950 font-mono tracking-tight font-semibold">
                  {totalTripsCount.toString().padStart(2, "0")}
                </span>
                <span className="text-[11px] text-zinc-400 block mt-1 font-light">
                  Active & historical itineraries
                </span>
              </div>
            </div>

            {/* Stat 2: Upcoming */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold">
                  UPCOMING
                </span>
                <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl sm:text-4xl font-light text-zinc-950 font-mono tracking-tight font-semibold">
                  {upcomingCount.toString().padStart(2, "0")}
                </span>
                <span className="text-[11px] text-zinc-400 block mt-1 font-light">
                  Ready for departure
                </span>
              </div>
            </div>

            {/* Stat 3: Completed */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold">
                  COMPLETED
                </span>
                <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl sm:text-4xl font-light text-zinc-950 font-mono tracking-tight font-semibold">
                  {completedCount.toString().padStart(2, "0")}
                </span>
                <span className="text-[11px] text-zinc-400 block mt-1 font-light">
                  Past journeys archived
                </span>
              </div>
            </div>

            {/* Stat 4: Planned Budget */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-xs hover:border-zinc-300 transition-all flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold">
                  PLANNED BUDGET
                </span>
                <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800">
                  <Wallet className="w-4 h-4" />
                </div>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-light text-zinc-950 font-mono tracking-tight font-semibold">
                  ₹{totalPlannedBudget.toLocaleString("en-IN")}
                </span>
                <span className="text-[11px] text-zinc-400 block mt-1 font-light">
                  Across all expeditions
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SEARCH & FILTER CONTROLS                                               */}
      {/* ========================================================================= */}
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 md:pb-0 font-mono text-xs uppercase tracking-wider">
              <Link
                href={`/trips${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`}
                className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap font-medium ${
                  activeStatusFilter === "all"
                    ? "bg-zinc-950 text-white shadow-xs"
                    : "bg-transparent text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                }`}
              >
                All Trips ({totalTripsCount})
              </Link>
              <Link
                href={`/trips?status=upcoming${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
                className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap font-medium ${
                  activeStatusFilter === "upcoming"
                    ? "bg-zinc-950 text-white shadow-xs"
                    : "bg-transparent text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                }`}
              >
                Upcoming ({upcomingCount})
              </Link>
              <Link
                href={`/trips?status=completed${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`}
                className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap font-medium ${
                  activeStatusFilter === "completed"
                    ? "bg-zinc-950 text-white shadow-xs"
                    : "bg-transparent text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                }`}
              >
                Completed ({completedCount})
              </Link>
            </div>

            {/* Search Input Form */}
            <form method="GET" action="/trips" className="relative flex items-center">
              {activeStatusFilter !== "all" && (
                <input type="hidden" name="status" value={activeStatusFilter} />
              )}
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder="Search trip name, destination, city..."
                className="w-full md:w-80 pl-10 pr-10 py-2 rounded-xl border border-zinc-200 bg-zinc-50/50 hover:bg-white focus:bg-white text-xs font-sans text-zinc-900 placeholder:text-zinc-400 focus:outline-hidden focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 transition-all"
              />
              {searchQuery && (
                <Link
                  href={`/trips${activeStatusFilter !== "all" ? `?status=${activeStatusFilter}` : ""}`}
                  className="absolute right-3 text-zinc-400 hover:text-zinc-700"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </Link>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. TRIP CARDS SECTION / EMPTY STATE                                       */}
      {/* ========================================================================= */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Section Subheading */}
          <div className="flex items-center justify-between border-b border-zinc-200/80 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-zinc-950 tracking-tight">
                Your Journeys
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 font-light">
                {filteredTrips.length} {filteredTrips.length === 1 ? "expedition record" : "expedition records"} found
              </p>
            </div>
            <span className="text-[11px] font-mono tracking-wider uppercase text-zinc-400 hidden sm:inline-block">
              Sorted by Departure Date
            </span>
          </div>

          {/* Empty State */}
          {filteredTrips.length === 0 ? (
            <div className="py-16 sm:py-20 px-6 rounded-3xl bg-white border border-dashed border-zinc-300 text-center flex flex-col items-center justify-center max-w-2xl mx-auto shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 border border-zinc-200 text-zinc-800 flex items-center justify-center mb-5 shadow-inner">
                <Compass className="w-8 h-8 text-zinc-700" />
              </div>
              <h3 className="text-2xl font-semibold text-zinc-950 tracking-tight mb-2">
                {searchQuery
                  ? "No matching journeys found"
                  : activeStatusFilter !== "all"
                  ? `No ${activeStatusFilter} trips found`
                  : "Your next adventure starts here."}
              </h3>
              <p className="text-sm text-zinc-500 font-light max-w-md mb-8 leading-relaxed">
                {searchQuery
                  ? `We couldn't find any trips matching "${searchQuery}". Try a different keyword or clear your search.`
                  : "Create your first trip and start building an unforgettable multi-city journey with intelligent scheduling."}
              </p>

              {searchQuery ? (
                <Link
                  href="/trips"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-950 text-white font-mono text-xs uppercase tracking-wider font-semibold hover:bg-zinc-800 transition-all shadow-sm"
                >
                  Clear Filters
                </Link>
              ) : (
                <Link
                  href="/trips/new"
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-zinc-950 text-white font-mono text-xs uppercase tracking-wider font-semibold hover:bg-zinc-800 hover:scale-[1.02] transition-all shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Plan a New Trip</span>
                </Link>
              )}
            </div>
          ) : (
            /* Multi-Column Trip Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map((trip) => {
                const tripId = trip.id
                const tripName = trip.name
                const dateDisplay = formatTripDates(trip.startDate, trip.endDate)
                const durationText = getTripDuration(trip.startDate, trip.endDate)
                const statusInfo = getTripStatus(trip.startDate, trip.endDate)
                const budgetText = calculateTripBudget(trip)
                const coverImage = getTripCoverImage(trip)

                // Route description from stops
                const routeDescription =
                  trip.stops && trip.stops.length > 0
                    ? trip.stops.map((s) => s.city?.name || "Unknown").join(" → ")
                    : "Multi-City Expedition"

                const stopsCountText =
                  trip.stops.length > 0
                    ? `${trip.stops.length} ${trip.stops.length === 1 ? "City" : "Cities"}`
                    : "0 Cities"

                return (
                  <div
                    key={tripId}
                    className="group relative flex flex-col justify-between rounded-2xl bg-white border border-zinc-200/90 hover:border-zinc-400/80 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
                  >
                    {/* Top Image Header */}
                    <div className="relative h-48 w-full overflow-hidden bg-zinc-950">
                      <img
                        src={coverImage}
                        alt={tripName}
                        className="w-full h-full object-cover grayscale contrast-110 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 ease-out"
                      />
                      {/* Deep gradient overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />

                      {/* Top-Left: Monochrome Status Badge */}
                      <div className="absolute top-3.5 left-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase backdrop-blur-md shadow-xs border ${statusInfo.badgeStyle}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotStyle}`} />
                          {statusInfo.label}
                        </span>
                      </div>

                      {/* Top-Right: Stops Count Badge */}
                      <div className="absolute top-3.5 right-3.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-white/95 backdrop-blur-md text-zinc-950 border border-zinc-200 font-semibold shadow-xs">
                          {stopsCountText}
                        </span>
                      </div>

                      {/* Bottom-Left/Right: Route Trajectory Overlay */}
                      <div className="absolute bottom-3 left-4 right-4">
                        <p className="text-xs font-mono tracking-wide text-zinc-200 truncate flex items-center gap-1.5 drop-shadow-sm">
                          <MapPin className="w-3.5 h-3.5 text-white shrink-0" />
                          <span>{routeDescription}</span>
                        </p>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-lg sm:text-xl font-semibold text-zinc-950 tracking-tight group-hover:text-zinc-800 transition-colors line-clamp-1">
                            {tripName}
                          </h3>
                        </div>

                        {trip.description && (
                          <p className="text-xs text-zinc-500 font-light line-clamp-1">
                            {trip.description}
                          </p>
                        )}

                        <div className="flex items-center gap-2 text-xs text-zinc-600 font-light pt-1">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span className="font-mono text-[11px]">{dateDisplay}</span>
                        </div>
                      </div>

                      {/* Destination City Tags */}
                      {trip.stops.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {trip.stops.slice(0, 3).map((stop) => (
                            <span
                              key={stop.id}
                              className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200/70"
                            >
                              {stop.city?.name || "Unknown"}
                            </span>
                          ))}
                          {trip.stops.length > 3 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-100 text-zinc-500 border border-zinc-200/70">
                              +{trip.stops.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Metadata Row: Budget & Duration */}
                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-100 text-xs">
                        <div>
                          <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase block">
                            Budget
                          </span>
                          <span className="font-semibold text-zinc-950 font-mono text-sm">
                            {budgetText}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase block">
                            Duration
                          </span>
                          <span className="font-semibold text-zinc-700 font-mono text-xs">
                            {durationText}
                          </span>
                        </div>
                      </div>

                      {/* Card Action Buttons (View Trip, Edit, Delete) */}
                      <div className="pt-2 flex items-center gap-2">
                        {/* Primary View Trip CTA */}
                        <Link
                          href={`/trips/${trip.id}`}
                          className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-xs hover:shadow transition-all duration-200"
                        >
                          <span>View Trip</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        {/* Edit Action Button */}
                        <Link
                          href={`/trips/${trip.id}`}
                          className="p-2.5 rounded-xl border border-zinc-200 hover:border-zinc-950 hover:bg-zinc-100 text-zinc-600 hover:text-zinc-950 transition-all"
                          title="Edit Itinerary"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>

                        {/* Delete Action Server Form */}
                        <form action={deleteTripAction}>
                          <input type="hidden" name="tripId" value={trip.id} />
                          <button
                            type="submit"
                            className="p-2.5 rounded-xl border border-zinc-200 hover:border-red-300 hover:bg-red-50 text-zinc-400 hover:text-red-600 transition-all cursor-pointer"
                            title="Delete Trip"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
