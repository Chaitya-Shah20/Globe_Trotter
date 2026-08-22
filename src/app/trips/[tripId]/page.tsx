"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import {
  Calendar,
  MapPin,
  Route,
  Clock,
  Wallet,
  Compass,
  ArrowUp,
  ArrowDown,
  Plus,
  Share2,
  Edit3,
  CheckCircle2,
  Trash2,
  Eye,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Plane,
  Building,
  Utensils,
  Check,
  Copy,
  CalendarDays,
  Search,
} from "lucide-react"

import { BudgetDashboard, ExpenseItem } from "@/components/budget/budget-dashboard"
import { CalendarTimelineView } from "@/components/itinerary/calendar-timeline-view"
import { ActivityPickerModal } from "@/components/activities/activity-picker-modal"

// Types definition for Itinerary
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

interface TripDetails {
  id: string
  name: string
  description?: string
  startDate: string
  endDate: string
  budget: number
  coverImage?: string
  shareToken?: string
  stops: StopItem[]
  expenses: ExpenseItem[]
}

// Initial curated trip fallback data
const initialCuratedTrip: TripDetails = {
  id: "trip_euro_2026",
  name: "European Grand Escape",
  description: "Curated journey through art, architecture, and cuisine in Paris, Amsterdam, and Rome.",
  startDate: "2026-09-12",
  endDate: "2026-09-24",
  budget: 3500,
  coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
  shareToken: "gt-share-euro-2026",
  stops: [
    {
      id: "stop-paris-1",
      city: "Paris",
      country: "France",
      startDate: "2026-09-12",
      endDate: "2026-09-16",
      notes: "Art galleries, historic architecture, and twilight river cruises along the Seine.",
      estimatedCost: 1200,
      activities: [
        {
          id: "act-paris-1",
          name: "Eiffel Tower Summit & Gardens",
          time: "09:30",
          duration: "2.5 hrs",
          cost: 45,
          category: "activities",
          location: "Champ de Mars, Paris",
        },
        {
          id: "act-paris-2",
          name: "Lunch at Café de Flore",
          time: "12:30",
          duration: "1.5 hrs",
          cost: 35,
          category: "meals",
          location: "Saint-Germain-des-Prés",
        },
        {
          id: "act-paris-3",
          name: "Louvre Museum Classical Tour",
          time: "15:00",
          duration: "3 hrs",
          cost: 35,
          category: "activities",
          location: "Rue de Rivoli, Paris",
        },
        {
          id: "act-paris-4",
          name: "Seine River Twilight Cruise",
          time: "19:30",
          duration: "2 hrs",
          cost: 85,
          category: "meals",
          location: "Port de la Bourdonnais",
        },
      ],
    },
    {
      id: "stop-amsterdam-2",
      city: "Amsterdam",
      country: "Netherlands",
      startDate: "2026-09-16",
      endDate: "2026-09-20",
      notes: "Historic canal rings, cycling expeditions, and Dutch master museum archives.",
      estimatedCost: 950,
      activities: [
        {
          id: "act-ams-1",
          name: "High-Speed Eurostar Express Train",
          time: "08:15",
          duration: "3.5 hrs",
          cost: 140,
          category: "transport",
          location: "Paris Gare du Nord → Amsterdam Centraal",
        },
        {
          id: "act-ams-2",
          name: "Heritage Canal Ring Boat Tour",
          time: "11:00",
          duration: "1.5 hrs",
          cost: 26,
          category: "activities",
          location: "Prinsengracht, Amsterdam",
        },
        {
          id: "act-ams-3",
          name: "Van Gogh Museum Exhibition",
          time: "14:30",
          duration: "2 hrs",
          cost: 24,
          category: "activities",
          location: "Museumplein, Amsterdam",
        },
      ],
    },
    {
      id: "stop-rome-3",
      city: "Rome",
      country: "Italy",
      startDate: "2026-09-20",
      endDate: "2026-09-24",
      notes: "Ancient Roman monuments, storied piazzas, and authentic culinary journeys.",
      estimatedCost: 1350,
      activities: [
        {
          id: "act-rome-1",
          name: "Colosseum & Roman Forum Guided Walk",
          time: "09:00",
          duration: "3.5 hrs",
          cost: 50,
          category: "activities",
          location: "Piazza del Colosseo, Rome",
        },
        {
          id: "act-rome-2",
          name: "Trastevere Food & Wine Experience",
          time: "18:30",
          duration: "2.5 hrs",
          cost: 65,
          category: "meals",
          location: "Trastevere, Rome",
        },
        {
          id: "act-rome-3",
          name: "Vatican Museums & Sistine Chapel",
          time: "10:00",
          duration: "3 hrs",
          cost: 48,
          category: "activities",
          location: "Vatican City",
        },
      ],
    },
  ],
  expenses: [
    { id: "exp-1", category: "activities", amount: 45, description: "Eiffel Tower Tickets", date: "2026-09-13" },
    { id: "exp-2", category: "meals", amount: 35, description: "Café de Flore Lunch", date: "2026-09-13" },
    { id: "exp-3", category: "stay", amount: 650, description: "Paris Boutique Hotel (4 nights)", date: "2026-09-12" },
    { id: "exp-4", category: "transport", amount: 140, description: "Eurostar Paris to Amsterdam", date: "2026-09-16" },
    { id: "exp-5", category: "stay", amount: 520, description: "Amsterdam Canal Loft (4 nights)", date: "2026-09-16" },
    { id: "exp-6", category: "transport", amount: 180, description: "Flight Amsterdam to Rome", date: "2026-09-20" },
  ],
}

function formatDateRange(startDateStr: string, endDateStr: string): string {
  try {
    const start = new Date(startDateStr)
    const end = new Date(endDateStr)
    const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short" }
    const startPart = start.toLocaleDateString("en-US", options)
    const endPart = end.toLocaleDateString("en-US", options)
    return `${startPart} — ${endPart}`
  } catch (e) {
    return `${startDateStr} — ${endDateStr}`
  }
}

function calculateTotalDays(startDateStr: string, endDateStr: string): number {
  try {
    const start = new Date(startDateStr)
    const end = new Date(endDateStr)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays > 0 ? diffDays : 1
  } catch {
    return 12
  }
}

export default function TripPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const tripId = (params?.tripId as string) || "trip_euro_2026"

  // Tabs: 'builder' (Screen 4) | 'view' (Screen 5) | 'budget' (Screen 8) | 'calendar' (Screen 9)
  const [activeTab, setActiveTab] = useState<"builder" | "view" | "budget" | "calendar">("builder")
  
  // Itinerary view mode: 'timeline' | 'list'
  const [viewMode, setViewMode] = useState<"timeline" | "list">("timeline")

  // Trip state
  const [trip, setTrip] = useState<TripDetails>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`globetrotter_trip_${tripId}`)
      if (saved) {
        try {
          return JSON.parse(saved)
        } catch (e) {
          // fallback
        }
      }
    }
    return {
      ...initialCuratedTrip,
      id: tripId,
    }
  })

  // Load from API if trip exists on server
  useEffect(() => {
    async function loadRemoteTrip() {
      try {
        const res = await fetch(`/api/trips/${tripId}`)
        if (res.ok) {
          const data = await res.json()
          setTrip((prev) => ({
            ...prev,
            name: data.name || prev.name,
            description: data.description || prev.description,
            startDate: data.startDate || prev.startDate,
            endDate: data.endDate || prev.endDate,
            budget: data.budget !== undefined ? data.budget : prev.budget,
            coverImage: data.coverImage || prev.coverImage,
            shareToken: data.shareToken || prev.shareToken,
            stops: data.stops?.length > 0
              ? data.stops.map((s: any) => ({
                  id: s.id,
                  city: s.cityName || s.city?.name || s.city || "City",
                  country: s.country || s.city?.country || "Country",
                  startDate: s.arrivalDate || prev.startDate,
                  endDate: s.departureDate || prev.endDate,
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
                }))
              : prev.stops,
            expenses: data.expenses?.length > 0 ? data.expenses : prev.expenses,
          }))
        }
      } catch (err) {
        // use local
      }
    }

    loadRemoteTrip()
  }, [tripId])

  // Persist trip state to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`globetrotter_trip_${tripId}`, JSON.stringify(trip))
    }
  }, [trip, tripId])

  // Form states for adding a stop
  const [isAddingStop, setIsAddingStop] = useState(false)
  const [newCity, setNewCity] = useState("")
  const [newCountry, setNewCountry] = useState("")
  const [newStartDate, setNewStartDate] = useState("")
  const [newEndDate, setNewEndDate] = useState("")
  const [newNotes, setNewNotes] = useState("")

  // Form states for adding an activity
  const [activeStopForActivity, setActiveStopForActivity] = useState<string | null>(null)
  const [activityPickerStopCity, setActivityPickerStopCity] = useState<string | null>(null)
  const [newActName, setNewActName] = useState("")
  const [newActTime, setNewActTime] = useState("10:00")
  const [newActDuration, setNewActDuration] = useState("2 hrs")
  const [newActCost, setNewActCost] = useState("35")
  const [newActCategory, setNewActCategory] = useState<ActivityItem["category"]>("activities")

  // Sharing modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [copiedShare, setCopiedShare] = useState(false)

  // Derived stats
  const totalDays = useMemo(() => calculateTotalDays(trip.startDate, trip.endDate), [trip.startDate, trip.endDate])

  // Reorder stop handlers
  function moveStop(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= trip.stops.length) return

    const updatedStops = [...trip.stops]
    const [moved] = updatedStops.splice(index, 1)
    updatedStops.splice(targetIndex, 0, moved)

    setTrip((prev) => ({
      ...prev,
      stops: updatedStops,
    }))
    toast.success(`Moved ${moved.city} ${direction === "up" ? "up" : "down"}`)
  }

  // Delete stop handler
  async function deleteStop(stopId: string) {
    const stopToDelete = trip.stops.find((s) => s.id === stopId)
    if (!confirm(`Are you sure you want to remove ${stopToDelete?.city || "this destination"}?`)) {
      return
    }

    try {
      await fetch(`/api/stops/${stopId}`, { method: "DELETE" })
    } catch (e) {
      // fallback
    }

    setTrip((prev) => ({
      ...prev,
      stops: prev.stops.filter((s) => s.id !== stopId),
    }))
    toast.success("Destination removed from itinerary")
  }

  // Add stop submit handler
  async function handleAddStopSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newCity.trim()) {
      toast.error("Please specify a city name.")
      return
    }

    const newStopItem: StopItem = {
      id: `stop-${Date.now()}`,
      city: newCity.trim(),
      country: newCountry.trim() || "International",
      startDate: newStartDate || trip.startDate,
      endDate: newEndDate || trip.endDate,
      notes: newNotes.trim() || "Planned destination exploration.",
      estimatedCost: 350,
      activities: [],
    }

    try {
      await fetch("/api/stops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId: trip.id,
          city: newStopItem.city,
          country: newStopItem.country,
          startDate: newStopItem.startDate,
          endDate: newStopItem.endDate,
          notes: newStopItem.notes,
          estimatedCost: newStopItem.estimatedCost,
        }),
      })
    } catch (e) {
      // fallback
    }

    setTrip((prev) => ({
      ...prev,
      stops: [...prev.stops, newStopItem],
    }))

    setNewCity("")
    setNewCountry("")
    setNewStartDate("")
    setNewEndDate("")
    setNewNotes("")
    setIsAddingStop(false)
    toast.success(`${newStopItem.city} added to itinerary!`)
  }

  // Add activity submit handler
  async function handleAddActivitySubmit(stopId: string, e: React.FormEvent) {
    e.preventDefault()
    if (!newActName.trim()) {
      toast.error("Please enter an activity name.")
      return
    }

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      name: newActName.trim(),
      time: newActTime || "10:00",
      duration: newActDuration || "2 hrs",
      cost: Number(newActCost) || 0,
      category: newActCategory,
      location: trip.stops.find((s) => s.id === stopId)?.city,
    }

    try {
      await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stopId,
          name: newActivity.name,
          category: newActivity.category,
          timeText: newActivity.time,
          cost: newActivity.cost,
          location: newActivity.location,
        }),
      })
    } catch (e) {
      // fallback
    }

    setTrip((prev) => ({
      ...prev,
      stops: prev.stops.map((stop) => {
        if (stop.id === stopId) {
          return {
            ...stop,
            activities: [...stop.activities, newActivity],
            estimatedCost: stop.estimatedCost + newActivity.cost,
          }
        }
        return stop
      }),
    }))

    setNewActName("")
    setNewActTime("10:00")
    setNewActDuration("2 hrs")
    setNewActCost("35")
    setActiveStopForActivity(null)
    toast.success(`Added ${newActivity.name}`)
  }

  // Quick activity add from modal
  function handleModalActivitySelect(activityData: {
    name: string
    category: "transport" | "stay" | "activities" | "meals" | "other"
    duration: string
    cost: number
    location?: string
    notes?: string
  }) {
    if (!activityPickerStopCity) return
    const targetStop = trip.stops.find((s) => s.city === activityPickerStopCity)
    if (!targetStop) return

    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      name: activityData.name,
      time: "10:00",
      duration: activityData.duration,
      cost: activityData.cost,
      category: activityData.category,
      location: activityData.location,
      notes: activityData.notes,
    }

    setTrip((prev) => ({
      ...prev,
      stops: prev.stops.map((stop) => {
        if (stop.id === targetStop.id) {
          return {
            ...stop,
            activities: [...stop.activities, newActivity],
            estimatedCost: stop.estimatedCost + newActivity.cost,
          }
        }
        return stop
      }),
    }))
  }

  // Delete activity handler
  async function deleteActivity(stopId: string, activityId: string) {
    try {
      await fetch(`/api/activities/${activityId}`, { method: "DELETE" })
    } catch (e) {
      // fallback
    }

    setTrip((prev) => ({
      ...prev,
      stops: prev.stops.map((stop) => {
        if (stop.id === stopId) {
          return {
            ...stop,
            activities: stop.activities.filter((a) => a.id !== activityId),
          }
        }
        return stop
      }),
    }))
    toast.success("Activity removed")
  }

  // Copy share URL
  function handleCopyShare() {
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/share/${trip.shareToken || trip.id}`
      navigator.clipboard.writeText(shareUrl)
      setCopiedShare(true)
      toast.success("Public itinerary link copied to clipboard!")
      setTimeout(() => setCopiedShare(false), 2500)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-950 font-sans antialiased selection:bg-zinc-950 selection:text-white pb-24">
      {/* Top Header & Navigation Switcher */}
      <div className="border-b border-zinc-200 bg-white sticky top-16 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-zinc-500 uppercase">
            <Link href="/trips" className="hover:text-zinc-950 transition-colors">
              My Trips
            </Link>
            <span>/</span>
            <span className="text-zinc-950 font-semibold truncate max-w-[200px] sm:max-w-xs">
              {trip.name}
            </span>
          </div>

          {/* Tab Navigation: Builder | View | Budget | Calendar */}
          <div className="flex items-center gap-3 self-start sm:self-auto overflow-x-auto no-scrollbar">
            <div className="inline-flex p-1 bg-zinc-100 rounded-xl border border-zinc-200 text-xs font-mono">
              <button
                type="button"
                onClick={() => setActiveTab("builder")}
                className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  activeTab === "builder"
                    ? "bg-zinc-950 text-white font-semibold shadow-2xs"
                    : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Builder</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("view")}
                className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  activeTab === "view"
                    ? "bg-zinc-950 text-white font-semibold shadow-2xs"
                    : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("budget")}
                className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  activeTab === "budget"
                    ? "bg-zinc-950 text-white font-semibold shadow-2xs"
                    : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                <Wallet className="w-3.5 h-3.5" />
                <span>Budget</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("calendar")}
                className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  activeTab === "calendar"
                    ? "bg-zinc-950 text-white font-semibold shadow-2xs"
                    : "text-zinc-600 hover:text-zinc-950"
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Calendar</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-mono uppercase tracking-wider font-semibold shadow-2xs transition-all flex items-center gap-1.5 shrink-0"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* ========================================================================= */}
        {/* TAB 1: SCREEN 4 — ITINERARY BUILDER                                       */}
        {/* ========================================================================= */}
        {activeTab === "builder" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Header & Add Stop Action */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-zinc-200">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 inline-block" />
                  <span>Expedition Architecture</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
                  Itinerary Builder
                </h1>
                <p className="text-sm text-zinc-600 font-light">
                  Add destination stops, schedule curated activities, and reorder multi-city routes.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddingStop(true)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-950 text-white font-mono text-xs uppercase tracking-wider font-semibold shadow-xs hover:bg-zinc-800 active:scale-98 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Stop</span>
                </button>
              </div>
            </div>

            {/* Trip Progress Card */}
            <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-7 shadow-xs relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">
                    <Calendar className="w-3.5 h-3.5 text-zinc-700" />
                    <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
                    {trip.name}
                  </h2>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 font-mono text-xs font-semibold">
                    <span>{trip.stops.length} Stops</span>
                    <span>•</span>
                    <span>{totalDays} Days</span>
                    <span>•</span>
                    <span>Budget: ${trip.budget.toLocaleString("en-US")}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t md:border-t-0 md:border-l border-zinc-100 pt-4 md:pt-0 md:pl-6 text-left font-mono">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">Stops</span>
                    <span className="text-xl font-bold text-zinc-950">{trip.stops.length}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">Duration</span>
                    <span className="text-xl font-bold text-zinc-950">{totalDays}d</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">Target Budget</span>
                    <span className="text-xl font-bold text-zinc-950">${trip.budget}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Stop Inline Form */}
            {isAddingStop && (
              <form
                onSubmit={handleAddStopSubmit}
                className="rounded-3xl border-2 border-dashed border-zinc-300 bg-zinc-50/80 p-6 sm:p-7 space-y-5 animate-in fade-in duration-200"
              >
                <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
                  <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest font-bold text-zinc-950">
                    <Plus className="w-4 h-4" />
                    <span>Add New Destination Stop</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddingStop(false)}
                    className="text-xs font-mono uppercase text-zinc-500 hover:text-zinc-950"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-600 block">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kyoto, Barcelona, Rome"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-zinc-300 bg-white text-xs text-zinc-950 focus:outline-hidden focus:ring-2 focus:ring-zinc-950 font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-600 block">
                      Country
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Japan, Spain, Italy"
                      value={newCountry}
                      onChange={(e) => setNewCountry(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-zinc-300 bg-white text-xs text-zinc-950 focus:outline-hidden focus:ring-2 focus:ring-zinc-950 font-sans"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-600 block">
                      Arrival Date
                    </label>
                    <input
                      type="date"
                      value={newStartDate}
                      onChange={(e) => setNewStartDate(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-zinc-300 bg-white text-xs font-mono text-zinc-950 focus:outline-hidden focus:ring-2 focus:ring-zinc-950"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-600 block">
                      Departure Date
                    </label>
                    <input
                      type="date"
                      value={newEndDate}
                      onChange={(e) => setNewEndDate(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-zinc-300 bg-white text-xs font-mono text-zinc-950 focus:outline-hidden focus:ring-2 focus:ring-zinc-950"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-zinc-600 block">
                    Notes & Highlights
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Key highlights, neighborhoods to explore, or accommodations..."
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    className="w-full p-3 rounded-xl border border-zinc-300 bg-white text-xs text-zinc-950 focus:outline-hidden focus:ring-2 focus:ring-zinc-950 font-sans"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingStop(false)}
                    className="px-4 py-2 rounded-xl text-xs font-mono uppercase text-zinc-600 hover:bg-zinc-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-zinc-950 text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-xs hover:bg-zinc-800 transition-all"
                  >
                    Add Stop
                  </button>
                </div>
              </form>
            )}

            {/* Vertical Timeline of Stop Cards */}
            {trip.stops.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-zinc-100 flex items-center justify-center text-zinc-400">
                  <Route className="w-7 h-7 text-zinc-600" />
                </div>
                <div className="space-y-1 max-w-sm mx-auto">
                  <h3 className="text-base font-bold text-zinc-950">No itinerary stops yet</h3>
                  <p className="text-xs text-zinc-500 font-light">
                    Add destinations and activities to build your journey.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingStop(true)}
                  className="px-5 py-2.5 rounded-xl bg-zinc-950 text-white font-mono text-xs uppercase tracking-wider font-semibold shadow-xs hover:bg-zinc-800 transition-all inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Destination Stop</span>
                </button>
              </div>
            ) : (
              <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-[2px] before:bg-zinc-200">
                {trip.stops.map((stop, index) => {
                  const stopNumber = String(index + 1).padStart(2, "0")
                  const isFirst = index === 0
                  const isLast = index === trip.stops.length - 1

                  return (
                    <div key={stop.id} className="relative group">
                      {/* Numbered Indicator Node */}
                      <div className="absolute -left-6 sm:-left-10 top-5 -translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-zinc-950 text-white font-mono text-xs font-bold flex items-center justify-center shadow-md ring-4 ring-white z-10 select-none">
                        {stopNumber}
                      </div>

                      {/* Stop Card */}
                      <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-7 shadow-xs hover:border-zinc-300 transition-all space-y-6">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-zinc-100">
                          <div className="space-y-1">
                            <span className="text-[11px] font-mono tracking-[0.2em] uppercase font-bold text-zinc-400">
                              STOP {stopNumber}
                            </span>
                            <h3 className="text-2xl font-bold text-zinc-950 tracking-tight">
                              {stop.city}, <span className="font-normal text-zinc-600">{stop.country}</span>
                            </h3>
                            <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                              <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                              <span>{formatDateRange(stop.startDate, stop.endDate)}</span>
                            </div>
                          </div>

                          {/* Reorder Buttons & Actions */}
                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={() => moveStop(index, "up")}
                              disabled={isFirst}
                              aria-label="Move Up"
                              className={`p-2 rounded-xl border text-xs font-mono flex items-center gap-1 transition-all ${
                                isFirst
                                  ? "border-zinc-100 text-zinc-300 cursor-not-allowed"
                                  : "border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
                              }`}
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Up</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => moveStop(index, "down")}
                              disabled={isLast}
                              aria-label="Move Down"
                              className={`p-2 rounded-xl border text-xs font-mono flex items-center gap-1 transition-all ${
                                isLast
                                  ? "border-zinc-100 text-zinc-300 cursor-not-allowed"
                                  : "border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
                              }`}
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Down</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteStop(stop.id)}
                              aria-label="Delete Stop"
                              className="p-2 rounded-xl border border-transparent text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Notes */}
                        {stop.notes && (
                          <div className="text-xs text-zinc-600 bg-zinc-50 border border-zinc-100 rounded-xl p-3.5 leading-relaxed font-sans">
                            <span className="font-mono uppercase tracking-wider text-[10px] text-zinc-400 block mb-0.5">
                              Destination Highlights
                            </span>
                            {stop.notes}
                          </div>
                        )}

                        {/* Activities Section */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5">
                              <span>Activities & Schedule</span>
                              <span className="text-zinc-900 font-bold">({stop.activities.length})</span>
                            </h4>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setActivityPickerStopCity(stop.city)}
                                className="text-xs font-mono font-semibold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                              >
                                <Search className="w-3 h-3" />
                                <span>Browse Sights</span>
                              </button>
                            </div>
                          </div>

                          {/* Activities list */}
                          {stop.activities.length === 0 ? (
                            <div className="p-4 rounded-xl border border-dashed border-zinc-200 text-center text-xs text-zinc-400 font-mono">
                              No activities scheduled for {stop.city} yet. Click below to add one.
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {stop.activities.map((act) => (
                                <div
                                  key={act.id}
                                  className="group/act rounded-xl border border-zinc-200/80 bg-zinc-50/50 hover:bg-zinc-50 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                                >
                                  <div className="flex items-start sm:items-center gap-3">
                                    <div className="font-mono text-xs font-bold text-zinc-950 bg-white border border-zinc-200 px-2.5 py-1 rounded-md shadow-2xs shrink-0">
                                      {act.time}
                                    </div>
                                    <div className="space-y-0.5">
                                      <p className="text-sm font-semibold text-zinc-950">{act.name}</p>
                                      <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                                        <Clock className="w-3 h-3 text-zinc-400" />
                                        <span>{act.duration}</span>
                                        {act.location && (
                                          <>
                                            <span>•</span>
                                            <span className="truncate max-w-[200px]">{act.location}</span>
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 self-end sm:self-auto border-t sm:border-t-0 border-zinc-100 pt-2 sm:pt-0 w-full sm:w-auto">
                                    <span className="font-mono text-xs font-bold text-zinc-950">
                                      ${act.cost.toLocaleString("en-US")}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => deleteActivity(stop.id, act.id)}
                                      className="p-1 rounded text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                      aria-label="Remove activity"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Inline Add Activity Form */}
                          {activeStopForActivity === stop.id ? (
                            <form
                              onSubmit={(e) => handleAddActivitySubmit(stop.id, e)}
                              className="rounded-2xl border border-zinc-300 bg-white p-4 space-y-3 shadow-xs animate-in fade-in duration-150 mt-2"
                            >
                              <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                                <span className="text-xs font-mono uppercase tracking-wider font-bold text-zinc-900">
                                  Add Activity to {stop.city}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setActiveStopForActivity(null)}
                                  className="text-xs font-mono uppercase text-zinc-400 hover:text-zinc-950"
                                >
                                  Cancel
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1 sm:col-span-2">
                                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-600 block">
                                    Activity Name *
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. Louvre Classical Tour, Sunset Pasta Class"
                                    value={newActName}
                                    onChange={(e) => setNewActName(e.target.value)}
                                    className="w-full h-9 px-3 rounded-lg border border-zinc-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-zinc-950"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-600 block">
                                    Time
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="09:30"
                                    value={newActTime}
                                    onChange={(e) => setNewActTime(e.target.value)}
                                    className="w-full h-9 px-3 rounded-lg border border-zinc-300 text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-zinc-950"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-600 block">
                                    Duration
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="2 hrs"
                                    value={newActDuration}
                                    onChange={(e) => setNewActDuration(e.target.value)}
                                    className="w-full h-9 px-3 rounded-lg border border-zinc-300 text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-zinc-950"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-600 block">
                                    Cost (USD $)
                                  </label>
                                  <input
                                    type="number"
                                    placeholder="35"
                                    value={newActCost}
                                    onChange={(e) => setNewActCost(e.target.value)}
                                    className="w-full h-9 px-3 rounded-lg border border-zinc-300 text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-zinc-950"
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-600 block">
                                    Category
                                  </label>
                                  <select
                                    value={newActCategory}
                                    onChange={(e) => setNewActCategory(e.target.value as any)}
                                    className="w-full h-9 px-3 rounded-lg border border-zinc-300 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-zinc-950"
                                  >
                                    <option value="activities">Activities & Sights</option>
                                    <option value="meals">Meals & Dining</option>
                                    <option value="transport">Transport</option>
                                    <option value="stay">Stay & Hotel</option>
                                    <option value="other">Other</option>
                                  </select>
                                </div>
                              </div>

                              <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                  type="button"
                                  onClick={() => setActiveStopForActivity(null)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-600 hover:bg-zinc-100"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="px-4 py-1.5 rounded-lg bg-zinc-950 text-white text-xs font-mono uppercase tracking-wider font-semibold hover:bg-zinc-800"
                                >
                                  Add Activity
                                </button>
                              </div>
                            </form>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setActiveStopForActivity(stop.id)}
                              className="w-full py-2.5 rounded-xl border border-dashed border-zinc-300 text-zinc-600 hover:text-zinc-950 hover:border-zinc-400 hover:bg-zinc-50 text-xs font-mono uppercase tracking-wider font-medium flex items-center justify-center gap-2 transition-all mt-2"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>+ Add Custom Activity</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: SCREEN 5 — ITINERARY VIEW (TIMELINE & LIST MODES)                  */}
        {/* ========================================================================= */}
        {activeTab === "view" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* View Mode Toggle: Timeline vs List */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 inline-block" />
                  <span>Curated Presentation</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
                  Your Journey Overview
                </h2>
              </div>

              <div className="inline-flex p-1 bg-zinc-100 rounded-xl border border-zinc-200 self-start sm:self-auto text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setViewMode("timeline")}
                  className={`px-4 py-1.5 rounded-lg uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    viewMode === "timeline"
                      ? "bg-zinc-950 text-white font-bold shadow-2xs"
                      : "text-zinc-600 hover:text-zinc-950"
                  }`}
                >
                  <Route className="w-3.5 h-3.5" />
                  <span>Timeline View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`px-4 py-1.5 rounded-lg uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    viewMode === "list"
                      ? "bg-zinc-950 text-white font-bold shadow-2xs"
                      : "text-zinc-600 hover:text-zinc-950"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>List View</span>
                </button>
              </div>
            </div>

            {/* TIMELINE VIEW */}
            {viewMode === "timeline" ? (
              <div className="space-y-8">
                {trip.stops.map((stop, stopIndex) => (
                  <div key={stop.id} className="space-y-4">
                    {/* Destination City Banner */}
                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-7 h-7 rounded-lg bg-zinc-950 text-white font-mono text-xs font-bold flex items-center justify-center">
                        {stopIndex + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-zinc-950 tracking-tight">
                          {stop.city}, {stop.country}
                        </h3>
                        <span className="text-xs font-mono text-zinc-500">
                          {formatDateRange(stop.startDate, stop.endDate)}
                        </span>
                      </div>
                    </div>

                    {/* Timeline items */}
                    <div className="relative pl-6 space-y-3 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1.5px] before:bg-zinc-200">
                      {stop.activities.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-zinc-200 bg-white p-4 text-xs font-mono text-zinc-400">
                          Free exploration day in {stop.city}. No rigid activities scheduled.
                        </div>
                      ) : (
                        stop.activities.map((act) => (
                          <div
                            key={act.id}
                            className="relative group rounded-2xl border border-zinc-200/90 bg-white p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all space-y-2"
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

                            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 font-mono pt-1 border-t border-zinc-100">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-zinc-400" />
                                <span>{act.duration}</span>
                              </div>
                              {act.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                                  <span>{act.location}</span>
                                </div>
                              )}
                              <span className="uppercase text-[10px] bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">
                                {act.category}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="space-y-6">
                {trip.stops.map((stop, stopIndex) => (
                  <div
                    key={stop.id}
                    className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-7 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100">
                      <div>
                        <span className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold text-zinc-400">
                          DESTINATION {String(stopIndex + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-2xl font-bold text-zinc-950 tracking-tight">
                          {stop.city}, {stop.country}
                        </h3>
                      </div>
                      <div className="text-xs font-mono text-zinc-500 sm:text-right">
                        <span>{formatDateRange(stop.startDate, stop.endDate)}</span>
                        <span className="block text-zinc-900 font-bold">
                          Est. City Cost: ${stop.estimatedCost.toLocaleString("en-US")}
                        </span>
                      </div>
                    </div>

                    {stop.notes && (
                      <p className="text-xs text-zinc-600 italic leading-relaxed">{stop.notes}</p>
                    )}

                    <div className="space-y-2 pt-2">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                        Planned Highlights
                      </h4>
                      {stop.activities.length === 0 ? (
                        <p className="text-xs text-zinc-400 italic">No scheduled items listed.</p>
                      ) : (
                        <ul className="divide-y divide-zinc-100">
                          {stop.activities.map((act) => (
                            <li
                              key={act.id}
                              className="py-2.5 flex items-center justify-between text-xs sm:text-sm"
                            >
                              <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
                                <span className="font-mono text-xs font-bold text-zinc-700">
                                  {act.time}
                                </span>
                                <span className="font-medium text-zinc-950">{act.name}</span>
                              </div>
                              <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
                                <span>{act.duration}</span>
                                <span className="font-bold text-zinc-950">
                                  ${act.cost.toLocaleString("en-US")}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: SCREEN 8 — BUDGET PLANNER & EXPENSE TELEMETRY                      */}
        {/* ========================================================================= */}
        {activeTab === "budget" && (
          <BudgetDashboard
            tripId={trip.id}
            targetBudget={trip.budget}
            totalDays={totalDays}
            expenses={trip.expenses}
            onAddExpense={(newExp) => {
              setTrip((prev) => ({
                ...prev,
                expenses: [newExp, ...prev.expenses],
              }))
            }}
            onDeleteExpense={(expId) => {
              setTrip((prev) => ({
                ...prev,
                expenses: prev.expenses.filter((e) => e.id !== expId),
              }))
            }}
          />
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SCREEN 9 — CALENDAR & DAILY TIMELINE                               */}
        {/* ========================================================================= */}
        {activeTab === "calendar" && (
          <CalendarTimelineView
            tripName={trip.name}
            startDate={trip.startDate}
            endDate={trip.endDate}
            stops={trip.stops}
          />
        )}
      </main>

      {/* Activity Catalog Modal (Screen 7 Quick Add) */}
      {activityPickerStopCity && (
        <ActivityPickerModal
          cityName={activityPickerStopCity}
          onSelectActivity={handleModalActivitySelect}
          onClose={() => setActivityPickerStopCity(null)}
        />
      )}

      {/* Public Share Modal (Screen 10 Trigger) */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 shadow-2xl border border-zinc-200">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-400">
                  Public Sharing
                </span>
                <h3 className="text-lg font-bold text-zinc-950">Share Itinerary</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-950 font-mono text-xs uppercase"
              >
                Close
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-zinc-600 leading-relaxed">
                Anyone with this link can view this itinerary in luxury read-only mode, inspect destination stops, and copy it to their own account.
              </p>

              <div className="flex items-center gap-2 p-2 rounded-xl border border-zinc-200 bg-zinc-50 font-mono text-xs text-zinc-700 select-all overflow-x-auto">
                <span className="truncate">
                  {typeof window !== "undefined" ? `${window.location.origin}/share/${trip.shareToken || trip.id}` : `/share/${trip.id}`}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono uppercase text-zinc-600 hover:bg-zinc-100"
              >
                Done
              </button>
              <button
                type="button"
                onClick={handleCopyShare}
                className="px-5 py-2 rounded-xl bg-zinc-950 text-white text-xs font-mono uppercase tracking-wider font-semibold hover:bg-zinc-800 transition-all flex items-center gap-2"
              >
                {copiedShare ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedShare ? "Copied!" : "Copy Link"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
