"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Calendar, Image as ImageIcon, Loader2, Sparkles, Wallet, MapPin, Check } from "lucide-react"

const curatedCoverPresets = [
  {
    name: "Classic European Architecture",
    url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Tokyo Shinjuku Skyline",
    url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Mediterranean Coast & Villas",
    url: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Amsterdam Historic Canals",
    url: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Dubai Skyline & Desert",
    url: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Kyoto Zen Shrine Gardens",
    url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
  },
]

export function TripForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const prefilledCity = searchParams.get("city") || ""

  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState(prefilledCity ? `${prefilledCity} Grand Expedition` : "")
  const [description, setDescription] = useState(
    prefilledCity ? `Curated multi-day exploration of ${prefilledCity} and surrounding highlights.` : ""
  )
  const [startDate, setStartDate] = useState("2026-09-12")
  const [endDate, setEndDate] = useState("2026-09-24")
  const [budget, setBudget] = useState("3500")
  const [coverImage, setCoverImage] = useState(curatedCoverPresets[0].url)
  const [customCoverUrl, setCustomCoverUrl] = useState("")
  const [isPublic, setIsPublic] = useState(false)

  async function handleFormSubmit(isDraft: boolean = false) {
    if (!name.trim()) {
      toast.error("Please enter a trip name.")
      return
    }

    if (!startDate || !endDate) {
      toast.error("Please select start and end dates.")
      return
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("End date cannot precede start date.")
      return
    }

    setIsLoading(true)

    try {
      const selectedImage = customCoverUrl.trim() || coverImage

      const response = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          budget: Number(budget) || 0,
          coverImage: selectedImage,
          isPublic,
        }),
      })

      if (!response.ok) {
        const err = await response.json()
        throw new Error(err.message || "Failed to create trip")
      }

      const trip = await response.json()

      // If prefilled city exists, automatically create initial stop
      if (prefilledCity) {
        try {
          await fetch("/api/stops", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tripId: trip.id,
              city: prefilledCity,
              country: "International",
              startDate: new Date(startDate).toISOString(),
              endDate: new Date(endDate).toISOString(),
              notes: `Exploring ${prefilledCity}`,
              estimatedCost: Number(budget) || 0,
            }),
          })
        } catch (e) {
          // ignore stop creation error
        }
      }

      toast.success(isDraft ? "Draft trip saved successfully" : "Trip created successfully!")
      router.push(`/trips/${trip.id}`)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Failed to create trip.")
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleFormSubmit(false)
      }}
      className="space-y-8"
    >
      {/* 1. Trip Name & Description */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-zinc-700 font-semibold block">
            Trip Name *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. European Grand Escape, Japan Autumn Odyssey"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-950 focus:outline-hidden focus:ring-2 focus:ring-zinc-950 font-sans transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-zinc-700 font-semibold block">
            Trip Description & Theme (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="What is the narrative and aesthetic of this journey?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3.5 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-950 focus:outline-hidden focus:ring-2 focus:ring-zinc-950 font-sans transition-all"
          />
        </div>
      </div>

      {/* 2. Dates & Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-zinc-700 font-semibold block">
            Start Date *
          </label>
          <input
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl border border-zinc-300 bg-white text-sm font-mono text-zinc-950 focus:outline-hidden focus:ring-2 focus:ring-zinc-950 transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-zinc-700 font-semibold block">
            End Date *
          </label>
          <input
            type="date"
            required
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl border border-zinc-300 bg-white text-sm font-mono text-zinc-950 focus:outline-hidden focus:ring-2 focus:ring-zinc-950 transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-zinc-700 font-semibold block">
            Target Budget (USD $)
          </label>
          <input
            type="number"
            min="0"
            step="50"
            placeholder="3500"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl border border-zinc-300 bg-white text-sm font-mono text-zinc-950 focus:outline-hidden focus:ring-2 focus:ring-zinc-950 transition-all"
          />
        </div>
      </div>

      {/* 3. Cover Photo Selector & Presets */}
      <div className="space-y-3">
        <label className="text-xs font-mono uppercase tracking-wider text-zinc-700 font-semibold block">
          Cover Imagery
        </label>

        {/* Selected Image Preview */}
        <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-zinc-300 bg-zinc-100">
          <img
            src={customCoverUrl.trim() || coverImage}
            alt="Trip Cover Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-4 text-white text-xs font-mono font-semibold">
            {name || "Untitled Expedition"} Preview
          </div>
        </div>

        {/* Preset Selectors */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-1">
          {curatedCoverPresets.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => {
                setCoverImage(preset.url)
                setCustomCoverUrl("")
              }}
              className={`relative h-16 rounded-xl overflow-hidden border-2 transition-all group ${
                coverImage === preset.url && !customCoverUrl
                  ? "border-zinc-950 ring-2 ring-zinc-950/20"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
              {coverImage === preset.url && !customCoverUrl && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Custom URL Input */}
        <div className="pt-2">
          <input
            type="url"
            placeholder="Or paste custom image URL (https://...)"
            value={customCoverUrl}
            onChange={(e) => setCustomCoverUrl(e.target.value)}
            className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 bg-zinc-50 text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-zinc-950"
          />
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="pt-6 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isLoading}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100 text-xs font-mono uppercase tracking-wider font-semibold transition-all"
        >
          Cancel
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => handleFormSubmit(true)}
            disabled={isLoading}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-mono uppercase tracking-wider font-semibold shadow-2xs transition-all"
          >
            Save Draft
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 sm:flex-initial px-7 py-2.5 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-mono uppercase tracking-wider font-semibold shadow-xs active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Create Trip</span>
          </button>
        </div>
      </div>
    </form>
  )
}
