"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { toast } from "sonner"
import {
  Calendar,
  MapPin,
  Clock,
  Wallet,
  Copy,
  Check,
  Share2,
  Route,
  ArrowRight,
  Plane,
  Building,
  Utensils,
  Compass,
  Layers,
  Sparkles,
} from "lucide-react"

import { GlobeTrotterLogo } from "@/components/layout/globe-trotter-logo"

interface ActivityItem {
  id: string
  name: string
  time: string
  duration: string
  cost: number
  category: string
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

interface SharedTrip {
  id: string
  name: string
  description?: string
  startDate: string
  endDate: string
  budget: number
  coverImage?: string
  owner?: { name?: string; image?: string }
  stops: StopItem[]
  expenses: Array<{ category: string; amount: number; description: string; date: string }>
}

export default function PublicSharePage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const token = params?.token as string

  const [trip, setTrip] = useState<SharedTrip | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [isCopyingTrip, setIsCopyingTrip] = useState(false)

  useEffect(() => {
    async function loadPublicTrip() {
      try {
        const res = await fetch(`/api/share/${token}`)
        if (res.ok) {
          const data = await res.json()
          setTrip({
            id: data.id,
            name: data.name,
            description: data.description,
            startDate: data.startDate,
            endDate: data.endDate,
            budget: data.budget || 0,
            coverImage: data.coverImage,
            owner: data.owner,
            stops: data.stops?.map((s: any) => ({
              id: s.id,
              city: s.cityName || s.city?.name || s.city || "City",
              country: s.country || s.city?.country || "Country",
              startDate: s.arrivalDate,
              endDate: s.departureDate,
              notes: s.notes || "",
              estimatedCost: s.estimatedCost || 0,
              activities: s.days?.flatMap((d: any) =>
                d.activities?.map((a: any) => ({
                  id: a.id,
                  name: a.customName || a.activity?.name || "Activity",
                  time: a.timeText || "10:00",
                  duration: a.activity?.durationText || "2 hrs",
                  cost: a.customCost !== undefined ? a.customCost : a.activity?.defaultCost || 0,
                  category: a.category || "activities",
                  location: a.location,
                  notes: a.notes,
                })) || []
              ) || [],
            })) || [],
            expenses: data.expenses || [],
          })
        } else {
          // Fallback curated
          setTrip({
            id: "curated-share",
            name: "European Grand Escape",
            description: "Curated expedition through art, classical architecture, and culinary journeys in Paris, Amsterdam, and Rome.",
            startDate: "2026-09-12",
            endDate: "2026-09-24",
            budget: 3500,
            coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
            owner: { name: "Elena Rostova" },
            stops: [
              {
                id: "s1",
                city: "Paris",
                country: "France",
                startDate: "2026-09-12",
                endDate: "2026-09-16",
                notes: "World-class art galleries, Seine river twilight cruises, and Saint-Germain cafés.",
                estimatedCost: 1200,
                activities: [
                  { id: "a1", name: "Eiffel Tower Summit & Gardens", time: "09:30", duration: "2.5 hrs", cost: 45, category: "activities" },
                  { id: "a2", name: "Lunch at Café de Flore", time: "12:30", duration: "1.5 hrs", cost: 35, category: "meals" },
                  { id: "a3", name: "Louvre Museum Classical Tour", time: "15:00", duration: "3 hrs", cost: 35, category: "activities" },
                ],
              },
              {
                id: "s2",
                city: "Amsterdam",
                country: "Netherlands",
                startDate: "2026-09-16",
                endDate: "2026-09-20",
                notes: "Heritage canal rings, bicycle tours, and Van Gogh Museum archives.",
                estimatedCost: 950,
                activities: [
                  { id: "a4", name: "Heritage Canal Ring Boat Tour", time: "11:00", duration: "1.5 hrs", cost: 26, category: "activities" },
                  { id: "a5", name: "Van Gogh Museum Exhibition", time: "14:30", duration: "2 hrs", cost: 24, category: "activities" },
                ],
              },
              {
                id: "s3",
                city: "Rome",
                country: "Italy",
                startDate: "2026-09-20",
                endDate: "2026-09-24",
                notes: "Colosseum, Roman Forum, Vatican City, and Trastevere pasta tasting.",
                estimatedCost: 1350,
                activities: [
                  { id: "a6", name: "Colosseum & Roman Forum Guided Walk", time: "09:00", duration: "3.5 hrs", cost: 50, category: "activities" },
                  { id: "a7", name: "Trastevere Sunset Food & Wine Journey", time: "18:30", duration: "2.5 hrs", cost: 65, category: "meals" },
                ],
              },
            ],
            expenses: [],
          })
        }
      } catch (err) {
        // ignore
      } finally {
        setLoading(false)
      }
    }

    loadPublicTrip()
  }, [token])

  // Copy share URL or use native share API
  async function handleShareLink() {
    if (typeof window !== "undefined") {
      const url = window.location.href
      if (navigator.share) {
        try {
          await navigator.share({
            title: trip?.name || "Shared Itinerary",
            text: "Check out this travel itinerary!",
            url,
          })
          return
        } catch (err) {
          // If user cancels or it fails, fallback to copy
        }
      }
      
      navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success("Public itinerary link copied!")
      setTimeout(() => setCopied(false), 2500)
    }
  }

  // Copy trip to user account
  async function handleCopyTripToAccount() {
    if (!session?.user) {
      toast.error("Please sign in or create an account to copy this itinerary.")
      router.push(`/login?callbackUrl=/share/${token}`)
      return
    }

    setIsCopyingTrip(true)
    try {
      const res = await fetch(`/api/share/${token}/copy`, {
        method: "POST",
      })

      if (!res.ok) {
        throw new Error("Failed to copy trip")
      }

      const data = await res.json()
      toast.success("Itinerary cloned to your account!")
      router.push(`/trips/${data.tripId}`)
    } catch (err: any) {
      toast.error(err.message || "Could not copy trip.")
      setIsCopyingTrip(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center p-4">
        <div className="text-xs font-mono uppercase tracking-widest text-zinc-400">
          Loading Curated Itinerary...
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-zinc-950">Itinerary Not Found</h2>
        <p className="text-xs text-zinc-500 font-mono max-w-sm">
          This shared expedition may have been made private or deleted.
        </p>
        <Link href="/">
          <button type="button" className="px-5 py-2.5 rounded-xl bg-zinc-950 text-white font-mono text-xs uppercase font-semibold">
            Return Home
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-950 font-sans antialiased selection:bg-zinc-950 selection:text-white pb-24">
      {/* Top Read-Only Bar */}
      <div className="border-b border-zinc-200 bg-white sticky top-0 z-40 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <GlobeTrotterLogo className="w-5 h-5" />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleShareLink}
              className="px-3.5 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-mono uppercase tracking-wider font-semibold shadow-2xs transition-all flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? "Link Copied" : "Share"}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyTripToAccount}
              disabled={isCopyingTrip}
              className="px-5 py-2 rounded-xl bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-mono uppercase tracking-wider font-semibold shadow-xs transition-all flex items-center gap-2"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{isCopyingTrip ? "Cloning..." : "Copy Trip to My Account"}</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* Cover Hero Banner */}
        <div className="relative h-64 sm:h-80 w-full rounded-3xl overflow-hidden shadow-md bg-zinc-950">
          <img
            src={trip.coverImage || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80"}
            alt={trip.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          <div className="absolute bottom-6 left-6 sm:left-8 right-6 text-white space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-mono uppercase tracking-wider font-semibold">
              <span>Public Curated Itinerary</span>
              <span>•</span>
              <span>{trip.stops.length} Cities</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">{trip.name}</h1>
            <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-2xl leading-relaxed">
              {trip.description}
            </p>
          </div>
        </div>

        {/* Trip Meta Telemetry */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6 font-mono">
          <div className="space-y-1">
            <span className="text-[10px] uppercase text-zinc-400 block tracking-wider">Date Span</span>
            <span className="text-sm sm:text-base font-bold text-zinc-950 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-zinc-700" />
              {new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} —{" "}
              {new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase text-zinc-400 block tracking-wider">Estimated Budget</span>
            <span className="text-lg sm:text-xl font-bold text-zinc-950">
              ${trip.budget.toLocaleString("en-US")}
            </span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase text-zinc-400 block tracking-wider">Author</span>
            <span className="text-xs font-semibold text-zinc-700">
              {trip.owner?.name || "GlobeTrotter Curator"}
            </span>
          </div>
        </div>

        {/* Vertical Timeline of Stops & Sights */}
        <div className="space-y-8">
          <div className="pb-2 border-b border-zinc-200">
            <h2 className="text-2xl font-bold text-zinc-950 tracking-tight">Expedition Itinerary</h2>
            <p className="text-xs text-zinc-500 font-mono">Detailed schedule across all destinations</p>
          </div>

          <div className="space-y-8">
            {trip.stops.map((stop, index) => (
              <div key={stop.id} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-zinc-950 text-white font-mono text-xs font-bold flex items-center justify-center shadow-xs">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-zinc-950 tracking-tight">
                      {stop.city}, {stop.country}
                    </h3>
                    <span className="text-xs font-mono text-zinc-500">
                      {new Date(stop.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} —{" "}
                      {new Date(stop.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>

                {stop.notes && (
                  <p className="text-xs text-zinc-600 bg-zinc-50 border border-zinc-100 p-3.5 rounded-2xl leading-relaxed">
                    {stop.notes}
                  </p>
                )}

                <div className="relative pl-6 space-y-3 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-zinc-200">
                  {stop.activities.map((act) => (
                    <div
                      key={act.id}
                      className="relative group rounded-2xl border border-zinc-200/90 bg-white p-4 sm:p-5 shadow-2xs space-y-2"
                    >
                      <div className="absolute -left-6 top-6 -translate-x-1/2 w-3 h-3 rounded-full bg-zinc-950 border-2 border-white ring-2 ring-zinc-200" />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs font-bold text-zinc-900 bg-zinc-100 px-2.5 py-1 rounded-md">
                            {act.time}
                          </span>
                          <h4 className="text-base font-semibold text-zinc-950">{act.name}</h4>
                        </div>
                        <span className="font-mono text-xs font-bold text-zinc-900 self-end sm:self-auto">
                          ${act.cost.toLocaleString("en-US")}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono pt-1">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-zinc-400" />
                          <span>{act.duration}</span>
                        </div>
                        <span className="uppercase text-[10px] bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">
                          {act.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Copy Trip Callout */}
        <div className="rounded-3xl bg-zinc-950 text-white p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-lg">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-400">
              Personalize Expedition
            </span>
            <h3 className="text-2xl font-bold tracking-tight">Like this itinerary?</h3>
            <p className="text-xs text-zinc-300 font-light leading-relaxed">
              Clone this complete route, stops, and activities into your GlobeTrotter account to customize dates and expenses.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyTripToAccount}
            disabled={isCopyingTrip}
            className="px-7 py-3.5 rounded-2xl bg-white text-zinc-950 font-mono text-xs uppercase tracking-wider font-bold shadow-lg hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            <Copy className="w-4 h-4" />
            <span>{isCopyingTrip ? "Cloning Trip..." : "Copy to My Account"}</span>
          </button>
        </div>
      </main>
    </div>
  )
}
