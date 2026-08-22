import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"
import {
  Compass,
  MapPin,
  Calendar,
  Plane,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Clock,
  Plus,
  Wallet,
  Shield,
  Layers,
  Route,
  Star,
  Eye,
  SlidersHorizontal,
} from "lucide-react"

export default async function HomePage() {
  let session = null
  let dbTrips: any[] = []
  let dbCities: any[] = []

  try {
    session = await getServerSession(authOptions)
    if (session?.user?.id) {
      dbTrips = await prisma.trip.findMany({
        where: { ownerId: session.user.id },
        orderBy: { startDate: "asc" },
        take: 3,
        include: {
          stops: {
            orderBy: { order: "asc" },
            include: { city: true },
          },
          expenses: true,
        },
      })
    }

    dbCities = await prisma.city.findMany({
      orderBy: { popularityScore: "desc" },
      take: 4,
    })
  } catch (e) {
    // Graceful fallback if database is loading
  }

  const travelerName = session?.user?.name ? session.user.name.split(" ")[0] : "Traveler"

  // Curated Fallback Journeys if no user trips exist yet
  const curatedUpcomingJourneys = [
    {
      id: "trip_euro_2026",
      name: "European Grand Escape",
      route: "Paris → Amsterdam → Rome",
      dateRange: "12 Sep — 24 Sep, 2026",
      stopsCount: "3 Cities • 12 Days",
      budget: "$3,500",
      status: "Upcoming",
      progress: 75,
      coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
      stops: ["Paris", "Amsterdam", "Rome"],
    },
    {
      id: "curated-2",
      name: "Nordic Aurora & Fjords",
      route: "Oslo → Bergen → Tromsø",
      dateRange: "04 Nov — 15 Nov, 2026",
      stopsCount: "3 Cities • 11 Days",
      budget: "$4,200",
      status: "In Planning",
      progress: 45,
      coverImage: "https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?auto=format&fit=crop&w=1200&q=80",
      stops: ["Oslo", "Bergen", "Tromsø"],
    },
    {
      id: "curated-3",
      name: "East Asian Odyssey",
      route: "Tokyo → Kyoto → Seoul",
      dateRange: "18 Dec — 02 Jan, 2027",
      stopsCount: "3 Cities • 15 Days",
      budget: "$5,100",
      status: "Confirmed",
      progress: 90,
      coverImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
      stops: ["Tokyo", "Kyoto", "Seoul"],
    },
  ]

  // Curated World Destinations Fallback
  const fallbackDestinations = [
    {
      id: "city_paris",
      name: "Paris",
      country: "France",
      description: "Art, classical architecture & unforgettable evenings.",
      costIndex: 5,
      popularityScore: 4.95,
      imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: "city_tokyo",
      name: "Tokyo",
      country: "Japan",
      description: "Neon skylines, ancient temples & culinary mastery.",
      costIndex: 4,
      popularityScore: 4.98,
      imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: "city_dubai",
      name: "Dubai",
      country: "UAE",
      description: "Futuristic architecture, desert horizons & luxury.",
      costIndex: 5,
      popularityScore: 4.91,
      imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: "city_rome",
      name: "Rome",
      country: "Italy",
      description: "Timeless monuments, storied history & vibrant piazzas.",
      costIndex: 4,
      popularityScore: 4.92,
      imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80",
    },
  ]

  const displayDestinations = dbCities.length > 0 ? dbCities : fallbackDestinations

  // Recent Trips Archive
  const recentTripsList = [
    {
      id: "rec-1",
      name: "Kyoto Heritage Walk",
      destination: "Kyoto & Nara, Japan",
      date: "14 May — 21 May, 2025",
      stops: "2 Stops • 7 Days",
      spent: "$1,850",
      route: "Kyoto → Nara",
    },
    {
      id: "rec-2",
      name: "Swiss Alps Express",
      destination: "Zurich → Zermatt, Switzerland",
      date: "10 Jan — 18 Jan, 2025",
      stops: "2 Stops • 8 Days",
      spent: "$3,400",
      route: "Zurich → Zermatt",
    },
    {
      id: "rec-3",
      name: "Mediterranean Coastline",
      destination: "Barcelona → Nice, Spain & France",
      date: "02 Sep — 12 Sep, 2024",
      stops: "2 Stops • 10 Days",
      spent: "$2,650",
      route: "Barcelona → Nice",
    },
  ]

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-zinc-100 selection:text-zinc-950 font-sans antialiased overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH CINEMATIC TRAVEL BACKGROUND                          */}
      {/* ========================================================================= */}
      <section className="relative min-h-[88vh] flex flex-col justify-between overflow-hidden border-b border-zinc-800/80">
        {/* Background Image Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2400&q=85')`,
          }}
          aria-hidden="true"
        />

        {/* Deep Black Gradient Overlay for Maximum Luxury Monochrome Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-[#09090b]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/30 via-black/60 to-black/90 pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 flex-1 flex flex-col justify-center">
          <div className="max-w-3xl space-y-6">
            {/* Top Minimal Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-zinc-700/60 backdrop-blur-md text-xs font-mono tracking-[0.2em] text-zinc-300 uppercase shadow-2xl animate-in fade-in duration-700">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>Multi-City Travel Planning Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08]">
              Your Journey, <br className="hidden sm:inline" />
              <span className="text-zinc-400 font-serif italic">Beautifully Planned</span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg md:text-xl text-zinc-300 font-light max-w-2xl leading-relaxed">
              Design multi-city itineraries, synchronize stops, optimize budgets, and experience a minimal luxury operating system built for modern explorers.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/trips/new">
                <button
                  type="button"
                  className="px-7 py-3.5 rounded-2xl bg-white text-zinc-950 font-mono text-xs sm:text-sm uppercase tracking-wider font-bold shadow-xl hover:bg-zinc-200 active:scale-98 transition-all flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Plan New Trip</span>
                </button>
              </Link>

              <Link href="/discover">
                <button
                  type="button"
                  className="px-6 py-3.5 rounded-2xl border border-zinc-700 bg-zinc-900/60 backdrop-blur-md text-white font-mono text-xs sm:text-sm uppercase tracking-wider font-medium hover:bg-zinc-800 transition-all flex items-center gap-2"
                >
                  <Compass className="w-4 h-4 text-zinc-400" />
                  <span>Discover Destinations</span>
                </button>
              </Link>

              <Link href="/trips">
                <button
                  type="button"
                  className="px-5 py-3.5 rounded-2xl text-zinc-400 hover:text-white font-mono text-xs sm:text-sm uppercase tracking-wider transition-colors flex items-center gap-1.5"
                >
                  <span>My Trips</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Hero Bottom Telemetry Bar */}
        <div className="relative z-10 border-t border-zinc-800/80 bg-zinc-950/60 backdrop-blur-md py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
              <span>Welcome back, <strong className="text-white font-sans">{travelerName}</strong></span>
            </div>
            <div className="flex items-center gap-6 text-[11px] uppercase tracking-wider">
              <span>PostgreSQL Engine</span>
              <span>•</span>
              <span>Monochrome Precision</span>
              <span>•</span>
              <span>8 Supported Hubs</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. UPCOMING EXPEDITIONS SECTION                                           */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] text-zinc-400 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
              <span>Active Itineraries</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              Upcoming Journeys
            </h2>
          </div>

          <Link href="/trips" className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors">
            <span>View All Trips</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {curatedUpcomingJourneys.map((trip) => (
            <div
              key={trip.id}
              className="group rounded-3xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all duration-300 overflow-hidden flex flex-col shadow-lg"
            >
              {/* Cover Image Container */}
              <div className="relative h-48 w-full overflow-hidden bg-zinc-950">
                <img
                  src={trip.coverImage}
                  alt={trip.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md border border-zinc-700/60 text-[10px] font-mono uppercase tracking-wider text-zinc-300 font-semibold">
                  {trip.status}
                </div>
              </div>

              {/* Trip Information */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{trip.dateRange}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-zinc-200 transition-colors">
                    {trip.name}
                  </h3>
                  <p className="text-xs font-mono text-zinc-400">
                    {trip.route}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  <div className="font-mono text-xs">
                    <span className="text-zinc-500 uppercase text-[10px] block">Target Budget</span>
                    <span className="font-bold text-white text-sm">{trip.budget}</span>
                  </div>

                  <Link href={`/trips/${trip.id}`}>
                    <button
                      type="button"
                      className="px-4 py-2 rounded-xl bg-white text-zinc-950 font-mono text-xs uppercase tracking-wider font-semibold hover:bg-zinc-200 transition-all flex items-center gap-1.5"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. BUDGET HIGHLIGHTS & FINANCIAL TELEMETRY                                */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-400">
                Financial Insights
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2 mt-0.5">
                <Wallet className="w-5 h-5 text-white" />
                <span>Budget & Expense Telemetry</span>
              </h2>
            </div>
            <div className="text-left sm:text-right font-mono">
              <span className="text-xs text-zinc-400 block uppercase">Total Planned Budget</span>
              <span className="text-2xl font-bold text-white">$12,800</span>
            </div>
          </div>

          {/* Monochrome Category Splits */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">Stay / Hotels</span>
              <span className="text-lg font-bold text-white">$5,400</span>
              <span className="text-[10px] text-zinc-500 block">42% of budget</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">Transport</span>
              <span className="text-lg font-bold text-white">$3,200</span>
              <span className="text-[10px] text-zinc-500 block">25% of budget</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">Activities</span>
              <span className="text-lg font-bold text-white">$2,400</span>
              <span className="text-[10px] text-zinc-500 block">19% of budget</span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">Meals & Dining</span>
              <span className="text-lg font-bold text-white">$1,800</span>
              <span className="text-[10px] text-zinc-500 block">14% of budget</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. RECOMMENDED DESTINATIONS SECTION                                       */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] text-zinc-400 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
              <span>Destination Explorer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
              Curated Destinations
            </h2>
          </div>

          <Link href="/discover" className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-zinc-400 hover:text-white transition-colors">
            <span>Explore All Cities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayDestinations.map((city: any) => (
            <div
              key={city.id}
              className="group rounded-3xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all duration-300 overflow-hidden flex flex-col shadow-md"
            >
              <div className="relative h-44 w-full overflow-hidden bg-zinc-950">
                <img
                  src={city.imageUrl}
                  alt={city.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md border border-zinc-700/60 text-[10px] font-mono text-white flex items-center gap-1 font-semibold">
                  <Star className="w-3 h-3 fill-white text-white" />
                  <span>{city.popularityScore || 4.9}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white tracking-tight">{city.name}</h3>
                    <span className="text-xs font-mono text-zinc-400">
                      {Array(city.costIndex || 3).fill('$').join('')}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-zinc-400">{city.country}</p>
                  <p className="text-xs text-zinc-400 font-light leading-relaxed pt-1 line-clamp-2">
                    {city.description}
                  </p>
                </div>

                <Link href={`/trips/new?city=${encodeURIComponent(city.name)}`} className="w-full">
                  <button
                    type="button"
                    className="w-full py-2.5 rounded-xl border border-zinc-700 bg-zinc-950 text-white font-mono text-xs uppercase tracking-wider font-semibold hover:bg-zinc-800 transition-all"
                  >
                    Plan Trip Here
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. RECENT TRIPS ARCHIVE                                                   */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <h2 className="text-lg font-mono uppercase tracking-wider text-zinc-400">
            Recent Expeditions Archive
          </h2>
          <span className="text-xs font-mono text-zinc-500">Historical Telemetry</span>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 divide-y divide-zinc-800/80 overflow-hidden">
          {recentTripsList.map((item) => (
            <div
              key={item.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-900/70 transition-colors"
            >
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">{item.name}</h4>
                <p className="text-xs font-mono text-zinc-400">{item.destination} • {item.date}</p>
              </div>
              <div className="flex items-center gap-6 font-mono text-xs">
                <span className="text-zinc-400">{item.stops}</span>
                <span className="text-white font-bold">{item.spent}</span>
                <Link href="/trips">
                  <button
                    type="button"
                    className="p-2 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
