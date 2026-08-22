import Link from "next/link"
import { getServerSession } from "next-auth"
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
  Globe2,
  Plus,
  Wallet,
  Shield,
  Navigation,
  Luggage,
  TrendingUp,
  Bell,
  User,
  Search,
  Eye,
  SlidersHorizontal,
  Layers,
  Route,
  Activity,
  Bookmark,
  Share2
} from "lucide-react"

// Professional Inline GlobeTrotter Logo Component
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
            className="text-white opacity-95 transition-opacity group-hover:opacity-100"
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
            className="text-zinc-500 opacity-70"
          />
          {/* Dynamic Travel Trajectory Route */}
          <path
            d="M8 27 C13 11, 25 9, 32 13"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Origin and Destination Pin Nodes */}
          <circle cx="8" cy="27" r="2.25" fill="white" />
          <circle cx="32" cy="13" r="2.75" fill="white" />
          <circle
            cx="32"
            cy="13"
            r="5.5"
            stroke="white"
            strokeWidth="0.75"
            className="animate-ping opacity-75"
          />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold tracking-[0.24em] text-white uppercase select-none font-mono">
          GLOBETROTTER
        </span>
        <span className="text-[9px] tracking-[0.2em] text-zinc-400 uppercase -mt-0.5 select-none font-sans">
          Expedition OS
        </span>
      </div>
    </div>
  )
}

export default async function Home() {
  let session = null
  try {
    session = await getServerSession()
  } catch (e) {
    // Graceful fallback if auth provider is not configured
  }

  // Safe greeting detection
  const travelerName = session?.user?.name ? session.user.name.split(" ")[0] : "Traveler"

  // Curated Fallback Journeys
  const curatedUpcomingJourneys = [
    {
      id: "curated-1",
      name: "European Grand Escape",
      route: "Paris → Amsterdam → Rome",
      dateRange: "12 Sep — 24 Sep, 2026",
      stopsCount: "3 Cities • 12 Days",
      budget: "₹85,000",
      status: "Confirmed",
      progress: 85,
      coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
      stops: ["Paris", "Amsterdam", "Rome"],
    },
    {
      id: "curated-2",
      name: "Nordic Aurora & Fjords",
      route: "Oslo → Bergen → Tromsø",
      dateRange: "04 Nov — 15 Nov, 2026",
      stopsCount: "3 Cities • 11 Days",
      budget: "₹1,20,000",
      status: "In Planning",
      progress: 50,
      coverImage: "https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?auto=format&fit=crop&w=1200&q=80",
      stops: ["Oslo", "Bergen", "Tromsø"],
    },
    {
      id: "curated-3",
      name: "East Asian Odyssey",
      route: "Tokyo → Kyoto → Seoul",
      dateRange: "18 Dec — 02 Jan, 2027",
      stopsCount: "3 Cities • 15 Days",
      budget: "₹1,45,000",
      status: "Booked",
      progress: 100,
      coverImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
      stops: ["Tokyo", "Kyoto", "Seoul"],
    },
  ]

  // Curated World Destinations
  const curatedDestinations = [
    {
      id: "dest-paris",
      name: "Paris",
      country: "France",
      descriptor: "Art, architecture & unforgettable evenings.",
      cost: "$$$$",
      tag: "Cultural Classic",
      image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: "dest-tokyo",
      name: "Tokyo",
      country: "Japan",
      descriptor: "Neon skylines, ancient temples & culinary mastery.",
      cost: "$$$$",
      tag: "Trending High",
      image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: "dest-dubai",
      name: "Dubai",
      country: "UAE",
      descriptor: "Futuristic architecture, desert horizons & luxury.",
      cost: "$$$$$",
      tag: "Modern Wonder",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: "dest-rome",
      name: "Rome",
      country: "Italy",
      descriptor: "Timeless monuments, storied history & vibrant piazzas.",
      cost: "$$$",
      tag: "Heritage Heart",
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80",
    },
  ]

  // Recent Trips Archive
  const recentTripsList = [
    {
      id: "rec-1",
      name: "Kyoto Heritage Walk",
      destination: "Kyoto & Nara, Japan",
      date: "14 May — 21 May, 2025",
      stops: "2 Stops • 7 Days",
      spent: "₹54,200",
      route: "Kyoto → Nara",
    },
    {
      id: "rec-2",
      name: "Swiss Alps Express",
      destination: "Zurich → Zermatt, Switzerland",
      date: "10 Jan — 18 Jan, 2025",
      stops: "2 Stops • 8 Days",
      spent: "₹98,000",
      route: "Zurich → Zermatt",
    },
    {
      id: "rec-3",
      name: "Mediterranean Coastline",
      destination: "Barcelona → Nice, Spain & France",
      date: "02 Sep — 12 Sep, 2024",
      stops: "2 Stops • 10 Days",
      spent: "₹76,500",
      route: "Barcelona → Nice",
    },
  ]
  const displayTrips = curatedUpcomingJourneys

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 selection:bg-zinc-100 selection:text-zinc-950 font-sans antialiased overflow-x-hidden">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION WITH CINEMATIC BACKGROUND & INTEGRATED HEADER           */}
      {/* ========================================================================= */}
      <div className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden border-b border-zinc-800/80">
        {/* Background Image Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2400&q=85')`,
          }}
          aria-hidden="true"
        />

        {/* Deep Black Gradient Overlay for Maximum Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/75 to-[#09090b]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/30 via-black/60 to-black/90 pointer-events-none" />

        {/* ----------------------------------------------------------------------- */}
        {/* HEADER / NAVIGATION OVER HERO                                          */}
        {/* ----------------------------------------------------------------------- */}
        <header className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex items-center justify-between py-3 px-5 sm:px-6 rounded-2xl bg-zinc-950/70 backdrop-blur-xl border border-white/10 shadow-2xl">
            {/* Left: GlobeTrotter Brand Logo */}
            <Link href="/" className="hover:opacity-90 transition-opacity">
              <GlobeTrotterLogo />
            </Link>

            {/* Center: Minimal Navigation */}
            <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.18em] font-medium text-zinc-300 font-mono">
              <Link
                href="/dashboard"
                className="hover:text-white transition-colors duration-200 py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
              >
                Dashboard
              </Link>
              <Link
                href="/trips"
                className="hover:text-white transition-colors duration-200 py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
              >
                My Trips
              </Link>
              <Link
                href="/discover"
                className="hover:text-white transition-colors duration-200 py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
              >
                Discover
              </Link>
            </nav>

            {/* Right: Notifications & User Profile */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                type="button"
                aria-label="Notifications"
                className="relative p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-white ring-2 ring-zinc-950" />
              </button>

              <div className="h-4 w-[1px] bg-zinc-800 hidden sm:block" />

              {session ? (
                <Link
                  href="/profile"
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-zinc-900/90 border border-white/10 hover:border-white/30 hover:bg-zinc-800 transition-all text-xs font-medium"
                >
                  <div className="w-6 h-6 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold text-xs uppercase">
                    {travelerName.charAt(0)}
                  </div>
                  <span className="hidden sm:inline text-zinc-200">{travelerName}</span>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="text-xs tracking-wider uppercase font-mono text-zinc-300 hover:text-white px-3 py-1.5 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="text-xs tracking-wider uppercase font-mono bg-white text-zinc-950 px-3.5 py-1.5 rounded-xl font-semibold hover:bg-zinc-200 transition-all"
                  >
                    Join
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ----------------------------------------------------------------------- */}
        {/* HERO COPY & CALL TO ACTIONS                                            */}
        {/* ----------------------------------------------------------------------- */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 my-auto w-full">
          <div className="max-w-3xl space-y-8">
            {/* Subtle Editorial Pill */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-zinc-900/80 border border-white/15 backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[11px] font-mono tracking-[0.2em] text-zinc-300 uppercase">
                Intelligent Multi-City Platform
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.08]">
                Your Journey,{" "}
                <span className="font-semibold italic font-serif text-zinc-100 block sm:inline">
                  Beautifully Planned.
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-zinc-300 font-light leading-relaxed max-w-2xl">
                Plan unforgettable multi-city adventures, organize every stop, and keep your journey within budget with precision engineering.
              </p>
            </div>

            {/* Primary & Secondary Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/trips/new"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-white text-zinc-950 font-semibold text-sm tracking-wide uppercase font-mono shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:bg-zinc-200 hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
                <span>Plan a New Trip</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" />
              </Link>

              <Link
                href="/discover"
                className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-zinc-950/70 text-zinc-200 hover:text-white font-medium text-sm tracking-wide uppercase font-mono border border-white/20 hover:border-white/50 backdrop-blur-md hover:bg-zinc-900/80 transition-all duration-300"
              >
                <Compass className="w-4 h-4 transition-transform group-hover:rotate-45 duration-300" />
                <span>Explore Destinations</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* WELCOME SECTION / EXPEDITION BANNER                                    */}
        {/* ----------------------------------------------------------------------- */}
        <div className="relative z-20 w-full bg-gradient-to-t from-[#09090b] via-[#09090b]/90 to-transparent pt-12 pb-8 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-zinc-400">
                  <Plane className="w-3.5 h-3.5 text-zinc-300" />
                  <span>Expedition Central</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
                  Good morning, <span className="font-semibold">{travelerName}</span>.
                </h2>
                <p className="text-sm text-zinc-400 font-light">
                  Where will you go next? Your active itineraries, budget telemetry, and discovery queue are synchronized.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-zinc-400 border-l border-zinc-800 pl-4">
                <div>
                  <span className="text-zinc-500 block">Status:</span>
                  <span className="text-zinc-200 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
                    Itinerary Ready
                  </span>
                </div>
                <div className="h-6 w-[1px] bg-zinc-800" />
                <div>
                  <span className="text-zinc-500 block">Currency:</span>
                  <span className="text-zinc-200 font-semibold">INR (₹)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. QUICK ACTIONS                                                         */}
      {/* ========================================================================= */}
      <section className="py-12 border-b border-zinc-800/80 bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Action 1: Plan New Trip (Hero/Primary Card) */}
            <Link
              href="/trips/new"
              className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-zinc-900/90 to-zinc-950 border border-white/20 hover:border-white/50 shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-white text-zinc-950 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Plus className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white tracking-tight flex items-center justify-between">
                  <span>Plan a New Trip</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                  Build your next multi-city adventure with day-by-day mapping and smart scheduling.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono tracking-wider text-zinc-300 group-hover:text-white uppercase">
                <span>Start Itinerary</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Action 2: My Trips */}
            <Link
              href="/trips"
              className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-zinc-900/80"
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Route className="w-5 h-5 text-zinc-200" />
                </div>
                <h3 className="text-lg font-semibold text-white tracking-tight flex items-center justify-between">
                  <span>My Trips</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                  Access saved multi-city routes, organized stops, and timeline overviews.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono tracking-wider text-zinc-400 group-hover:text-zinc-200 uppercase">
                <span>View All Records</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>

            {/* Action 3: Explore Destinations */}
            <Link
              href="/discover"
              className="group relative flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 shadow-md transition-all duration-300 hover:-translate-y-1 hover:bg-zinc-900/80 sm:col-span-2 lg:col-span-1"
            >
              <div className="space-y-3">
                <div className="w-11 h-11 rounded-xl bg-zinc-800 border border-zinc-700 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Globe2 className="w-5 h-5 text-zinc-200" />
                </div>
                <h3 className="text-lg font-semibold text-white tracking-tight flex items-center justify-between">
                  <span>Explore Destinations</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                  Discover popular world cities, cost indexes, and recommended multi-city pairings.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono tracking-wider text-zinc-400 group-hover:text-zinc-200 uppercase">
                <span>Global Discovery</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. UPCOMING JOURNEYS                                                     */}
      {/* ========================================================================= */}
      <section className="py-16 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
                Itinerary Telemetry
              </span>
              <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
                Upcoming <span className="font-semibold">Journeys</span>
              </h2>
              <p className="text-sm text-zinc-400 font-light">
                Handcrafted multi-city itineraries ready for exploration and execution.
              </p>
            </div>
            <Link
              href="/trips"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white transition-colors group"
            >
              <span>View Full Itinerary Archive</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Trips Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTrips.map((trip: any, idx: number) => {
              // Extract data cleanly whether from DB or Curated
              const tripId = trip.id
              const tripName = trip.name
              const routeDescription =
                trip.route ||
                (trip.stops && trip.stops.length > 0
                  ? trip.stops.map((s: any) => s.city?.name || "City").join(" → ")
                  : "Multi-City Expedition")
              const dateDisplay =
                trip.dateRange ||
                (trip.startDate && trip.endDate
                  ? `${new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} — ${new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
                  : "Upcoming Dates")
              const stopsText =
                trip.stopsCount ||
                `${trip.stops?.length || 3} Cities`
              const budgetText = trip.budget || "₹85,000 Budget"
              const status = trip.status || "Confirmed"
              const image =
                trip.coverImage ||
                "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80"

              return (
                <div
                  key={tripId || idx}
                  className="group relative flex flex-col justify-between rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-white/30 overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1.5"
                >
                  {/* Card Visual Header */}
                  <div className="relative h-48 w-full overflow-hidden bg-zinc-950">
                    <img
                      src={image}
                      alt={tripName}
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                    {/* Status Badge */}
                    <div className="absolute top-3.5 left-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-zinc-950/80 backdrop-blur-md text-white border border-white/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        {status}
                      </span>
                    </div>

                    {/* Stops Count Badge */}
                    <div className="absolute top-3.5 right-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-zinc-950/80 backdrop-blur-md text-zinc-300 border border-white/10">
                        {stopsText}
                      </span>
                    </div>

                    {/* Route Overlay Text */}
                    <div className="absolute bottom-3 left-4 right-4">
                      <p className="text-xs font-mono tracking-wide text-zinc-300 truncate">
                        {routeDescription}
                      </p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-5">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-white tracking-tight group-hover:text-zinc-100 transition-colors line-clamp-1">
                        {tripName}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-zinc-400 font-light">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                        <span>{dateDisplay}</span>
                      </div>
                    </div>

                    {/* Meta Bar */}
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-800/80 text-xs">
                      <div>
                        <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase block">
                          Allocated Budget
                        </span>
                        <span className="font-semibold text-zinc-200 text-sm">
                          {budgetText.includes("Budget") ? budgetText : `${budgetText} Budget`}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase block">
                          Routing Integrity
                        </span>
                        <span className="font-semibold text-zinc-300 text-sm">
                          100% Synced
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-1">
                      <Link
                        href={trip.id && !trip.id.startsWith("curated") ? `/trips/${trip.id}` : "/trips/new"}
                        className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-white text-zinc-200 hover:text-zinc-950 text-xs font-mono uppercase tracking-wider font-semibold border border-zinc-700 hover:border-white transition-all duration-200"
                      >
                        <span>View Trip</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. BUDGET HIGHLIGHT                                                      */}
      {/* ========================================================================= */}
      <section id="budget" className="py-16 border-b border-zinc-800/80 bg-zinc-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-10 rounded-3xl bg-zinc-900/70 border border-zinc-800 shadow-2xl relative overflow-hidden">
            {/* Subtle background decoration */}
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-zinc-800/30 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Metrics & Header */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-1.5">
                  <div className="inline-flex items-center gap-2 text-xs font-mono tracking-[0.2em] uppercase text-zinc-400">
                    <Wallet className="w-3.5 h-3.5 text-zinc-300" />
                    <span>Fiscal Intelligence</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-light text-white tracking-tight">
                    Trip <span className="font-semibold">Budget</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                    Real-time aggregated expense tracking across multi-city flights, boutique accommodations, and curated activities.
                  </p>
                </div>

                {/* 3 Metric Badges */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
                    <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase block">
                      Total Planned
                    </span>
                    <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                      ₹85,000
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800">
                    <span className="text-[10px] font-mono tracking-wider text-zinc-500 uppercase block">
                      Spent to Date
                    </span>
                    <span className="text-base sm:text-lg font-bold text-zinc-200 tracking-tight">
                      ₹62,400
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-white/20">
                    <span className="text-[10px] font-mono tracking-wider text-zinc-400 uppercase block">
                      Remaining
                    </span>
                    <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                      ₹22,600
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual Progress & Category Breakdown */}
              <div className="lg:col-span-7 space-y-6 lg:border-l lg:border-zinc-800 lg:pl-8">
                {/* Visual Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-300">
                    <span>Overall Budget Consumption</span>
                    <span className="font-semibold text-white">73.4% Used</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-zinc-950 border border-zinc-800 overflow-hidden p-0.5">
                    <div
                      className="h-full rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.4)] transition-all duration-1000"
                      style={{ width: "73.4%" }}
                    />
                  </div>
                </div>

                {/* Categories */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/80">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">Transit & Air</span>
                    <span className="text-sm font-semibold text-zinc-200">₹32,000</span>
                    <span className="text-[10px] text-zinc-500 block">37.6%</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/80">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">Stays & Villas</span>
                    <span className="text-sm font-semibold text-zinc-200">₹21,400</span>
                    <span className="text-[10px] text-zinc-500 block">25.2%</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/80">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">Experiences</span>
                    <span className="text-sm font-semibold text-zinc-200">₹6,200</span>
                    <span className="text-[10px] text-zinc-500 block">7.3%</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/80">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase block">Dining & Local</span>
                    <span className="text-sm font-semibold text-zinc-200">₹2,800</span>
                    <span className="text-[10px] text-zinc-500 block">3.3%</span>
                  </div>
                </div>

                {/* Insight Callout */}
                <div className="flex items-center justify-between text-xs text-zinc-400 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-zinc-300 shrink-0" />
                    <span>Automated cost alerts active. Zero overruns detected.</span>
                  </div>
                  <Link
                    href="/budget"
                    className="font-mono text-zinc-200 hover:text-white uppercase text-[11px] tracking-wider shrink-0 underline underline-offset-4"
                  >
                    Open Ledger
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. DESTINATION DISCOVERY ("Explore the World")                            */}
      {/* ========================================================================= */}
      <section className="py-16 border-b border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
                Curated Travel Intelligence
              </span>
              <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
                Explore the <span className="font-semibold">World</span>
              </h2>
              <p className="text-sm text-zinc-400 font-light">
                Hand-selected multi-city anchor destinations with high cultural resonance and cost profiles.
              </p>
            </div>
            <Link
              href="/discover"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-300 hover:text-white transition-colors group"
            >
              <span>Explore All Global Cities</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* 4 Rich Destination Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {curatedDestinations.map((dest) => (
              <div
                key={dest.id}
                className="group relative flex flex-col justify-between h-[380px] rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-white/40 overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer"
              >
                {/* Background Image with Dark Overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-100 group-hover:scale-110 grayscale contrast-125 group-hover:contrast-100 group-hover:grayscale-0"
                  style={{ backgroundImage: `url('${dest.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-black/40 group-hover:via-zinc-950/50 transition-colors" />

                {/* Top Badges */}
                <div className="relative z-10 p-4 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider uppercase bg-zinc-950/80 backdrop-blur-md text-zinc-300 border border-white/10">
                    {dest.tag}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wider bg-zinc-950/80 backdrop-blur-md text-white border border-white/20">
                    {dest.cost}
                  </span>
                </div>

                {/* Bottom Content */}
                <div className="relative z-10 p-5 space-y-3">
                  <div>
                    <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-400 uppercase">
                      {dest.country}
                    </span>
                    <h3 className="text-2xl font-bold text-white tracking-tight">
                      {dest.name}
                    </h3>
                  </div>

                  <p className="text-xs text-zinc-300 font-light leading-relaxed line-clamp-2">
                    {dest.descriptor}
                  </p>

                  <div className="pt-2">
                    <Link
                      href="/trips/new"
                      className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-zinc-900/90 hover:bg-white text-zinc-200 hover:text-zinc-950 text-xs font-mono uppercase tracking-wider font-semibold border border-white/10 hover:border-white transition-all backdrop-blur-md"
                    >
                      <span>Plan a trip here</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. RECENT TRIPS ARCHIVE                                                  */}
      {/* ========================================================================= */}
      <section className="py-16 border-b border-zinc-800/80 bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase">
                Historical Records
              </span>
              <h2 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
                Recent <span className="font-semibold">Trips</span>
              </h2>
              <p className="text-sm text-zinc-400 font-light">
                Archived expeditions with stored route logs, receipts, and activity notes.
              </p>
            </div>
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
              Showing 3 Most Recent
            </span>
          </div>

          <div className="space-y-3">
            {recentTripsList.map((rec) => (
              <div
                key={rec.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/70 transition-all duration-200 gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-400 group-hover:text-white shrink-0 transition-colors">
                    <CheckCircle2 className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-white group-hover:text-zinc-100 transition-colors">
                      {rec.name}
                    </h4>
                    <p className="text-xs text-zinc-400 font-light">
                      {rec.destination} • <span className="font-mono">{rec.route}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 text-xs border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-800/60">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Date & Stops</span>
                    <span className="text-zinc-300">{rec.date} ({rec.stops})</span>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">Total Spent</span>
                    <span className="font-semibold text-zinc-200">{rec.spent}</span>
                  </div>

                  <Link
                    href="/trips"
                    className="p-2 rounded-xl bg-zinc-800/70 hover:bg-white text-zinc-300 hover:text-zinc-950 border border-zinc-700 hover:border-white transition-all shrink-0"
                    title="View Trip Archive"
                    aria-label="View Trip Archive"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. CLOSING FOOTER                                                        */}
      {/* ========================================================================= */}
      <footer className="py-12 bg-zinc-950 text-zinc-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-zinc-900">
            <div>
              <GlobeTrotterLogo />
              <p className="text-xs text-zinc-400 font-light mt-3 max-w-sm">
                Personalized multi-city travel planning, intelligent itineraries, and real-time expense management for global travelers.
              </p>
            </div>

            <div className="flex flex-wrap gap-8 text-xs font-mono tracking-wider uppercase text-zinc-400">
              <Link href="/dashboard" className="hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/trips" className="hover:text-white transition-colors">
                My Trips
              </Link>
              <Link href="/discover" className="hover:text-white transition-colors">
                Discover
              </Link>
              <Link href="/trips/new" className="hover:text-white transition-colors">
                Plan New Trip
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-500">
            <p>© 2026 GlobeTrotter Inc. All rights reserved.</p>
            <p className="tracking-widest uppercase">Engineered for Global Wandering</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

