"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Search,
  MapPin,
  Star,
  Compass,
  Filter,
  Plus,
  ArrowRight,
  Clock,
  Sparkles,
  Layers,
  Check,
  Heart,
} from "lucide-react"
import { toast } from "sonner"

interface CityItem {
  id: string
  name: string
  country: string
  region?: string | null
  costIndex: number
  popularityScore?: number | null
  imageUrl?: string | null
  description?: string | null
}

interface ActivityItem {
  id: string
  name: string
  category: string
  description?: string | null
  durationText?: string | null
  defaultCost?: number | null
  imageUrl?: string | null
  city?: { name: string; country: string } | null
}

const REGIONS = ["All", "Europe", "Asia", "Middle East", "Americas"]
const CATEGORIES = ["All", "Sightseeing", "Food", "Culture", "Nature", "Adventure", "Shopping"]

const fallbackCities: CityItem[] = [
  {
    id: "city_paris",
    name: "Paris",
    country: "France",
    region: "Europe",
    costIndex: 5,
    popularityScore: 4.95,
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
    description: "The City of Light, world-renowned for art, classical architecture, and culinary excellence.",
  },
  {
    id: "city_tokyo",
    name: "Tokyo",
    country: "Japan",
    region: "Asia",
    costIndex: 4,
    popularityScore: 4.98,
    imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    description: "A mesmerizing blend of hyper-modern neon skylines, tranquil shrines, and culinary mastery.",
  },
  {
    id: "city_rome",
    name: "Rome",
    country: "Italy",
    region: "Europe",
    costIndex: 4,
    popularityScore: 4.92,
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
    description: "The Eternal City with thousands of years of art, ancient amphitheaters, and lively piazzas.",
  },
  {
    id: "city_amsterdam",
    name: "Amsterdam",
    country: "Netherlands",
    region: "Europe",
    costIndex: 4,
    popularityScore: 4.88,
    imageUrl: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80",
    description: "Historic canal belts, world-class art museums, cycling culture, and open-air cafés.",
  },
  {
    id: "city_dubai",
    name: "Dubai",
    country: "UAE",
    region: "Middle East",
    costIndex: 5,
    popularityScore: 4.91,
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    description: "Futuristic architecture, ultra-luxury shopping, dune adventures, and breathtaking coastlines.",
  },
  {
    id: "city_kyoto",
    name: "Kyoto",
    country: "Japan",
    region: "Asia",
    costIndex: 3,
    popularityScore: 4.94,
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
    description: "The cultural heart of Japan with thousands of classical Buddhist temples and zen gardens.",
  },
  {
    id: "city_bali",
    name: "Bali",
    country: "Indonesia",
    region: "Asia",
    costIndex: 2,
    popularityScore: 4.89,
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
    description: "Tropical paradise with volcanic mountains, iconic terraced rice paddies, and world-class surfing.",
  },
  {
    id: "city_newyork",
    name: "New York",
    country: "United States",
    region: "Americas",
    costIndex: 5,
    popularityScore: 4.97,
    imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80",
    description: "The vibrant global metropolis of finance, Broadway theater, world cuisine, and iconic skyline.",
  },
]

export default function DiscoverPage() {
  const [viewTab, setViewTab] = useState<"cities" | "activities">("cities")
  const [cities, setCities] = useState<CityItem[]>(fallbackCities)
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [savedCities, setSavedCities] = useState<Record<string, boolean>>({})

  // Fetch Cities
  useEffect(() => {
    async function loadCities() {
      try {
        const params = new URLSearchParams()
        if (searchQuery) params.set("search", searchQuery)
        if (selectedRegion !== "All") params.set("region", selectedRegion)

        const res = await fetch(`/api/cities?${params.toString()}`)
        if (res.ok) {
          const data = await res.json()
          if (data.length > 0) setCities(data)
        }
      } catch (err) {
        // use fallback
      }
    }

    if (viewTab === "cities") {
      loadCities()
    }
  }, [searchQuery, selectedRegion, viewTab])

  // Fetch Activities
  useEffect(() => {
    async function loadActivities() {
      try {
        const params = new URLSearchParams()
        if (searchQuery) params.set("q", searchQuery)
        if (selectedCategory !== "All") params.set("category", selectedCategory)

        const res = await fetch(`/api/activities?${params.toString()}`)
        if (res.ok) {
          const data = await res.json()
          setActivities(data)
        }
      } catch (err) {
        // ignore
      }
    }

    if (viewTab === "activities") {
      loadActivities()
    }
  }, [searchQuery, selectedCategory, viewTab])

  // Bookmark Toggle
  async function handleToggleSaveCity(cityId: string, cityName: string) {
    try {
      const res = await fetch("/api/cities/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cityId }),
      })

      if (res.ok) {
        const data = await res.json()
        setSavedCities((prev) => ({ ...prev, [cityId]: data.saved }))
        toast.success(data.message || (data.saved ? `Saved ${cityName}` : `Removed ${cityName}`))
      } else if (res.status === 401) {
        toast.error("Please sign in to save destinations.")
      }
    } catch (e) {
      toast.error("Failed to update bookmark.")
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-950 font-sans antialiased pb-24">
      {/* 1. Header & Hero Explorer Banner */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 inline-block" />
              <span>Destination Intelligence</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950">
              Where will you explore next?
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 font-light max-w-2xl">
              Search global destinations, evaluate cost indexes and popularity metrics, and discover curated activities.
            </p>
          </div>

          {/* Tab Switcher: Cities vs Activities */}
          <div className="inline-flex p-1 bg-zinc-100 rounded-2xl border border-zinc-200 text-xs font-mono">
            <button
              type="button"
              onClick={() => setViewTab("cities")}
              className={`px-5 py-2 rounded-xl uppercase tracking-wider transition-all flex items-center gap-2 ${
                viewTab === "cities"
                  ? "bg-zinc-950 text-white font-bold shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>City Directory</span>
            </button>
            <button
              type="button"
              onClick={() => setViewTab("activities")}
              className={`px-5 py-2 rounded-xl uppercase tracking-wider transition-all flex items-center gap-2 ${
                viewTab === "activities"
                  ? "bg-zinc-950 text-white font-bold shadow-2xs"
                  : "text-zinc-600 hover:text-zinc-950"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Activity Search</span>
            </button>
          </div>

          {/* Search Bar & Filters */}
          <div className="space-y-4 pt-2">
            <div className="relative max-w-3xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
              <input
                type="text"
                placeholder={
                  viewTab === "cities"
                    ? "Search cities, countries, or regions (e.g. Tokyo, France, Europe)..."
                    : "Search activities, food tours, or sights (e.g. Eiffel Tower, Sushi Masterclass)..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-2xl border border-zinc-300 bg-white text-sm text-zinc-950 focus:outline-hidden focus:ring-2 focus:ring-zinc-950 font-sans shadow-xs transition-all"
              />
            </div>

            {/* Region / Category pills */}
            {viewTab === "cities" ? (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-mono">
                <span className="text-zinc-400 uppercase text-[10px] pr-1">Region:</span>
                {REGIONS.map((region) => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => setSelectedRegion(region)}
                    className={`px-3.5 py-1.5 rounded-xl uppercase tracking-wider transition-all shrink-0 ${
                      selectedRegion === region
                        ? "bg-zinc-950 text-white font-bold"
                        : "bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200"
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-mono">
                <span className="text-zinc-400 uppercase text-[10px] pr-1">Category:</span>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl uppercase tracking-wider transition-all shrink-0 ${
                      selectedCategory === cat
                        ? "bg-zinc-950 text-white font-bold"
                        : "bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Content Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {viewTab === "cities" ? (
          /* CITIES DIRECTORY GRID (Screen 6) */
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">
                Found {cities.length} Curated Destinations
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {cities.map((city) => {
                const isSaved = savedCities[city.id]

                return (
                  <div
                    key={city.id}
                    className="group rounded-3xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all duration-300 overflow-hidden flex flex-col shadow-xs"
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-zinc-100">
                      <img
                        src={city.imageUrl || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80"}
                        alt={city.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleSaveCity(city.id, city.name)}
                          aria-label="Save destination"
                          className="p-1.5 rounded-full bg-white/90 backdrop-blur-md text-zinc-700 hover:text-zinc-950 shadow-xs transition-colors"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isSaved ? "fill-zinc-950 text-zinc-950" : ""}`} />
                        </button>
                        <div className="px-2 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono text-zinc-950 flex items-center gap-1 font-bold shadow-xs">
                          <Star className="w-3 h-3 fill-zinc-950 text-zinc-950" />
                          <span>{city.popularityScore || 4.9}</span>
                        </div>
                      </div>

                      <div className="absolute bottom-3 left-4 text-white">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-300 block">
                          {city.country}
                        </span>
                        <h3 className="text-xl font-bold tracking-tight">{city.name}</h3>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <p className="text-xs text-zinc-600 font-light leading-relaxed line-clamp-2">
                          {city.description}
                        </p>
                        <div className="flex items-center justify-between text-xs font-mono text-zinc-500 pt-1">
                          <span>Cost Index</span>
                          <span className="font-bold text-zinc-950">
                            {Array(city.costIndex || 3).fill('$').join('')}
                            <span className="text-zinc-300">{Array(5 - (city.costIndex || 3)).fill('$').join('')}</span>
                          </span>
                        </div>
                      </div>

                      <Link href={`/trips/new?city=${encodeURIComponent(city.name)}`} className="w-full">
                        <button
                          type="button"
                          className="w-full py-2.5 rounded-xl bg-zinc-950 text-white font-mono text-xs uppercase tracking-wider font-semibold hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Plan Trip Here</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          /* ACTIVITIES SEARCH GRID (Screen 7) */
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <span className="text-xs font-mono uppercase tracking-wider text-zinc-500">
                Found {activities.length} Curated Experiences & Sights
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="group rounded-3xl border border-zinc-200 bg-white hover:border-zinc-300 transition-all duration-300 overflow-hidden flex flex-col shadow-xs"
                >
                  {act.imageUrl && (
                    <div className="relative h-44 w-full overflow-hidden bg-zinc-100">
                      <img
                        src={act.imageUrl}
                        alt={act.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-mono font-semibold uppercase text-zinc-900 shadow-xs">
                        {act.category || "Sightseeing"}
                      </div>
                    </div>
                  )}

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{act.city?.name || "Global"}, {act.city?.country || "Destination"}</span>
                      </div>
                      <h3 className="text-base font-bold text-zinc-950 tracking-tight">{act.name}</h3>
                      <p className="text-xs text-zinc-600 font-light leading-relaxed line-clamp-2">
                        {act.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between font-mono text-xs">
                      <div className="flex items-center gap-1 text-zinc-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{act.durationText || "2 hrs"}</span>
                      </div>
                      <span className="font-bold text-zinc-950 text-sm">
                        ${act.defaultCost || 35}
                      </span>
                    </div>

                    <Link href={`/trips/new?city=${encodeURIComponent(act.city?.name || "Paris")}`}>
                      <button
                        type="button"
                        className="w-full py-2.5 rounded-xl border border-zinc-300 bg-white text-zinc-900 font-mono text-xs uppercase tracking-wider font-semibold hover:bg-zinc-100 transition-all flex items-center justify-center gap-1.5"
                      >
                        <span>Add to New Itinerary</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
