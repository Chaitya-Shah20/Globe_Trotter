"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import {
  MapPin,
  Calendar,
  Plus,
  Loader2,
  X,
  Sparkles,
  Luggage,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface City {
  id: string
  name: string
  country: string
  costIndex: number
  imageUrl?: string | null
}

interface TripSummary {
  id: string
  name: string
  startDate: string
  endDate: string
}

interface AddToTripDialogProps {
  city: City | null
  isOpen: boolean
  onClose: () => void
  preselectedTripId?: string
  tripStartDate?: string
  tripEndDate?: string
  onSuccess?: (createdStop?: any) => void
}

export function AddToTripDialog({
  city,
  isOpen,
  onClose,
  preselectedTripId,
  tripStartDate,
  tripEndDate,
  onSuccess,
}: AddToTripDialogProps) {
  const router = useRouter()
  const [trips, setTrips] = useState<TripSummary[]>([])
  const [isLoadingTrips, setIsLoadingTrips] = useState(false)
  const [selectedTripId, setSelectedTripId] = useState<string>(preselectedTripId || "")

  // Date states (default to today or trip dates)
  const defaultStart = tripStartDate
    ? new Date(tripStartDate).toISOString().split("T")[0]
    : new Date().toISOString().split("T")[0]
  const defaultEnd = tripEndDate
    ? new Date(tripEndDate).toISOString().split("T")[0]
    : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  const [arrivalDate, setArrivalDate] = useState(defaultStart)
  const [departureDate, setDepartureDate] = useState(defaultEnd)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch trips if not in a preselected trip context
  useEffect(() => {
    if (isOpen && !preselectedTripId) {
      setIsLoadingTrips(true)
      fetch("/api/trips")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setTrips(data)
            if (data.length > 0 && !selectedTripId) {
              setSelectedTripId(data[0].id)
              if (data[0].startDate) {
                setArrivalDate(new Date(data[0].startDate).toISOString().split("T")[0])
              }
              if (data[0].endDate) {
                setDepartureDate(new Date(data[0].endDate).toISOString().split("T")[0])
              }
            }
          }
        })
        .catch(() => {
          toast.error("Failed to load your trips")
        })
        .finally(() => {
          setIsLoadingTrips(false)
        })
    } else if (preselectedTripId) {
      setSelectedTripId(preselectedTripId)
      if (tripStartDate) setArrivalDate(new Date(tripStartDate).toISOString().split("T")[0])
      if (tripEndDate) setDepartureDate(new Date(tripEndDate).toISOString().split("T")[0])
    }
  }, [isOpen, preselectedTripId, tripStartDate, tripEndDate])

  if (!isOpen || !city) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!city) return
    if (!selectedTripId) {
      toast.error("Please select a trip first")
      return
    }

    const arrival = new Date(arrivalDate)
    const departure = new Date(departureDate)

    if (arrival > departure) {
      toast.error("Departure date cannot be earlier than arrival date")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/trips/${selectedTripId}/stops`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cityId: city.id,
          arrivalDate: arrival.toISOString(),
          departureDate: departure.toISOString(),
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "Failed to add city stop to trip")
      }

      const createdStop = await res.json()
      toast.success(`Added ${city.name} to your itinerary!`)

      if (onSuccess) {
        onSuccess(createdStop)
      }

      onClose()
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white text-zinc-900 border border-zinc-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header with City Thumbnail */}
        <div className="relative h-32 bg-zinc-950 text-white overflow-hidden p-6 flex items-end justify-between">
          {city.imageUrl && (
            <img
              src={city.imageUrl}
              alt={city.name}
              className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative z-10 space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-mono tracking-wider uppercase">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{city.country}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Add {city.name} to Itinerary
            </h2>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Trip Selector (if not preselected) */}
          {!preselectedTripId && (
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-700 font-semibold flex items-center justify-between">
                <span>Select Target Expedition</span>
                {trips.length > 0 && (
                  <span className="text-[10px] text-zinc-400 font-normal">
                    {trips.length} active trips
                  </span>
                )}
              </label>

              {isLoadingTrips ? (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-100 text-xs text-zinc-500 font-mono">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loading your trips...</span>
                </div>
              ) : trips.length === 0 ? (
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-center space-y-3">
                  <Luggage className="w-6 h-6 text-zinc-400 mx-auto" />
                  <p className="text-xs text-zinc-600">
                    You don't have any existing trips yet.
                  </p>
                  <Link
                    href={`/trips/new?city=${encodeURIComponent(city.name)}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-950 text-white font-mono text-xs font-semibold uppercase tracking-wider shadow-sm hover:bg-zinc-800"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Plan New Trip to {city.name}</span>
                  </Link>
                </div>
              ) : (
                <select
                  value={selectedTripId}
                  onChange={(e) => setSelectedTripId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 transition-all font-mono"
                >
                  {trips.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {/* Dates Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="arrivalDate"
                className="text-xs font-mono uppercase tracking-wider text-zinc-700 font-semibold flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>Arrival Date</span>
              </label>
              <input
                id="arrivalDate"
                type="date"
                value={arrivalDate}
                onChange={(e) => setArrivalDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 transition-all font-mono"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="departureDate"
                className="text-xs font-mono uppercase tracking-wider text-zinc-700 font-semibold flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>Departure Date</span>
              </label>
              <input
                id="departureDate"
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 transition-all font-mono"
              />
            </div>
          </div>

          <p className="text-xs text-zinc-500 bg-zinc-50 p-3 rounded-xl border border-zinc-200/80">
            Adding this city will auto-generate daily itinerary agendas and budget allocations for each day of your stay.
          </p>

          {/* Dialog Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-mono text-xs transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || (!preselectedTripId && trips.length === 0)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-zinc-950 text-white font-mono text-xs uppercase tracking-wider font-semibold hover:bg-zinc-800 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Adding Stop...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add Stop to Itinerary</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
