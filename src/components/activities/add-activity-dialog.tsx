"use client"

import { useState } from "react"
import { format } from "date-fns"
import {
  X,
  Calendar,
  Clock,
  DollarSign,
  StickyNote,
  Loader2,
  Check,
  Sparkles,
} from "lucide-react"
import { toast } from "sonner"

interface DayOption {
  id: string
  date: string | Date
  label?: string
}

interface AddActivityDialogProps {
  activity: {
    id: string
    name: string
    type: string
    defaultCost: number
    durationMinutes: number
    imageUrl?: string | null
  }
  days: DayOption[]
  tripId: string
  stopId: string
  onClose: () => void
  onActivityAdded: (itineraryActivity: any) => void
}

export function AddActivityDialog({
  activity,
  days,
  tripId,
  stopId,
  onClose,
  onActivityAdded,
}: AddActivityDialogProps) {
  const [selectedDayId, setSelectedDayId] = useState<string>(
    days[0]?.id || ""
  )
  const [startTime, setStartTime] = useState("")
  const [customCost, setCustomCost] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit() {
    if (!selectedDayId) {
      toast.error("Please select a day")
      return
    }

    setIsSubmitting(true)
    try {
      // Build startTime as a full ISO datetime from the selected day's date + time input
      let fullStartTime: string | null = null
      if (startTime) {
        const selectedDay = days.find((d) => d.id === selectedDayId)
        if (selectedDay) {
          const dayDate = new Date(selectedDay.date)
          const [hours, minutes] = startTime.split(":").map(Number)
          dayDate.setHours(hours, minutes, 0, 0)
          fullStartTime = dayDate.toISOString()
        }
      }

      const res = await fetch(
        `/api/trips/${tripId}/stops/${stopId}/activities`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            activityId: activity.id,
            dayId: selectedDayId,
            startTime: fullStartTime,
            customCost: customCost ? parseFloat(customCost) : null,
            notes: notes || null,
          }),
        }
      )

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Failed to add activity")
      }

      const created = await res.json()
      toast.success(`Added "${activity.name}" to your itinerary`)
      onActivityAdded(created)
      onClose()
    } catch (error: any) {
      toast.error(error.message || "Failed to add activity")
    } finally {
      setIsSubmitting(false)
    }
  }

  const durationLabel =
    activity.durationMinutes >= 60
      ? `${Math.floor(activity.durationMinutes / 60)}h${activity.durationMinutes % 60 ? ` ${activity.durationMinutes % 60}m` : ""}`
      : `${activity.durationMinutes}m`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-md mx-4 bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header with activity preview */}
        <div className="relative h-32 overflow-hidden">
          {activity.imageUrl ? (
            <img
              src={activity.imageUrl}
              alt={activity.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-xl bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-white text-[10px] font-mono uppercase tracking-wider">
                {activity.type}
              </span>
              <span className="text-white/70 text-xs font-mono">
                ~{durationLabel}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white leading-tight">
              {activity.name}
            </h3>
          </div>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4">
          {/* Day Selector */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              <Calendar className="w-3.5 h-3.5" />
              Select Day
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {days.map((day, idx) => {
                const d = new Date(day.date)
                const isSelected = selectedDayId === day.id
                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() => setSelectedDayId(day.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all border ${
                      isSelected
                        ? "bg-zinc-950 text-white border-zinc-950 shadow-sm"
                        : "bg-white text-zinc-700 border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                    <span className="truncate">
                      Day {idx + 1} · {format(d, "MMM d")}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Start Time */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              Start Time
              <span className="text-zinc-400 font-normal normal-case">(optional)</span>
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-400 transition-all"
            />
          </div>

          {/* Custom Cost */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              <DollarSign className="w-3.5 h-3.5" />
              Cost Override
              <span className="text-zinc-400 font-normal normal-case">
                (default: ${activity.defaultCost})
              </span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={customCost}
              onChange={(e) => setCustomCost(e.target.value)}
              placeholder={`$${activity.defaultCost}`}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-400 transition-all"
            />
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              <StickyNote className="w-3.5 h-3.5" />
              Notes
              <span className="text-zinc-400 font-normal normal-case">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. Book in advance, bring water..."
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-400 transition-all"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-200 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedDayId}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-950 text-white text-sm font-semibold hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Add to Day
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
