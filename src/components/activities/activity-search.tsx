"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Search,
  SlidersHorizontal,
  X,
  Clock,
  DollarSign,
  Star,
  Plus,
  Check,
  Loader2,
  ChevronDown,
  Compass,
  Utensils,
  Mountain,
  Moon,
  ShoppingBag,
  Heart,
  Zap,
  Home,
} from "lucide-react"
import { AddActivityDialog } from "./add-activity-dialog"
import { toast } from "sonner"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Activity {
  id: string
  name: string
  description?: string | null
  type: string
  defaultCost: number
  durationMinutes: number
  imageUrl?: string | null
  cityId: string
  cityName: string
  cityCountry: string
  popularityScore: number
  timesBooked: number
}

interface DayOption {
  id: string
  date: string | Date
  label?: string
}

interface ActivitySearchProps {
  tripId: string
  stopId: string
  cityId?: string
  cityName?: string
  days: DayOption[]
  addedActivityIds?: Set<string>
  onActivityAdded?: (itineraryActivity: any) => void
}

// ─── Activity type icon map ───────────────────────────────────────────────────

const TYPE_ICONS: Record<string, React.ReactNode> = {
  SIGHTSEEING: <Compass className="w-3.5 h-3.5" />,
  FOOD: <Utensils className="w-3.5 h-3.5" />,
  ADVENTURE: <Mountain className="w-3.5 h-3.5" />,
  NIGHTLIFE: <Moon className="w-3.5 h-3.5" />,
  SHOPPING: <ShoppingBag className="w-3.5 h-3.5" />,
  WELLNESS: <Heart className="w-3.5 h-3.5" />,
  TRANSPORT: <Zap className="w-3.5 h-3.5" />,
  ACCOMMODATION: <Home className="w-3.5 h-3.5" />,
}

const TYPE_COLORS: Record<string, string> = {
  SIGHTSEEING: "bg-blue-100 text-blue-700",
  FOOD: "bg-orange-100 text-orange-700",
  ADVENTURE: "bg-green-100 text-green-700",
  NIGHTLIFE: "bg-purple-100 text-purple-700",
  SHOPPING: "bg-pink-100 text-pink-700",
  WELLNESS: "bg-teal-100 text-teal-700",
  TRANSPORT: "bg-yellow-100 text-yellow-700",
  ACCOMMODATION: "bg-zinc-100 text-zinc-700",
}

const ALL_TYPES = [
  "SIGHTSEEING",
  "FOOD",
  "ADVENTURE",
  "NIGHTLIFE",
  "SHOPPING",
  "WELLNESS",
  "TRANSPORT",
  "ACCOMMODATION",
]

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "cost_asc", label: "Price: Low to High" },
  { value: "cost_desc", label: "Price: High to Low" },
  { value: "duration", label: "Shortest First" },
  { value: "name", label: "A–Z" },
]

// ─── Activity Card ────────────────────────────────────────────────────────────

function ActivityCard({
  activity,
  isAdded,
  onAdd,
}: {
  activity: Activity
  isAdded: boolean
  onAdd: (activity: Activity) => void
}) {
  const durationLabel =
    activity.durationMinutes >= 60
      ? `${Math.floor(activity.durationMinutes / 60)}h${activity.durationMinutes % 60 ? ` ${activity.durationMinutes % 60}m` : ""}`
      : `${activity.durationMinutes}m`

  const typeColor = TYPE_COLORS[activity.type] || "bg-zinc-100 text-zinc-700"
  const typeIcon = TYPE_ICONS[activity.type] || <Star className="w-3.5 h-3.5" />

  return (
    <div
      className={`group relative flex gap-3 p-3 rounded-2xl border transition-all duration-200 ${
        isAdded
          ? "border-emerald-200 bg-emerald-50/60"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md hover:shadow-zinc-100"
      }`}
    >
      {/* Image */}
      <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-zinc-100">
        {activity.imageUrl ? (
          <img
            src={activity.imageUrl}
            alt={activity.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-200 to-zinc-300">
            <span className="text-zinc-400 text-2xl">
              {typeIcon}
            </span>
          </div>
        )}
        {/* Popularity badge */}
        <div className="absolute bottom-1 left-1 flex items-center gap-0.5 px-1 py-0.5 rounded-md bg-black/50 backdrop-blur-sm">
          <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
          <span className="text-white text-[9px] font-semibold">
            {activity.popularityScore}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Type badge */}
        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold mb-1.5 ${typeColor}`}>
          {typeIcon}
          {activity.type.charAt(0) + activity.type.slice(1).toLowerCase()}
        </div>

        <h4 className="text-sm font-semibold text-zinc-900 leading-snug mb-1 truncate">
          {activity.name}
        </h4>

        {activity.description && (
          <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 mb-2">
            {activity.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            <span className="font-medium text-zinc-700">
              ${activity.defaultCost.toFixed(0)}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {durationLabel}
          </span>
        </div>
      </div>

      {/* Add button */}
      <div className="flex items-center shrink-0">
        <button
          type="button"
          onClick={() => onAdd(activity)}
          disabled={isAdded}
          className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
            isAdded
              ? "bg-emerald-100 text-emerald-600 cursor-default"
              : "bg-zinc-950 text-white hover:bg-zinc-700 hover:scale-105 active:scale-95 shadow-sm"
          }`}
          title={isAdded ? "Already added" : "Add to itinerary"}
        >
          {isAdded ? (
            <Check className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  )
}

// ─── Main ActivitySearch Component ───────────────────────────────────────────

export function ActivitySearch({
  tripId,
  stopId,
  cityId,
  cityName,
  days,
  addedActivityIds = new Set(),
  onActivityAdded,
}: ActivitySearchProps) {
  const [query, setQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string>("")
  const [maxCost, setMaxCost] = useState<string>("")
  const [maxDuration, setMaxDuration] = useState<string>("")
  const [sortBy, setSortBy] = useState("popular")
  const [showFilters, setShowFilters] = useState(false)
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [localAdded, setLocalAdded] = useState<Set<string>>(new Set(addedActivityIds))

  const fetchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetchActivities = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (query) params.set("q", query)
      if (cityId) params.set("cityId", cityId)
      if (selectedType) params.set("type", selectedType)
      if (maxCost) params.set("maxCost", maxCost)
      if (maxDuration) params.set("maxDuration", maxDuration)
      params.set("sortBy", sortBy)
      params.set("limit", "30")

      const res = await fetch(`/api/activities?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch activities")
      const data = await res.json()
      setActivities(data.activities || [])
    } catch (err) {
      toast.error("Could not load activities")
    } finally {
      setIsLoading(false)
    }
  }, [query, cityId, selectedType, maxCost, maxDuration, sortBy])

  // Debounced fetch on filter change
  useEffect(() => {
    if (fetchTimeout.current) clearTimeout(fetchTimeout.current)
    fetchTimeout.current = setTimeout(() => {
      fetchActivities()
    }, 300)
    return () => {
      if (fetchTimeout.current) clearTimeout(fetchTimeout.current)
    }
  }, [fetchActivities])

  function handleAdd(activity: Activity) {
    setSelectedActivity(activity)
  }

  function handleActivityAdded(itineraryActivity: any) {
    const actId = itineraryActivity?.activity?.id || itineraryActivity?.activityId
    if (actId) {
      setLocalAdded((prev) => new Set([...prev, actId]))
    }
    onActivityAdded?.(itineraryActivity)
  }

  const activeFilterCount = [selectedType, maxCost, maxDuration].filter(Boolean).length

  return (
    <div className="flex flex-col h-full">
      {/* Search + filter bar */}
      <div className="p-4 space-y-3 border-b border-zinc-100">
        {/* Search row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                cityName
                  ? `Search activities in ${cityName}...`
                  : "Search activities..."
              }
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-400 transition-all bg-white"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            className={`relative flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              showFilters || activeFilterCount > 0
                ? "border-zinc-950 bg-zinc-950 text-white"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-white text-zinc-900 text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Type filter chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedType("")}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all border ${
              !selectedType
                ? "bg-zinc-950 text-white border-zinc-950"
                : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
            }`}
          >
            All
          </button>
          {ALL_TYPES.map((type) => {
            const isActive = selectedType === type
            const color = TYPE_COLORS[type] || "bg-zinc-100 text-zinc-700"
            return (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(isActive ? "" : type)}
                className={`shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                  isActive
                    ? "bg-zinc-950 text-white border-zinc-950"
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                }`}
              >
                {TYPE_ICONS[type]}
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </button>
            )
          })}
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="grid grid-cols-3 gap-2 pt-1 animate-in fade-in slide-in-from-top-1 duration-200">
            {/* Max Cost */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                Max Cost
              </label>
              <input
                type="number"
                min="0"
                value={maxCost}
                onChange={(e) => setMaxCost(e.target.value)}
                placeholder="Any"
                className="w-full px-2 py-1.5 rounded-lg border border-zinc-200 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
              />
            </div>

            {/* Max Duration */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Max (min)
              </label>
              <input
                type="number"
                min="0"
                value={maxDuration}
                onChange={(e) => setMaxDuration(e.target.value)}
                placeholder="Any"
                className="w-full px-2 py-1.5 rounded-lg border border-zinc-200 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
              />
            </div>

            {/* Sort */}
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                Sort by
              </label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full appearance-none px-2 py-1.5 pr-6 rounded-lg border border-zinc-200 text-xs focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all bg-white"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-400 pointer-events-none" />
              </div>
            </div>

            {/* Clear filters */}
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSelectedType("")
                  setMaxCost("")
                  setMaxDuration("")
                  setSortBy("popular")
                }}
                className="col-span-3 flex items-center justify-center gap-1 py-1 text-xs text-red-500 hover:text-red-700 transition-colors"
              >
                <X className="w-3 h-3" />
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
            <Loader2 className="w-7 h-7 animate-spin mb-3" />
            <p className="text-sm">Loading activities...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
            <Search className="w-8 h-8 mb-3 opacity-50" />
            <p className="text-sm font-medium text-zinc-600">No activities found</p>
            <p className="text-xs text-zinc-400 mt-1">Try a different search or fewer filters</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-zinc-400 mb-1">
              {activities.length} {activities.length === 1 ? "activity" : "activities"} found
              {cityName && ` in ${cityName}`}
            </p>
            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                isAdded={localAdded.has(activity.id)}
                onAdd={handleAdd}
              />
            ))}
          </>
        )}
      </div>

      {/* Add activity dialog */}
      {selectedActivity && (
        <AddActivityDialog
          activity={selectedActivity}
          days={days}
          tripId={tripId}
          stopId={stopId}
          onClose={() => setSelectedActivity(null)}
          onActivityAdded={handleActivityAdded}
        />
      )}
    </div>
  )
}
