"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Clock, Plus, GripVertical, Info, X, Trash2, DollarSign } from "lucide-react"
import { ActivitySearch } from "@/components/activities/activity-search"
import { toast } from "sonner"

export function DayView({ trip, isOwner, setTrip }: { trip: any; isOwner: boolean; setTrip: any }) {
  const [selectedDay, setSelectedDay] = useState(trip.stops[0]?.days[0]?.id || null)
  const [showActivityPanel, setShowActivityPanel] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const allDays = trip.stops.flatMap((stop: any) => stop.days)

  if (allDays.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Info className="w-12 h-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium">No dates scheduled</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">
          Add destinations to your trip to generate a day-by-day itinerary.
        </p>
      </div>
    )
  }

  const currentDayData = allDays.find((d: any) => d.id === selectedDay) || allDays[0]
  const currentStop = trip.stops.find((s: any) => s.id === currentDayData?.stopId)

  // Build set of activity IDs already in the current day
  const addedActivityIds = new Set<string>(
    currentDayData?.activities?.map((item: any) => item.activity?.id as string) ?? []
  )

  // Build day options for the current stop
  const currentStopDays: { id: string; date: string | Date }[] =
    currentStop?.days?.map((d: any) => ({ id: d.id, date: d.date })) ?? []

  function handleActivityAdded(itineraryActivity: any) {
    // Optimistically update trip state
    setTrip((prev: any) => {
      const updated = { ...prev }
      updated.stops = prev.stops.map((stop: any) => ({
        ...stop,
        days: stop.days.map((day: any) => {
          if (day.id !== itineraryActivity.dayId) return day
          return {
            ...day,
            activities: [
              ...day.activities,
              {
                id: itineraryActivity.id,
                dayId: itineraryActivity.dayId,
                activityId: itineraryActivity.activityId,
                startTime: itineraryActivity.startTime,
                endTime: itineraryActivity.endTime,
                customCost: itineraryActivity.customCost,
                order: itineraryActivity.order,
                notes: itineraryActivity.notes,
                activity: itineraryActivity.activity,
              },
            ],
          }
        }),
      }))
      return updated
    })
  }

  async function handleRemoveActivity(itineraryActivityId: string) {
    setRemovingId(itineraryActivityId)
    try {
      const res = await fetch(
        `/api/trips/${trip.id}/stops/${currentStop.id}/activities?itineraryActivityId=${itineraryActivityId}`,
        { method: "DELETE" }
      )
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Failed to remove activity")
      }

      // Optimistically remove from state
      setTrip((prev: any) => ({
        ...prev,
        stops: prev.stops.map((stop: any) => ({
          ...stop,
          days: stop.days.map((day: any) => ({
            ...day,
            activities: day.activities.filter(
              (a: any) => a.id !== itineraryActivityId
            ),
          })),
        })),
      }))

      toast.success("Activity removed")
    } catch (err: any) {
      toast.error(err.message || "Failed to remove activity")
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Day Selector + Add Activity button */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-1">
          {trip.stops.map((stop: any) =>
            stop.days.map((day: any) => {
              const dayIdx = allDays.findIndex((d: any) => d.id === day.id) + 1
              const isSelected = selectedDay === day.id
              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => {
                    setSelectedDay(day.id)
                    setShowActivityPanel(false)
                  }}
                  className={`shrink-0 flex flex-col items-center px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                    isSelected
                      ? "border-zinc-950 bg-zinc-950 text-white shadow-sm"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400"
                  }`}
                >
                  <span className="font-semibold">Day {dayIdx}</span>
                  <span className={`font-normal ${isSelected ? "text-white/70" : "text-zinc-400"}`}>
                    {format(new Date(day.date), "MMM d")}
                  </span>
                </button>
              )
            })
          )}
        </div>

        {isOwner && (
          <button
            type="button"
            onClick={() => setShowActivityPanel((v) => !v)}
            className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm border ${
              showActivityPanel
                ? "bg-zinc-950 text-white border-zinc-950"
                : "bg-white text-zinc-800 border-zinc-200 hover:border-zinc-400"
            }`}
          >
            {showActivityPanel ? (
              <>
                <X className="w-4 h-4" />
                Close
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Activity
              </>
            )}
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Timeline */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Day Header */}
          <div className="flex items-baseline gap-3 mb-2">
            <h2 className="text-xl font-bold text-zinc-900">
              {currentStop?.city.name}
            </h2>
            <span className="text-sm text-zinc-400">
              {format(new Date(currentDayData.date), "EEEE, MMMM d, yyyy")}
            </span>
          </div>

          {/* Activities Timeline */}
          <div className="relative space-y-3 pl-6 before:absolute before:left-[10px] before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 before:to-transparent">
            {currentDayData.activities.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-zinc-200 text-center cursor-pointer hover:border-zinc-400 hover:bg-zinc-50 transition-all"
                onClick={() => isOwner && setShowActivityPanel(true)}
              >
                <Plus className="w-8 h-8 text-zinc-300 mb-2" />
                <p className="text-sm font-medium text-zinc-500">Free day — no activities yet</p>
                {isOwner && (
                  <p className="text-xs text-zinc-400 mt-1">Click to browse and add activities</p>
                )}
              </div>
            ) : (
              currentDayData.activities
                .slice()
                .sort((a: any, b: any) => a.order - b.order)
                .map((item: any) => (
                  <div key={item.id} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-6 top-4 w-4 h-4 rounded-full border-2 border-zinc-300 bg-white flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                    </div>

                    <div className="group rounded-2xl border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md hover:shadow-zinc-100 transition-all overflow-hidden">
                      <div className="flex gap-3 p-3">
                        {/* Thumbnail */}
                        {item.activity?.imageUrl && (
                          <div className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-zinc-100">
                            <img
                              src={item.activity.imageUrl}
                              alt={item.activity.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-0.5">
                                {item.activity?.type?.toLowerCase()}
                              </p>
                              <h4 className="font-semibold text-zinc-900 leading-snug">
                                {item.activity?.name}
                              </h4>
                            </div>

                            {isOwner && (
                              <button
                                type="button"
                                onClick={() => handleRemoveActivity(item.id)}
                                disabled={removingId === item.id}
                                className="shrink-0 p-1.5 rounded-lg text-zinc-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                title="Remove activity"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {item.activity?.description && (
                            <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                              {item.activity.description}
                            </p>
                          )}

                          <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {item.startTime
                                ? format(new Date(item.startTime), "h:mm a")
                                : "Flexible"}
                              {item.endTime && ` – ${format(new Date(item.endTime), "h:mm a")}`}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              ${(item.customCost ?? item.activity?.defaultCost ?? 0).toFixed(0)}
                            </span>
                          </div>

                          {item.notes && (
                            <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-2 py-1 mt-1.5">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Activity Search Panel */}
        {showActivityPanel && isOwner && (
          <>
            <Separator orientation="vertical" className="hidden md:block h-auto" />
            <div className="w-96 shrink-0 flex flex-col border border-zinc-200 rounded-2xl bg-white overflow-hidden shadow-sm">
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">Browse Activities</h3>
                  {currentStop?.city.name && (
                    <p className="text-xs text-zinc-400">{currentStop.city.name}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowActivityPanel(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-hidden">
                <ActivitySearch
                  tripId={trip.id}
                  stopId={currentStop?.id}
                  cityId={currentStop?.city?.id}
                  cityName={currentStop?.city?.name}
                  days={currentStopDays}
                  addedActivityIds={addedActivityIds}
                  onActivityAdded={handleActivityAdded}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
