"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Clock, DollarSign, Check, X, Sparkles, Filter } from "lucide-react"
import { toast } from "sonner"

interface ActivityTemplate {
  id: string
  name: string
  category: string
  description?: string | null
  durationText?: string | null
  defaultCost?: number | null
  imageUrl?: string | null
  city?: { name: string; country: string } | null
}

interface ActivityPickerModalProps {
  cityName: string
  onSelectActivity: (activity: {
    name: string
    category: "transport" | "stay" | "activities" | "meals" | "other"
    duration: string
    cost: number
    location?: string
    notes?: string
  }) => void
  onClose: () => void
}

const CATEGORIES = ["All", "Sightseeing", "Food", "Culture", "Nature", "Adventure", "Shopping"]

export function ActivityPickerModal({
  cityName,
  onSelectActivity,
  onClose,
}: ActivityPickerModalProps) {
  const [activities, setActivities] = useState<ActivityTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    async function fetchActivities() {
      setLoading(true)
      try {
        const queryParams = new URLSearchParams()
        if (cityName) queryParams.set("city", cityName)
        if (selectedCategory !== "All") queryParams.set("category", selectedCategory)
        if (searchQuery) queryParams.set("q", searchQuery)

        const res = await fetch(`/api/activities?${queryParams.toString()}`)
        if (res.ok) {
          const data = await res.json()
          setActivities(data)
        }
      } catch (err) {
        // ignore
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [cityName, selectedCategory, searchQuery])

  function handleChooseActivity(act: ActivityTemplate) {
    let cat: "transport" | "stay" | "activities" | "meals" | "other" = "activities"
    const actCat = (act.category || "").toLowerCase()
    if (actCat.includes("food") || actCat.includes("meal")) cat = "meals"
    else if (actCat.includes("transport")) cat = "transport"
    else if (actCat.includes("stay") || actCat.includes("hotel")) cat = "stay"

    onSelectActivity({
      name: act.name,
      category: cat,
      duration: act.durationText || "2 hrs",
      cost: act.defaultCost || 30,
      location: cityName,
      notes: act.description || "",
    })
    toast.success(`Added ${act.name} to ${cityName}`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-zinc-200 max-h-[85vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100 shrink-0">
          <div>
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-400">
              Activity Catalog
            </span>
            <h3 className="text-xl font-bold text-zinc-950">
              Discover & Add Activities for {cityName || "Destination"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-full text-zinc-400 hover:text-zinc-950 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="space-y-3 shrink-0">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder={`Search sights, foods, or tours in ${cityName || "all cities"}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-zinc-200 bg-zinc-50 text-xs text-zinc-950 focus:outline-hidden focus:ring-2 focus:ring-zinc-950 font-sans"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-mono">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg uppercase tracking-wider transition-all shrink-0 ${
                  selectedCategory === cat
                    ? "bg-zinc-950 text-white font-bold"
                    : "bg-zinc-100 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Activities List */}
        <div className="flex-1 overflow-y-auto divide-y divide-zinc-100 pr-1">
          {loading ? (
            <div className="py-12 text-center text-xs font-mono text-zinc-400">
              Loading curated activities...
            </div>
          ) : activities.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-zinc-400">
              No matching activities found for this criteria.
            </div>
          ) : (
            activities.map((act) => (
              <div
                key={act.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group hover:bg-zinc-50/70 p-2 rounded-2xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  {act.imageUrl && (
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                      <img src={act.imageUrl} alt={act.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="space-y-0.5 min-w-0">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700">
                      {act.category || "Sightseeing"}
                    </span>
                    <h4 className="text-sm font-semibold text-zinc-950 truncate max-w-sm">{act.name}</h4>
                    <p className="text-xs text-zinc-500 line-clamp-1">{act.description}</p>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400 pt-0.5">
                      <span>{act.durationText || "2 hrs"}</span>
                      <span>•</span>
                      <span className="text-zinc-900 font-bold">${act.defaultCost || 35}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleChooseActivity(act)}
                  className="self-end sm:self-auto px-4 py-2 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-mono uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 shadow-2xs shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-zinc-100 flex justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-zinc-200 text-xs font-mono uppercase text-zinc-600 hover:bg-zinc-100"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
