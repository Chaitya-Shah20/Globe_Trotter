import { Metadata } from "next"
import { Suspense } from "react"
import { TripForm } from "@/components/trips/trip-form"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Create Trip | GlobeTrotter",
  description: "Plan and customize a new multi-city expedition itinerary",
}

export default function NewTripPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-950 font-sans antialiased pb-24">
      {/* Top Header & Breadcrumb */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
          <Link
            href="/trips"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-zinc-500 hover:text-zinc-950 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to My Trips</span>
          </Link>
          <span className="text-xs font-mono uppercase text-zinc-400">Step 1 of 2</span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 space-y-8">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 inline-block" />
            <span>Expedition Conception</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
            Plan a New Journey
          </h1>
          <p className="text-sm text-zinc-600 font-light">
            Define your destination themes, expedition dates, and financial parameters.
          </p>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 shadow-xs">
          <Suspense fallback={<div className="text-xs font-mono text-center text-zinc-400 py-12">Loading trip creator...</div>}>
            <TripForm />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
