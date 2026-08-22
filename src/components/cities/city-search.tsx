"use client"

import { useState, useEffect, useTransition } from "react"
import {
  Search,
  MapPin,
  Sparkles,
  Heart,
  Plus,
  ArrowUpRight,
  SlidersHorizontal,
  Globe2,
  Coins,
  Compass,
  Star,
  Loader2,
  X,
  Check,
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { AddToTripDialog } from "./add-to-trip-dialog"

export interface CityData {
  id: string
  name: string
  country: string
  region: string
  lat: number
  lng: number
  costIndex: number
  imageUrl?: string | null
  activityCount?: number
  popularityScore?: number
  isSaved?: boolean
}

interface CitySearchProps {
  initialCities?: CityData[]
  preselectedTripId?: string
  tripStartDate?: string
  tripEndDate?: string
  onCityAddedToTrip?: (newStop: any) => void
  showTitle?: boolean
}

const REGIONS = [
  "All",
  "Europe",
  "Asia",
  "Americas",
  "Africa & Middle East",
  "Oceania",
]

const COST_LEVELS = [
  { value: 0, label: "All Cost Levels" },
  { value: 1, label: "$ • Budget Friendly" },
  { value: 2, label: "$$ • Moderate" },
  { value: 3, label: "$$$ • Standard" },
  { value: 4, label: "$$$$ • Upscale" },
  { value: 5, label: "$$$$$ • Ultra Luxury" },
]

export function CitySearch({
  initialCities = [],
  preselectedTripId,
  tripStartDate,
  tripEndDate,
  onCityAddedToTrip,
  showTitle = true,
}: CitySearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("All")
  const [selectedCostIndex, setSelectedCostIndex] = useState<number>(0)
  const [sortBy, setSortBy] = useState("popular")

  const [cities, setCities] = useState<CityData[]>(initialCities)
  const [isLoading, setIsLoading] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Selected city for "Add to Trip" dialog
  const [cityToAddToTrip, setCityToAddToTrip] = useState<CityData | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Fetch / filter cities from API
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCities()
    }, 200)
    return () => clearTimeout(timer)
  }, [searchQuery, selectedRegion, selectedCostIndex, sortBy])

  async function fetchCities() {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchQuery.trim()) params.set("q", searchQuery.trim())
      if (selectedRegion !== "All") params.set("region", selectedRegion)
      if (selectedCostIndex > 0) params.set("costIndex", selectedCostIndex.toString())
      if (sortBy) params.set("sortBy", sortBy)

      const res = await fetch(`/api/cities?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch cities")
      const data = await res.json()
      setCities(data.cities || [])
    } catch (error) {
      console.error("City search error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle bucket list saving
  async function handleToggleSave(cityId: string, cityName: string, e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    // Optimistic update
    setCities((prev) =>
      prev.map((c) => (c.id === cityId ? { ...c, isSaved: !c.isSaved } : c))
    )

    try {
      const res = await fetch("/api/user/saved-destinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cityId }),
      })

      if (!res.ok) throw new Error("Failed to update bucket list")
      const data = await res.json()
      toast.success(data.message || `${cityName} bucket list updated`)
    } catch (error) {
      toast.error("Failed to update saved destinations")
      // Revert optimistic update
      setCities((prev) =>
        prev.map((c) => (c.id === cityId ? { ...c, isSaved: !c.isSaved } : c))
      )
    }
  }

  function handleOpenAddToTrip(city: CityData) {
    setCityToAddToTrip(city)
    setIsAddDialogOpen(true)
  }

  const fallbackPhoto =
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80"

  return (
    <div className="space-y-8">
      {/* Optional Hero Title */}
      {showTitle && (
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200">
            <Compass className="w-3.5 h-3.5 text-zinc-950 animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-600 uppercase font-semibold">
              Global Expedition Explorer
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-light text-zinc-950 tracking-tight">
            Discover & Add <span className="font-semibold">Destinations</span>
          </h2>
          <p className="text-sm text-zinc-500 max-w-xl">
            Search multi-city anchor destinations, inspect cost indices and curated activities, and add them directly to your itinerary.
          </p>
        </div>
      )}

      {/* SEARCH BAR & CONTROLS CONTAINER */}
      <div className="space-y-4 rounded-3xl bg-white p-5 sm:p-6 border border-zinc-200 shadow-xs">
        {/* Main Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cities, countries, or regions (e.g., Tokyo, France, Alpine...)"
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-950 placeholder:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 transition-all font-sans"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-zinc-200 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Row: Region Tabs + Cost Index + Sort By */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2 border-t border-zinc-100">
          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {REGIONS.map((region) => (
              <button
                key={region}
                type="button"
                onClick={() => setSelectedRegion(region)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition-all ${
                  selectedRegion === region
                    ? "bg-zinc-950 text-white font-semibold shadow-xs"
                    : "bg-zinc-100 hover:bg-zinc-200/80 text-zinc-600"
                }`}
              >
                {region}
              </button>
            ))}
          </div>

          {/* Secondary Dropdown Filters: Cost & Sort */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Cost Index Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono text-zinc-500">Cost:</span>
              <select
                value={selectedCostIndex}
                onChange={(e) => setSelectedCostIndex(parseInt(e.target.value, 10))}
                className="px-3 py-1.5 rounded-xl bg-zinc-100 border border-zinc-200 text-xs font-mono text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-950"
              >
                {COST_LEVELS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Order */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono text-zinc-500">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-zinc-100 border border-zinc-200 text-xs font-mono text-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-950"
              >
                <option value="popular">Most Popular</option>
                <option value="cost_asc">Cost: Low to High</option>
                <option value="cost_desc">Cost: High to Low</option>
                <option value="alphabetical">A — Z</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* RESULTS COUNT & SPINNER */}
      <div className="flex items-center justify-between text-xs font-mono text-zinc-500 px-1">
        <div className="flex items-center gap-2">
          <span>Showing {cities.length} global destinations</span>
          {selectedRegion !== "All" && (
            <span className="px-2 py-0.5 rounded-md bg-zinc-200 text-zinc-700">
              in {selectedRegion}
            </span>
          )}
        </div>
        {isLoading && (
          <span className="flex items-center gap-1.5 text-zinc-700">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Searching...</span>
          </span>
        )}
      </div>

      {/* CITIES GRID */}
      {cities.length === 0 && !isLoading ? (
        <div className="p-12 rounded-3xl bg-white border border-dashed border-zinc-300 text-center space-y-4">
          <Globe2 className="w-10 h-10 text-zinc-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-zinc-900">No destinations found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              We couldn't find any cities matching your search filters. Try clearing or expanding your keywords.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("")
              setSelectedRegion("All")
              setSelectedCostIndex(0)
            }}
            className="px-4 py-2 rounded-xl bg-zinc-950 text-white font-mono text-xs font-semibold uppercase tracking-wider hover:bg-zinc-800"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {cities.map((city) => {
            const costSymbols = Array(city.costIndex || 2).fill("$").join("")
            const costEmpty = Array(Math.max(0, 5 - (city.costIndex || 2))).fill("$").join("")

            return (
              <div
                key={city.id}
                className="group relative rounded-3xl bg-white border border-zinc-200/90 shadow-xs hover:shadow-xl hover:border-zinc-300 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Photo Header */}
                <div className="relative h-48 w-full overflow-hidden bg-zinc-100">
                  <img
                    src={city.imageUrl || fallbackPhoto}
                    alt={city.name}
                    className="h-full w-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  {/* Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/85 via-zinc-950/25 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-950/70 backdrop-blur-md border border-white/10 text-[11px] font-mono font-medium text-white shadow-sm">
                      <span className="text-emerald-400 font-bold">{costSymbols}</span>
                      <span className="text-zinc-500">{costEmpty}</span>
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleToggleSave(city.id, city.name, e)}
                      aria-label="Save to Bucket List"
                      className="relative p-2 rounded-xl bg-zinc-950/70 hover:bg-zinc-950/90 backdrop-blur-md border border-white/15 text-zinc-300 hover:text-white transition-all shadow-sm active:scale-95"
                      title={city.isSaved ? "Saved to Bucket List" : "Save to Bucket List"}
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          city.isSaved
                            ? "fill-rose-500 text-rose-500"
                            : "text-zinc-300 hover:text-rose-400"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Bottom City Name & Country */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-mono tracking-wider uppercase mb-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{city.country}</span>
                      <span className="text-zinc-500">•</span>
                      <span className="text-[10px] text-zinc-400">{city.region}</span>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-white leading-tight">
                      {city.name}
                    </h3>
                  </div>
                </div>

                {/* Card Meta & Action Footer */}
                <div className="p-4 bg-white space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-500 font-mono">
                    <span className="flex items-center gap-1 text-amber-600 font-medium">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>Top Rated</span>
                    </span>
                    <span>
                      {city.activityCount && city.activityCount > 0
                        ? `${city.activityCount} Activities`
                        : "Curated Spots"}
                    </span>
                  </div>

                  {/* Action Buttons: Add to Trip & Plan Trip */}
                  <div className="flex items-center gap-2 pt-1 border-t border-zinc-100">
                    <button
                      type="button"
                      onClick={() => handleOpenAddToTrip(city)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 font-mono text-xs font-semibold uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Trip</span>
                    </button>

                    <Link
                      href={`/trips/new?city=${encodeURIComponent(city.name)}`}
                      className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-all"
                      title={`Plan new standalone expedition to ${city.name}`}
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add To Trip Modal Dialog */}
      <AddToTripDialog
        city={cityToAddToTrip}
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        preselectedTripId={preselectedTripId}
        tripStartDate={tripStartDate}
        tripEndDate={tripEndDate}
        onSuccess={(newStop) => {
          if (onCityAddedToTrip) {
            onCityAddedToTrip(newStop)
          }
        }}
      />
    </div>
  )
}
