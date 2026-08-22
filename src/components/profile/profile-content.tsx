"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import {
  User,
  MapPin,
  Plane,
  Heart,
  Settings,
  Calendar,
  Compass,
  Globe2,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  ShieldCheck,
  Share2,
  Plus,
  Wallet,
  Clock,
  Luggage,
  Search,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react"
import { toast } from "sonner"
import { SavedDestinationCard } from "./saved-destination-card"

interface City {
  id: string
  name: string
  country: string
  costIndex: number
  imageUrl?: string | null
}

interface SavedDestination {
  id: string
  createdAt: Date | string
  city: City
}

interface TripStop {
  id: string
  city: City
  arrivalDate: Date | string
  departureDate: Date | string
  order: number
}

interface Expense {
  id: string
  amount: number
  currency: string
}

interface Trip {
  id: string
  name: string
  description?: string | null
  startDate: Date | string
  endDate: Date | string
  coverImage?: string | null
  stops: TripStop[]
  expenses: Expense[]
  createdAt: Date | string
}

interface UserProfile {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: string
  createdAt: Date | string
  preferences?: {
    currency: string
    language: string
  } | null
}

interface ProfileContentProps {
  user: UserProfile
  trips: Trip[]
  savedDestinations: SavedDestination[]
}

// Fallback travel image lookup
function getTripCover(trip: Trip) {
  if (trip.coverImage) return trip.coverImage
  const cityName = trip.stops?.[0]?.city?.name?.toLowerCase() || ""
  if (cityName.includes("paris"))
    return "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80"
  if (cityName.includes("tokyo"))
    return "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80"
  if (cityName.includes("rome"))
    return "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80"
  if (cityName.includes("amsterdam"))
    return "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=800&q=80"
  if (cityName.includes("dubai"))
    return "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80"
  if (cityName.includes("kyoto"))
    return "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"
  if (cityName.includes("new york") || cityName.includes("nyc"))
    return "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80"
  if (cityName.includes("london"))
    return "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80"

  return "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80"
}

// Calculate trip status
function getStatus(startDate: Date | string, endDate: Date | string) {
  const now = new Date()
  const start = new Date(startDate)
  const end = new Date(endDate)

  if (end < now) {
    return {
      label: "Completed",
      badge: "bg-zinc-100 text-zinc-700 border-zinc-200",
      dot: "bg-zinc-400",
    }
  }
  if (start > now) {
    return {
      label: "Upcoming",
      badge: "bg-zinc-950 text-white border-zinc-900",
      dot: "bg-emerald-400",
    }
  }
  return {
    label: "In Progress",
    badge: "bg-emerald-950 text-emerald-300 border-emerald-800",
    dot: "bg-emerald-400 animate-pulse",
  }
}

export function ProfileContent({
  user,
  trips,
  savedDestinations: initialSaved,
}: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "saved" | "trips">("overview")
  const [savedList, setSavedList] = useState<SavedDestination[]>(initialSaved)
  const [savedSearchQuery, setSavedSearchQuery] = useState("")
  const [tripFilter, setTripFilter] = useState<"all" | "upcoming" | "completed">("all")

  const now = new Date()
  const currencySymbol =
    user.preferences?.currency === "INR"
      ? "₹"
      : user.preferences?.currency === "EUR"
      ? "€"
      : user.preferences?.currency === "GBP"
      ? "£"
      : user.preferences?.currency === "JPY"
      ? "¥"
      : "$"

  // Calculate deep travel statistics
  const totalTripsCount = trips.length
  const upcomingTrips = trips.filter(
    (t) => new Date(t.startDate) > now || (new Date(t.startDate) <= now && new Date(t.endDate) >= now)
  )
  const completedTrips = trips.filter((t) => new Date(t.endDate) < now)

  // Countries visited / planned
  const visitedCountries = Array.from(
    new Set(
      trips.flatMap((t) => t.stops.map((s) => s.city.country)).filter(Boolean)
    )
  )

  // Unique cities visited / planned
  const visitedCities = Array.from(
    new Set(
      trips.flatMap((t) => t.stops.map((s) => s.city.name)).filter(Boolean)
    )
  )

  // Total travel days
  let totalDaysTraveled = 0
  trips.forEach((t) => {
    const start = new Date(t.startDate).getTime()
    const end = new Date(t.endDate).getTime()
    if (!isNaN(start) && !isNaN(end) && end >= start) {
      totalDaysTraveled += Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)))
    }
  })

  // Total budget / expenses tracked
  let totalTrackedBudget = 0
  trips.forEach((t) => {
    if (t.expenses && t.expenses.length > 0) {
      totalTrackedBudget += t.expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0)
    } else {
      const start = new Date(t.startDate).getTime()
      const end = new Date(t.endDate).getTime()
      const days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)))
      const stopCount = Math.max(1, t.stops?.length || 1)
      totalTrackedBudget += stopCount * 25000 + days * 3500
    }
  })

  // Member Tier based on total expeditions
  const memberTier =
    totalTripsCount >= 6
      ? { title: "TIER III: GRAND NOMAD", color: "text-amber-400 border-amber-400/30 bg-amber-950/40" }
      : totalTripsCount >= 3
      ? { title: "TIER II: GLOBETROTTER VOYAGER", color: "text-emerald-400 border-emerald-400/30 bg-emerald-950/40" }
      : { title: "TIER I: EXPLORER", color: "text-zinc-300 border-zinc-700 bg-zinc-900" }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.slice(0, 2).toUpperCase() || "GT"

  const memberSince = user.createdAt
    ? format(new Date(user.createdAt), "MMMM yyyy")
    : "August 2026"

  // Remove saved destination handler
  function handleRemoveSaved(cityId: string) {
    setSavedList((prev) => prev.filter((item) => item.city.id !== cityId))
  }

  // Copy Profile Dossier Link
  function handleShareProfile() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Passport dossier link copied to clipboard!")
    }
  }

  // Filter saved destinations by query
  const filteredSaved = savedList.filter((item) => {
    if (!savedSearchQuery.trim()) return true
    const q = savedSearchQuery.toLowerCase()
    return (
      item.city.name.toLowerCase().includes(q) ||
      item.city.country.toLowerCase().includes(q)
    )
  })

  // Filter trips
  const filteredTrips = trips.filter((trip) => {
    const end = new Date(trip.endDate)
    const start = new Date(trip.startDate)
    if (tripFilter === "upcoming") {
      return end >= now
    }
    if (tripFilter === "completed") {
      return end < now
    }
    return true
  })

  return (
    <div className="min-h-screen bg-zinc-50/60 text-zinc-900 selection:bg-zinc-950 selection:text-white font-sans antialiased pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        
        {/* ========================================================================= */}
        {/* 1. HERO: TRAVELER PASSPORT DOSSIER (Luxury Dark Glassmorphic Card)        */}
        {/* ========================================================================= */}
        <div className="relative rounded-3xl bg-zinc-950 text-white p-6 sm:p-10 shadow-2xl border border-white/10 overflow-hidden">
          {/* Subtle Background Geometric Grid Accent */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-60" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-800/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Left: Avatar & Identity */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Profile Avatar */}
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-zinc-900 border-2 border-white/20 shadow-xl flex items-center justify-center">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "Traveler"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold font-mono text-zinc-100 tracking-wider">
                      {initials}
                    </span>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-zinc-900 border border-white/20 text-emerald-400 shadow-md">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              {/* User Bio & Meta */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono tracking-widest uppercase font-semibold border ${memberTier.color}`}
                  >
                    <Sparkles className="w-3 h-3" />
                    {memberTier.title}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/10 text-[10px] font-mono text-zinc-300">
                    PASSPORT: GT-{user.id.slice(-6).toUpperCase()}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-white">
                  {user.name || "World Explorer"}
                </h1>
                <p className="text-sm text-zinc-400 font-mono flex items-center gap-2">
                  <span>{user.email}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-600" />
                  <span className="text-zinc-500">Member since {memberSince}</span>
                </p>
              </div>
            </div>

            {/* Right: Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2 lg:pt-0">
              <Link
                href="/profile/settings"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs uppercase tracking-wider font-semibold border border-white/15 backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>

              <button
                type="button"
                onClick={handleShareProfile}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white font-mono text-xs uppercase tracking-wider border border-white/10 transition-all active:scale-[0.98]"
                title="Share Passport Dossier"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Dossier</span>
              </button>

              <Link
                href="/trips/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-mono text-xs uppercase tracking-wider font-bold hover:bg-zinc-200 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/5"
              >
                <Plus className="w-4 h-4" />
                <span>New Expedition</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. EXPEDITION METRICS MATRIX (Travel Summary)                             */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Metric 1: Total Expeditions */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold">
                TOTAL EXPEDITIONS
              </span>
              <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-950">
                <Luggage className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 font-mono">
                {totalTripsCount}
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                {upcomingTrips.length} upcoming • {completedTrips.length} completed
              </p>
            </div>
          </div>

          {/* Metric 2: Countries & Cities */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold">
                COUNTRIES VISITED
              </span>
              <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-950">
                <Globe2 className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 font-mono">
                {visitedCountries.length}
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                {visitedCities.length} distinct city stops logged
              </p>
            </div>
          </div>

          {/* Metric 3: Total Journey Days */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold">
                DAYS ON JOURNEY
              </span>
              <div className="w-8 h-8 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-950">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 font-mono">
                {totalDaysTraveled}
              </div>
              <p className="text-xs text-zinc-500 mt-1">Active expedition duration</p>
            </div>
          </div>

          {/* Metric 4: Bucket List Places */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 font-semibold">
                BUCKET LIST SAVED
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                <Heart className="w-4 h-4 fill-rose-500" />
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-950 font-mono">
                {savedList.length}
              </div>
              <p className="text-xs text-zinc-500 mt-1">Curated dream destinations</p>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. INTERACTIVE SECTION TABS                                              */}
        {/* ========================================================================= */}
        <div className="space-y-6">
          {/* Tab Navigation Pill Bar */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-200/60 border border-zinc-200 max-w-fit">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`px-5 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all ${
                activeTab === "overview"
                  ? "bg-zinc-950 text-white shadow-sm"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              Overview & Passport
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("saved")}
              className={`px-5 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === "saved"
                  ? "bg-zinc-950 text-white shadow-sm"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              <span>Bucket List</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === "saved"
                    ? "bg-white/20 text-white"
                    : "bg-zinc-300 text-zinc-700"
                }`}
              >
                {savedList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("trips")}
              className={`px-5 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === "trips"
                  ? "bg-zinc-950 text-white shadow-sm"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              <span>All Expeditions</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === "trips"
                    ? "bg-white/20 text-white"
                    : "bg-zinc-300 text-zinc-700"
                }`}
              >
                {trips.length}
              </span>
            </button>
          </div>

          {/* ======================================================================= */}
          {/* TAB 1: OVERVIEW & PASSPORT                                              */}
          {/* ======================================================================= */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Row 1: Recent Expeditions & Travel Preferences Snapshot */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left (2 Cols): Recent Journeys */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-zinc-950 tracking-tight">
                        Active & Recent Expeditions
                      </h2>
                      <p className="text-xs text-zinc-500">Your latest multi-city travel journeys</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("trips")}
                      className="text-xs font-mono text-zinc-600 hover:text-zinc-950 flex items-center gap-1 font-medium"
                    >
                      <span>View All ({trips.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {trips.length === 0 ? (
                    <div className="p-8 rounded-3xl bg-white border border-dashed border-zinc-300 text-center space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                        <Compass className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-semibold text-zinc-900">No expeditions planned yet</h3>
                        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                          Ready to explore? Create your first multi-city journey now.
                        </p>
                      </div>
                      <Link
                        href="/trips/new"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-950 text-white font-mono text-xs font-semibold uppercase tracking-wider shadow-sm hover:bg-zinc-800"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Plan First Trip</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {trips.slice(0, 3).map((trip) => {
                        const status = getStatus(trip.startDate, trip.endDate)
                        const start = new Date(trip.startDate)
                        const end = new Date(trip.endDate)
                        const dateFormatted =
                          !isNaN(start.getTime()) && !isNaN(end.getTime())
                            ? `${format(start, "d MMM")} — ${format(end, "d MMM yyyy")}`
                            : "Dates TBA"

                        const durationDays =
                          !isNaN(start.getTime()) && !isNaN(end.getTime())
                            ? Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
                            : 1

                        return (
                          <Link
                            key={trip.id}
                            href={`/trips/${trip.id}`}
                            className="group block p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200 shadow-xs hover:shadow-lg hover:border-zinc-300 transition-all duration-300"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-100 shrink-0">
                                  <img
                                    src={getTripCover(trip)}
                                    alt={trip.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium border ${status.badge}`}
                                    >
                                      <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                                      {status.label}
                                    </span>
                                    <span className="text-xs text-zinc-400 font-mono">
                                      {durationDays} {durationDays === 1 ? "Day" : "Days"}
                                    </span>
                                  </div>
                                  <h3 className="text-base font-semibold text-zinc-950 group-hover:text-zinc-700 transition-colors">
                                    {trip.name}
                                  </h3>
                                  <p className="text-xs text-zinc-500 flex items-center gap-2">
                                    <Calendar className="w-3 h-3 text-zinc-400" />
                                    <span>{dateFormatted}</span>
                                    <span>•</span>
                                    <span>{trip.stops.length} Stops</span>
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 self-end sm:self-center">
                                <span className="text-xs font-mono font-semibold text-zinc-900 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                                  <span>View Itinerary</span>
                                  <ArrowUpRight className="w-3.5 h-3.5" />
                                </span>
                              </div>
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Right (1 Col): Global Passport Dossier & Preferences */}
                <div className="space-y-6">
                  {/* Preferences Card */}
                  <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
                      <div className="flex items-center gap-2">
                        <Globe2 className="w-4 h-4 text-zinc-700" />
                        <h3 className="text-sm font-semibold text-zinc-950 uppercase tracking-wider font-mono">
                          Travel Preferences
                        </h3>
                      </div>
                      <Link
                        href="/profile/settings"
                        className="text-[11px] font-mono text-zinc-500 hover:text-zinc-950 transition-colors"
                      >
                        Edit
                      </Link>
                    </div>

                    <div className="space-y-3.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Default Currency</span>
                        <span className="font-mono font-bold text-zinc-900 px-2 py-0.5 bg-zinc-100 rounded-md">
                          {user.preferences?.currency || "USD"} ({currencySymbol})
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Locale & Language</span>
                        <span className="font-mono font-medium text-zinc-900 px-2 py-0.5 bg-zinc-100 rounded-md">
                          {user.preferences?.language?.toUpperCase() || "EN-US"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">Expedition Engine</span>
                        <span className="font-mono text-emerald-600 font-semibold">
                          Active & Synced
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* World Coverage Pill Snapshot */}
                  <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-zinc-100">
                      <MapPin className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-sm font-semibold text-zinc-950 uppercase tracking-wider font-mono">
                        Countries in Journey Log
                      </h3>
                    </div>

                    {visitedCountries.length === 0 ? (
                      <p className="text-xs text-zinc-400 italic">
                        Plan a trip to unlock passport country stamps.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {visitedCountries.map((c) => (
                          <span
                            key={c}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-800 font-mono text-[11px] font-medium"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 2: Bucket List Preview */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-zinc-950 tracking-tight">
                      Saved Bucket List Preview
                    </h2>
                    <p className="text-xs text-zinc-500">Your top saved destinations</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("saved")}
                    className="text-xs font-mono text-zinc-600 hover:text-zinc-950 flex items-center gap-1 font-medium"
                  >
                    <span>View All Saved ({savedList.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {savedList.length === 0 ? (
                  <div className="p-8 rounded-3xl bg-white border border-dashed border-zinc-300 text-center space-y-4">
                    <Heart className="w-8 h-8 mx-auto text-zinc-300" />
                    <div className="space-y-1">
                      <h3 className="text-sm font-semibold text-zinc-900">Your bucket list is empty</h3>
                      <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                        Explore popular cities and tap the heart icon to save them here.
                      </p>
                    </div>
                    <Link
                      href="/discover"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-950 text-white font-mono text-xs font-semibold uppercase tracking-wider shadow-sm hover:bg-zinc-800"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Discover Places</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {savedList.slice(0, 4).map((saved) => (
                      <SavedDestinationCard
                        key={saved.id}
                        city={saved.city}
                        onRemove={handleRemoveSaved}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================================= */}
          {/* TAB 2: BUCKET LIST (SAVED DESTINATIONS)                                 */}
          {/* ======================================================================= */}
          {activeTab === "saved" && (
            <div className="space-y-6">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={savedSearchQuery}
                    onChange={(e) => setSavedSearchQuery(e.target.value)}
                    placeholder="Search saved cities or countries..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 shadow-xs transition-all"
                  />
                </div>

                <Link
                  href="/discover"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-950 text-white font-mono text-xs uppercase tracking-wider font-semibold hover:bg-zinc-800 transition-all shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explore More Cities</span>
                </Link>
              </div>

              {filteredSaved.length === 0 ? (
                <div className="p-12 rounded-3xl bg-white border border-dashed border-zinc-300 text-center space-y-4">
                  <Heart className="w-10 h-10 mx-auto text-zinc-300" />
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-zinc-900">
                      {savedSearchQuery ? "No matching saved destinations" : "No saved destinations yet"}
                    </h3>
                    <p className="text-xs text-zinc-500 max-w-md mx-auto">
                      {savedSearchQuery
                        ? `No saved destinations match "${savedSearchQuery}". Try a different keyword.`
                        : "Discover trending cities and add them to your travel bucket list for easy trip planning."}
                    </p>
                  </div>
                  <Link
                    href="/discover"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-950 text-white font-mono text-xs uppercase tracking-wider font-bold shadow-sm hover:bg-zinc-800"
                  >
                    <span>Browse All Destinations</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {filteredSaved.map((saved) => (
                    <SavedDestinationCard
                      key={saved.id}
                      city={saved.city}
                      onRemove={handleRemoveSaved}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ======================================================================= */}
          {/* TAB 3: ALL EXPEDITIONS                                                 */}
          {/* ======================================================================= */}
          {activeTab === "trips" && (
            <div className="space-y-6">
              {/* Trip Filters & CTA */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 p-1 rounded-xl bg-zinc-200/70 border border-zinc-200 max-w-fit">
                  <button
                    type="button"
                    onClick={() => setTripFilter("all")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      tripFilter === "all"
                        ? "bg-white text-zinc-950 font-bold shadow-xs"
                        : "text-zinc-600 hover:text-zinc-950"
                    }`}
                  >
                    All ({trips.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTripFilter("upcoming")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      tripFilter === "upcoming"
                        ? "bg-white text-zinc-950 font-bold shadow-xs"
                        : "text-zinc-600 hover:text-zinc-950"
                    }`}
                  >
                    Upcoming ({upcomingTrips.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTripFilter("completed")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      tripFilter === "completed"
                        ? "bg-white text-zinc-950 font-bold shadow-xs"
                        : "text-zinc-600 hover:text-zinc-950"
                    }`}
                  >
                    Completed ({completedTrips.length})
                  </button>
                </div>

                <Link
                  href="/trips/new"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-950 text-white font-mono text-xs uppercase tracking-wider font-semibold hover:bg-zinc-800 transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Plan New Expedition</span>
                </Link>
              </div>

              {filteredTrips.length === 0 ? (
                <div className="p-12 rounded-3xl bg-white border border-dashed border-zinc-300 text-center space-y-4">
                  <Luggage className="w-10 h-10 mx-auto text-zinc-300" />
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-zinc-900">
                      No {tripFilter !== "all" ? tripFilter : ""} expeditions found
                    </h3>
                    <p className="text-xs text-zinc-500 max-w-md mx-auto">
                      Plan your next journey with custom stops, day-by-day itineraries, and budget tracking.
                    </p>
                  </div>
                  <Link
                    href="/trips/new"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-950 text-white font-mono text-xs uppercase tracking-wider font-bold shadow-sm hover:bg-zinc-800"
                  >
                    <span>Create Expedition</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredTrips.map((trip) => {
                    const status = getStatus(trip.startDate, trip.endDate)
                    const start = new Date(trip.startDate)
                    const end = new Date(trip.endDate)
                    const dateFormatted =
                      !isNaN(start.getTime()) && !isNaN(end.getTime())
                        ? `${format(start, "d MMM yyyy")} — ${format(end, "d MMM yyyy")}`
                        : "Dates TBA"

                    const durationDays =
                      !isNaN(start.getTime()) && !isNaN(end.getTime())
                        ? Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
                        : 1

                    // Trajectory string (e.g. Paris ➔ Rome ➔ Tokyo)
                    const trajectory =
                      trip.stops.length > 0
                        ? trip.stops.map((s) => s.city.name).join("  ➔  ")
                        : "Single Destination Expedition"

                    return (
                      <Link
                        key={trip.id}
                        href={`/trips/${trip.id}`}
                        className="group relative rounded-3xl bg-white border border-zinc-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-zinc-300 transition-all duration-300 flex flex-col justify-between"
                      >
                        {/* Cover Image Header */}
                        <div className="relative h-44 w-full bg-zinc-100 overflow-hidden">
                          <img
                            src={getTripCover(trip)}
                            alt={trip.name}
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />

                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-medium backdrop-blur-md border ${status.badge}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                              {status.label}
                            </span>

                            <span className="px-2.5 py-1 rounded-lg bg-zinc-950/70 backdrop-blur-md text-white font-mono text-[10px] border border-white/10">
                              {durationDays} {durationDays === 1 ? "Day" : "Days"}
                            </span>
                          </div>

                          {/* Bottom Trajectory & Name */}
                          <div className="absolute bottom-3 left-3 right-3 text-white">
                            <p className="text-[11px] font-mono text-zinc-300 truncate mb-1">
                              {trajectory}
                            </p>
                            <h3 className="text-xl font-bold tracking-tight text-white leading-tight">
                              {trip.name}
                            </h3>
                          </div>
                        </div>

                        {/* Card Meta & Action */}
                        <div className="p-5 flex items-center justify-between gap-4 bg-white">
                          <div className="space-y-1">
                            <p className="text-xs text-zinc-500 flex items-center gap-1.5 font-mono">
                              <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                              <span>{dateFormatted}</span>
                            </p>
                            <p className="text-xs text-zinc-400">
                              {trip.stops.length} destination stops planned
                            </p>
                          </div>

                          <div className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-zinc-900 group-hover:text-zinc-600 transition-colors">
                            <span>Open</span>
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
