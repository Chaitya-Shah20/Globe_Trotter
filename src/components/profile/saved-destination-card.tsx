"use client"

import { useState } from "react"
import Link from "next/link"
import { MapPin, Heart, Plus, Sparkles, Loader2, ArrowUpRight } from "lucide-react"
import { toast } from "sonner"

interface City {
  id: string
  name: string
  country: string
  costIndex: number
  imageUrl?: string | null
}

interface SavedDestinationCardProps {
  city: City
  onRemove?: (cityId: string) => void
}

export function SavedDestinationCard({ city, onRemove }: SavedDestinationCardProps) {
  const [isRemoving, setIsRemoving] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  async function handleToggleSave() {
    setIsRemoving(true)
    try {
      const res = await fetch("/api/user/saved-destinations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cityId: city.id }),
      })

      if (!res.ok) {
        throw new Error("Failed to update bucket list")
      }

      const data = await res.json()
      toast.success(data.message || `Removed ${city.name} from bucket list`)
      if (onRemove) {
        onRemove(city.id)
      }
    } catch (error) {
      toast.error("Failed to update saved destinations")
    } finally {
      setIsRemoving(false)
    }
  }

  // Cost index visual indicator
  const costSymbols = Array(city.costIndex || 2).fill("$").join("")
  const costEmpty = Array(Math.max(0, 5 - (city.costIndex || 2))).fill("$").join("")

  const fallbackImage =
    "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80"

  return (
    <div
      className="group relative rounded-2xl bg-white border border-zinc-200/80 shadow-xs hover:shadow-xl hover:border-zinc-300 transition-all duration-300 overflow-hidden flex flex-col justify-between"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden bg-zinc-100">
        <img
          src={city.imageUrl || fallbackImage}
          alt={city.name}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
        />
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />

        {/* Top Badges: Cost Level & Unsave Action */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="pointer-events-auto inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-950/70 backdrop-blur-md border border-white/10 text-[11px] font-mono font-medium text-white shadow-sm">
            <span className="text-emerald-400 font-bold">{costSymbols}</span>
            <span className="text-zinc-500">{costEmpty}</span>
          </span>

          <button
            type="button"
            onClick={handleToggleSave}
            disabled={isRemoving}
            aria-label="Remove from bucket list"
            className="pointer-events-auto relative p-2 rounded-xl bg-zinc-950/70 hover:bg-zinc-950/90 backdrop-blur-md border border-white/15 text-rose-400 hover:text-rose-300 transition-all shadow-sm hover:scale-105 active:scale-95"
            title="Remove from Bucket List"
          >
            {isRemoving ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            )}
          </button>
        </div>

        {/* Bottom City & Country overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-1.5 text-xs text-zinc-300 font-mono tracking-wider uppercase mb-0.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{city.country}</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white leading-tight drop-shadow-sm">
            {city.name}
          </h3>
        </div>
      </div>

      {/* Card Content & Actions */}
      <div className="p-4 bg-white flex items-center justify-between gap-2">
        <div className="text-xs text-zinc-500">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5 align-middle" />
          Ready for booking
        </div>

        <Link
          href={`/trips/new?city=${encodeURIComponent(city.name)}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-mono font-semibold uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs"
        >
          <span>Plan Trip</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  )
}
