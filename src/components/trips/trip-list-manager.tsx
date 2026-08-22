"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  Plus,
  Search,
  SlidersHorizontal,
  Calendar,
  MapPin,
  Trash2,
  Share2,
  ArrowRight,
  Plane,
  Eye,
  Check,
  Copy,
  Clock,
  MoreVertical,
} from "lucide-react"

interface TripItem {
  id: string
  name: string
  description?: string | null
  startDate: string
  endDate: string
  budget?: number | null
  coverImage?: string | null
  shareToken?: string | null
  stops: Array<{
    id: string
    cityName?: string | null
    city?: { name: string } | null
  }>
}

export function TripListManager({ initialTrips }: { initialTrips: TripItem[] }) {
  const router = useRouter()
  const [trips, setTrips] = useState<TripItem[]>(initialTrips)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"ALL" | "UPCOMING" | "IN_PROGRESS" | "PAST">("ALL")
  const [sortBy, setSortBy] = useState<"DATE_ASC" | "DATE_DESC" | "NAME" | "BUDGET">("DATE_ASC")
  const [sharingTrip, setSharingTrip] = useState<TripItem | null>(null)
  const [copied, setCopied] = useState(false)

  // Calculate status
  function getTripStatus(startDateStr: string, endDateStr: string): "UPCOMING" | "IN_PROGRESS" | "PAST" {
    const now = new Date()
    const start = new Date(startDateStr)
    const end = new Date(endDateStr)

    if (end < now) return "PAST"
    if (start <= now && end >= now) return "IN_PROGRESS"
    return "UPCOMING"
  }

  // Filter and sort trips
  const filteredTrips = useMemo(() => {
    return trips
      .filter((trip) => {
        const matchesSearch =
          trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trip.stops.some(
            (s) =>
              (s.cityName || s.city?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
          )

        if (!matchesSearch) return false

        const status = getTripStatus(trip.startDate, trip.endDate)
        if (statusFilter !== "ALL" && status !== statusFilter) return false

        return true
      })
      .sort((a, b) => {
        if (sortBy === "DATE_ASC") {
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        }
        if (sortBy === "DATE_DESC") {
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        }
        if (sortBy === "NAME") {
          return a.name.localeCompare(b.name)
        }
        if (sortBy === "BUDGET") {
          return (b.budget || 0) - (a.budget || 0)
        }
        return 0
      })
  }, [trips, searchQuery, statusFilter, sortBy])

  // Delete trip handler
  async function handleDeleteTrip(tripId: string, tripName: string) {
    if (!confirm(`Are you sure you want to permanently delete "${tripName}"?`)) {
      return
    }

    try {
      const res = await fetch(`/api/trips/${tripId}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete trip")
      }

      setTrips((prev) => prev.filter((t) => t.id !== tripId))
      toast.success("Trip removed successfully")
    } catch (error: any) {
      toast.error(error.message || "Could not delete trip")
    }
  }

  // Copy share link
  function handleCopyShareLink(trip: TripItem) {
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/share/${trip.shareToken || trip.id}`
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success("Public itinerary link copied to clipboard!")
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <div className="space-y-8">
      {/* 1. Control Toolbar (Search, Filter, Sort, New Button) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by trip name or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-zinc-200 bg-white text-xs text-zinc-950 focus:outline-hidden focus:ring-2 focus:ring-zinc-950 font-sans shadow-2xs"
          />
        </div>

        {/* Status Filter & Sort Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex p-1 bg-zinc-100 rounded-xl border border-zinc-200 text-xs font-mono">
            {(["ALL", "UPCOMING", "IN_PROGRESS", "PAST"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all ${
                  statusFilter === st
                    ? "bg-white text-zinc-950 font-bold shadow-2xs"
                    : "text-zinc-500 hover:text-zinc-950"
                }`}
              >
                {st === "ALL" ? "All" : st.replace("_", " ")}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-10 px-3 rounded-xl border border-zinc-200 bg-white text-xs font-mono text-zinc-800 focus:outline-hidden focus:ring-2 focus:ring-zinc-950"
          >
            <option value="DATE_ASC">Date: Earliest First</option>
            <option value="DATE_DESC">Date: Latest First</option>
            <option value="NAME">Name: A to Z</option>
            <option value="BUDGET">Budget: Highest First</option>
          </select>

          <Link href="/trips/new">
            <button
              type="button"
              className="px-4 py-2.5 rounded-xl bg-zinc-950 text-white font-mono text-xs uppercase tracking-wider font-semibold shadow-xs hover:bg-zinc-800 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Plan Trip</span>
            </button>
          </Link>
        </div>
      </div>

      {/* 2. Trip Cards Grid */}
      {filteredTrips.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400">
            <Plane className="w-7 h-7 text-zinc-600" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-bold text-zinc-950">No matching expeditions found</h3>
            <p className="text-xs text-zinc-500 font-light">
              {searchQuery || statusFilter !== "ALL"
                ? "Try clearing filters or search keywords to view your itineraries."
                : "You have not planned any journeys yet. Start crafting your first multi-city adventure."}
            </p>
          </div>
          <Link href="/trips/new">
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl bg-zinc-950 text-white font-mono text-xs uppercase tracking-wider font-semibold hover:bg-zinc-800 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Plan New Trip</span>
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => {
            const status = getTripStatus(trip.startDate, trip.endDate)
            const startDateFormatted = new Date(trip.startDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            })
            const endDateFormatted = new Date(trip.endDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })

            return (
              <div
                key={trip.id}
                className="group rounded-3xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all duration-300 overflow-hidden flex flex-col shadow-xs"
              >
                {/* Cover Image & Status Badge */}
                <div className="relative h-44 w-full overflow-hidden bg-zinc-100">
                  <img
                    src={trip.coverImage || "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80"}
                    alt={trip.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono font-semibold uppercase text-zinc-900 shadow-xs">
                    {status === "UPCOMING" && "Upcoming"}
                    {status === "IN_PROGRESS" && "In Progress"}
                    {status === "PAST" && "Past Expedition"}
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setSharingTrip(trip)}
                      aria-label="Share trip"
                      className="p-1.5 rounded-full bg-white/90 backdrop-blur-md text-zinc-700 hover:text-zinc-950 shadow-xs transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTrip(trip.id, trip.name)}
                      aria-label="Delete trip"
                      className="p-1.5 rounded-full bg-white/90 backdrop-blur-md text-zinc-700 hover:text-red-600 shadow-xs transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-zinc-950 tracking-tight">{trip.name}</h3>

                    <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                      <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                      <span>{startDateFormatted} — {endDateFormatted}</span>
                    </div>

                    {/* Stops badges */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {trip.stops.slice(0, 3).map((stop) => (
                        <span
                          key={stop.id}
                          className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono bg-zinc-100 text-zinc-800"
                        >
                          {stop.cityName || stop.city?.name}
                        </span>
                      ))}
                      {trip.stops.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono bg-zinc-100 text-zinc-500">
                          +{trip.stops.length - 3} more
                        </span>
                      )}
                      {trip.stops.length === 0 && (
                        <span className="text-xs font-mono text-zinc-400 italic">No stops added yet</span>
                      )}
                    </div>
                  </div>

                  {/* Footer Bar */}
                  <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                    <div className="font-mono text-xs">
                      <span className="text-[10px] uppercase text-zinc-400 block">Target Budget</span>
                      <span className="font-bold text-zinc-950">
                        ${(trip.budget || 0).toLocaleString("en-US")}
                      </span>
                    </div>

                    <Link href={`/trips/${trip.id}`}>
                      <button
                        type="button"
                        className="px-5 py-2 rounded-xl bg-zinc-950 text-white font-mono text-xs uppercase tracking-wider font-semibold hover:bg-zinc-800 transition-all flex items-center gap-1.5"
                      >
                        <span>Open</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 3. Share Modal */}
      {sharingTrip && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-zinc-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-400">
                  Public Sharing
                </span>
                <h3 className="text-lg font-bold text-zinc-950">Share Itinerary</h3>
              </div>
              <button
                type="button"
                onClick={() => setSharingTrip(null)}
                className="text-zinc-400 hover:text-zinc-950 font-mono text-xs uppercase"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-zinc-600 leading-relaxed">
                Anyone with this link can view this complete itinerary, day schedules, and financial breakdown without requiring an account.
              </p>

              <div className="flex items-center gap-2 p-2 rounded-xl border border-zinc-200 bg-zinc-50 font-mono text-xs text-zinc-700 select-all overflow-x-auto">
                <span className="truncate">
                  {typeof window !== "undefined" ? `${window.location.origin}/share/${sharingTrip.shareToken || sharingTrip.id}` : `/share/${sharingTrip.id}`}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSharingTrip(null)}
                className="px-4 py-2 rounded-xl text-xs font-mono uppercase text-zinc-600 hover:bg-zinc-100"
              >
                Done
              </button>
              <button
                type="button"
                onClick={() => handleCopyShareLink(sharingTrip)}
                className="px-5 py-2 rounded-xl bg-zinc-950 text-white text-xs font-mono uppercase tracking-wider font-semibold hover:bg-zinc-800 transition-all flex items-center gap-2"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Link"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
