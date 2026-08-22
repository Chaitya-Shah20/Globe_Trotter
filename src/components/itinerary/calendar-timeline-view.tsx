"use client"

import { useState, useMemo } from "react"
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  DollarSign,
} from "lucide-react"

interface ActivityItem {
  id: string
  name: string
  time: string
  duration: string
  cost: number
  category: "transport" | "stay" | "activities" | "meals" | "other"
  location?: string
  notes?: string
}

interface StopItem {
  id: string
  city: string
  country: string
  startDate: string
  endDate: string
  notes: string
  estimatedCost: number
  activities: ActivityItem[]
}

interface CalendarTimelineViewProps {
  tripName: string
  startDate: string
  endDate: string
  stops: StopItem[]
}

export function CalendarTimelineView({
  tripName,
  startDate,
  endDate,
  stops,
}: CalendarTimelineViewProps) {
  // Generate array of all days in the trip
  const daysList = useMemo(() => {
    const list: Array<{
      dateStr: string
      dateObj: Date
      dayNumber: number
      stop: StopItem | null
      activities: ActivityItem[]
    }> = []

    try {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const totalDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1)

      for (let i = 0; i < totalDays; i++) {
        const currentDate = new Date(start)
        currentDate.setDate(start.getDate() + i)
        const dateString = currentDate.toISOString().split("T")[0]

        // Find which stop corresponds to this day
        const matchedStop = stops.find((s) => {
          const sStart = new Date(s.startDate)
          const sEnd = new Date(s.endDate)
          return currentDate >= sStart && currentDate <= sEnd
        }) || stops[0] || null

        list.push({
          dateStr: dateString,
          dateObj: currentDate,
          dayNumber: i + 1,
          stop: matchedStop,
          activities: matchedStop?.activities || [],
        })
      }
    } catch (e) {
      // fallback
    }

    return list
  }, [startDate, endDate, stops])

  const [selectedDayIndex, setSelectedDayIndex] = useState(0)
  const currentDay = daysList[selectedDayIndex] || daysList[0]

  // Day total cost calculation
  const currentDayTotalCost = useMemo(() => {
    if (!currentDay) return 0
    return currentDay.activities.reduce((sum, act) => sum + (Number(act.cost) || 0), 0)
  }, [currentDay])

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 inline-block" />
            <span>Temporal Schedule</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 mt-1">
            Calendar & Daily Timeline
          </h2>
          <p className="text-xs text-zinc-500 font-mono">
            Interactive daily schedule across your expedition route.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 font-mono text-xs text-zinc-700 bg-zinc-100 px-3.5 py-1.5 rounded-xl border border-zinc-200">
          <CalendarIcon className="w-3.5 h-3.5 text-zinc-950" />
          <span>Total {daysList.length} Expedition Days</span>
        </div>
      </div>

      {/* 2. Interactive Horizontal Day Selector Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 no-scrollbar">
        {daysList.map((day, index) => {
          const isSelected = selectedDayIndex === index
          const weekdayName = day.dateObj.toLocaleDateString("en-US", { weekday: "short" })
          const monthDay = day.dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" })

          return (
            <button
              key={day.dateStr}
              type="button"
              onClick={() => setSelectedDayIndex(index)}
              className={`shrink-0 p-3 rounded-2xl border text-left transition-all min-w-[105px] select-none ${
                isSelected
                  ? "bg-zinc-950 text-white border-zinc-950 shadow-sm ring-2 ring-zinc-950/20"
                  : "bg-white text-zinc-800 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono uppercase tracking-wider ${isSelected ? "text-zinc-400" : "text-zinc-500"}`}>
                  Day {day.dayNumber}
                </span>
                <span className={`text-[10px] font-mono font-bold ${isSelected ? "text-white" : "text-zinc-950"}`}>
                  {weekdayName}
                </span>
              </div>
              <p className="text-xs font-bold font-mono mt-1">{monthDay}</p>
              <p className={`text-[10px] truncate mt-1 ${isSelected ? "text-zinc-300" : "text-zinc-500"}`}>
                {day.stop?.city || "Transit"}
              </p>
            </button>
          )
        })}
      </div>

      {/* 3. Selected Day Schedule & Vertical Timeline */}
      {currentDay && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Day Card & Telemetry */}
          <div className="lg:col-span-1 rounded-3xl border border-zinc-200 bg-white p-6 sm:p-7 shadow-xs space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold text-zinc-400">
                  DAY {String(currentDay.dayNumber).padStart(2, "0")} OF {daysList.length}
                </span>
                <h3 className="text-2xl font-bold text-zinc-950 tracking-tight">
                  {currentDay.dateObj.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </h3>
                <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-600 pt-1">
                  <MapPin className="w-3.5 h-3.5 text-zinc-950" />
                  <span className="font-semibold">{currentDay.stop?.city || "General"}, {currentDay.stop?.country || "Expedition"}</span>
                </div>
              </div>

              {currentDay.stop?.notes && (
                <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-100 text-xs text-zinc-600 leading-relaxed font-sans">
                  {currentDay.stop.notes}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-zinc-100 space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500 uppercase text-[10px]">Activities Count</span>
                <span className="font-bold text-zinc-950">{currentDay.activities.length} items</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500 uppercase text-[10px]">Estimated Day Total</span>
                <span className="font-bold text-zinc-950">${currentDayTotalCost.toLocaleString("en-US")}</span>
              </div>
            </div>
          </div>

          {/* Right: Vertical Schedule Timeline */}
          <div className="lg:col-span-2 rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <h4 className="text-sm font-mono uppercase tracking-wider font-bold text-zinc-900">
                Daily Chronology
              </h4>
              <span className="text-xs font-mono text-zinc-500">
                {currentDay.stop?.city || "Destination"} Schedule
              </span>
            </div>

            {currentDay.activities.length === 0 ? (
              <div className="py-12 text-center text-xs font-mono text-zinc-400 space-y-2">
                <p>No timed activities scheduled for this date.</p>
                <p className="text-[11px] text-zinc-500 font-sans">
                  Use the Itinerary Builder tab to add sights and dining experiences.
                </p>
              </div>
            ) : (
              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-[1.5px] before:bg-zinc-200">
                {currentDay.activities.map((act) => (
                  <div
                    key={act.id}
                    className="relative group rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-white hover:border-zinc-300 p-4 sm:p-5 shadow-2xs transition-all space-y-2"
                  >
                    {/* Pin dot */}
                    <div className="absolute -left-6 top-5 -translate-x-1/2 w-3 h-3 rounded-full bg-zinc-950 border-2 border-white ring-2 ring-zinc-200" />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-zinc-900 bg-white border border-zinc-200 px-2.5 py-1 rounded-md shadow-2xs">
                          {act.time}
                        </span>
                        <h5 className="text-sm sm:text-base font-semibold text-zinc-950">{act.name}</h5>
                      </div>
                      <span className="font-mono text-xs font-bold text-zinc-900 self-end sm:self-auto">
                        ${Number(act.cost).toLocaleString("en-US")}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 font-mono pt-1">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{act.duration}</span>
                      </div>
                      {act.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                          <span className="truncate max-w-[220px]">{act.location}</span>
                        </div>
                      )}
                      <span className="uppercase text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded">
                        {act.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
