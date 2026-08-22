"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  Plus,
  GripVertical,
  Trash2,
  MapPin,
  Calendar,
  Sparkles,
  Loader2,
  X,
  Compass,
  ArrowRight,
} from "lucide-react"
import { toast } from "sonner"
import { CitySearch } from "./city-search"

interface City {
  id: string
  name: string
  country: string
  costIndex: number
  imageUrl?: string | null
}

interface Activity {
  id: string
  name: string
  type: string
  defaultCost: number
}

interface ItineraryActivity {
  id: string
  activity: Activity
}

interface ItineraryDay {
  id: string
  date: string | Date
  activities: ItineraryActivity[]
}

interface TripStop {
  id: string
  cityId: string
  city: City
  arrivalDate: string | Date
  departureDate: string | Date
  order: number
  days: ItineraryDay[]
}

interface Trip {
  id: string
  name: string
  startDate: string | Date
  endDate: string | Date
  stops: TripStop[]
}

interface CityManagerProps {
  trip: Trip
  isOwner: boolean
  setTrip: React.Dispatch<React.SetStateAction<any>>
}

export function CityManager({ trip, isOwner, setTrip }: CityManagerProps) {
  const [isAddingCity, setIsAddingCity] = useState(false)
  const [deletingStopId, setDeletingStopId] = useState<string | null>(null)

  // Handle stop removal
  async function handleDeleteStop(stopId: string, cityName: string) {
    if (!confirm(`Are you sure you want to remove ${cityName} from this itinerary?`)) {
      return
    }

    setDeletingStopId(stopId)
    try {
      const res = await fetch(`/api/trips/${trip.id}/stops?stopId=${stopId}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete stop")
      }

      toast.success(`Removed ${cityName} from your itinerary`)

      // Update state
      setTrip((prev: any) => ({
        ...prev,
        stops: prev.stops.filter((s: any) => s.id !== stopId),
      }))
    } catch (error) {
      toast.error("Failed to remove destination")
    } finally {
      setDeletingStopId(null)
    }
  }

  // Handle newly added stop
  function handleStopAdded(createdStop: any) {
    if (!createdStop) return

    setTrip((prev: any) => ({
      ...prev,
      stops: [...(prev.stops || []), createdStop].sort(
        (a, b) => new Date(a.arrivalDate).getTime() - new Date(b.arrivalDate).getTime()
      ),
    }))

    setIsAddingCity(false)
  }

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <h2 className="text-2xl font-light text-zinc-950 tracking-tight">
            Expedition <span className="font-semibold">Destinations</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            Organize multi-city stops, dates of stay, and city agendas.
          </p>
        </div>

        {isOwner && (
          <button
            type="button"
            onClick={() => setIsAddingCity(!isAddingCity)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-xs ${
              isAddingCity
                ? "bg-zinc-200 text-zinc-800 hover:bg-zinc-300"
                : "bg-zinc-950 text-white hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {isAddingCity ? (
              <>
                <X className="w-4 h-4" />
                <span>Close Search</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add Destination</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* REAL CITY SEARCH DRAWER */}
      {isAddingCity && (
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-50 border-2 border-zinc-950/10 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-zinc-950 text-white flex items-center justify-center">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-zinc-950">
                  Search & Add Cities to "{trip.name}"
                </h3>
                <p className="text-xs text-zinc-500">
                  Select any destination below to configure your arrival and departure dates.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAddingCity(false)}
              className="p-1.5 rounded-xl bg-white hover:bg-zinc-200 text-zinc-500 transition-colors border border-zinc-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <CitySearch
            preselectedTripId={trip.id}
            tripStartDate={typeof trip.startDate === "string" ? trip.startDate : trip.startDate.toISOString()}
            tripEndDate={typeof trip.endDate === "string" ? trip.endDate : trip.endDate.toISOString()}
            onCityAddedToTrip={handleStopAdded}
            showTitle={false}
          />
        </div>
      )}

      {/* STOPS LIST */}
      <div className="space-y-4">
        {trip.stops.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-dashed border-zinc-300 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-zinc-900">
                No destinations added to this trip yet
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Search global cities to build your multi-city trajectory and daily itinerary.
              </p>
            </div>
            {isOwner && (
              <button
                type="button"
                onClick={() => setIsAddingCity(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-950 text-white font-mono text-xs uppercase tracking-wider font-semibold shadow-sm hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Search & Add First Stop</span>
              </button>
            )}
          </div>
        ) : (
          trip.stops.map((stop: any, index: number) => {
            const start = new Date(stop.arrivalDate)
            const end = new Date(stop.departureDate)
            const dateStr =
              !isNaN(start.getTime()) && !isNaN(end.getTime())
                ? `${format(start, "d MMM yyyy")} — ${format(end, "d MMM yyyy")}`
                : "Dates TBA"

            const duration =
              !isNaN(start.getTime()) && !isNaN(end.getTime())
                ? Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)))
                : 1

            const activitiesTotal =
              stop.days?.reduce((acc: number, day: any) => acc + (day.activities?.length || 0), 0) || 0

            const costSymbols = Array(stop.city.costIndex || 2).fill("$").join("")

            return (
              <div
                key={stop.id}
                className="group relative rounded-3xl bg-white border border-zinc-200/90 shadow-xs hover:shadow-md hover:border-zinc-300 transition-all duration-200 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row items-stretch">
                  {/* City Image */}
                  <div className="w-full sm:w-56 h-40 sm:h-auto bg-zinc-100 relative shrink-0 overflow-hidden">
                    <img
                      src={
                        stop.city.imageUrl ||
                        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80"
                      }
                      alt={stop.city.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-zinc-950/80 backdrop-blur text-white font-mono text-[10px]">
                      Stop {index + 1}
                    </div>
                  </div>

                  {/* Stop Information */}
                  <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-mono tracking-wider uppercase">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{stop.city.country}</span>
                        </div>
                        <h3 className="text-xl font-bold tracking-tight text-zinc-950">
                          {stop.city.name}
                        </h3>
                        <p className="text-xs text-zinc-600 flex items-center gap-1.5 font-mono pt-1">
                          <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{dateStr}</span>
                          <span className="text-zinc-400">•</span>
                          <span className="text-zinc-500 font-medium">
                            {duration} {duration === 1 ? "Day" : "Days"}
                          </span>
                        </p>
                      </div>

                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => handleDeleteStop(stop.id, stop.city.name)}
                          disabled={deletingStopId === stop.id}
                          className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Remove Stop"
                        >
                          {deletingStopId === stop.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Metadata Badges */}
                    <div className="flex flex-wrap items-center gap-4 text-xs pt-2 border-t border-zinc-100">
                      <div className="flex items-center gap-1.5 text-zinc-600">
                        <span className="text-zinc-400">Agendas:</span>
                        <span className="font-mono font-semibold text-zinc-900">
                          {activitiesTotal} {activitiesTotal === 1 ? "Activity" : "Activities"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-600">
                        <span className="text-zinc-400">Cost Level:</span>
                        <span className="font-mono font-bold text-emerald-600">{costSymbols}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
