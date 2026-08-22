import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Settings,
  MapPin,
  Plane,
  Heart,
  Calendar,
  Globe,
  Wallet,
  Shield,
  ArrowRight,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Profile | GlobeTrotter",
  description: "Your personalized travel profile, preferences, and saved destinations",
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login")
  }

  let user = null
  try {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        preferences: true,
        _count: {
          select: { trips: true, savedDestinations: true },
        },
        savedDestinations: {
          include: { city: true },
          take: 6,
        },
        trips: {
          orderBy: { startDate: "desc" },
          take: 3,
          include: {
            stops: { include: { city: true } },
          },
        },
      },
    })
  } catch (e) {
    // fallback
  }

  if (!user) {
    user = {
      id: session.user.id,
      name: session.user.name || "Explorer",
      email: session.user.email || "demo@globetrotter.app",
      image: session.user.image,
      role: session.user.role || "USER",
      preferences: { language: "en", currency: "USD" },
      _count: { trips: 1, savedDestinations: 3 },
      savedDestinations: [],
      trips: [],
    }
  }

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "GT"

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-950 font-sans antialiased pb-24">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-2 border-zinc-200 shadow-xs">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback className="text-lg font-mono font-bold bg-zinc-950 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-950">{user.name}</h1>
                {user.role === "ADMIN" && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-zinc-950 text-white uppercase">
                    Admin
                  </span>
                )}
              </div>
              <p className="text-xs font-mono text-zinc-500">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/profile/settings">
              <button
                type="button"
                className="px-4 py-2 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-mono uppercase tracking-wider font-semibold shadow-2xs transition-all flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5 text-zinc-600" />
                <span>Account Settings</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Telemetry Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
          <div className="p-5 rounded-2xl border border-zinc-200 bg-white shadow-xs space-y-1">
            <span className="text-[10px] uppercase text-zinc-400 block tracking-wider">Journeys Planned</span>
            <span className="text-2xl font-bold text-zinc-950">{user._count?.trips || 0}</span>
            <span className="text-[10px] text-zinc-500 block">multi-city routes</span>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-200 bg-white shadow-xs space-y-1">
            <span className="text-[10px] uppercase text-zinc-400 block tracking-wider">Saved Places</span>
            <span className="text-2xl font-bold text-zinc-950">{user._count?.savedDestinations || 0}</span>
            <span className="text-[10px] text-zinc-500 block">bookmarked cities</span>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-200 bg-white shadow-xs space-y-1">
            <span className="text-[10px] uppercase text-zinc-400 block tracking-wider">Default Currency</span>
            <span className="text-2xl font-bold text-zinc-950">{user.preferences?.currency || "USD"}</span>
            <span className="text-[10px] text-zinc-500 block">telemetry standard</span>
          </div>

          <div className="p-5 rounded-2xl border border-zinc-200 bg-white shadow-xs space-y-1">
            <span className="text-[10px] uppercase text-zinc-400 block tracking-wider">Language</span>
            <span className="text-2xl font-bold text-zinc-950">{user.preferences?.language?.toUpperCase() || "EN"}</span>
            <span className="text-[10px] text-zinc-500 block">interface locale</span>
          </div>
        </div>

        {/* Saved Destinations Gallery */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
            <div>
              <h2 className="text-xl font-bold text-zinc-950 tracking-tight">Saved Destinations</h2>
              <p className="text-xs text-zinc-500 font-mono">Cities bookmarked for future expeditions</p>
            </div>
            <Link href="/discover" className="text-xs font-mono uppercase tracking-wider text-zinc-600 hover:text-zinc-950">
              Discover More
            </Link>
          </div>

          {user.savedDestinations?.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center space-y-3">
              <Heart className="w-8 h-8 text-zinc-400 mx-auto opacity-50" />
              <p className="text-xs font-mono text-zinc-500">No bookmarked destinations yet.</p>
              <Link href="/discover">
                <button type="button" className="px-4 py-2 rounded-xl bg-zinc-950 text-white font-mono text-xs uppercase font-semibold">
                  Browse Cities
                </button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {user.savedDestinations?.map((saved: any) => (
                <div
                  key={saved.id}
                  className="group rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-xs hover:border-zinc-300 transition-all flex flex-col"
                >
                  <div className="h-36 w-full overflow-hidden bg-zinc-100 relative">
                    <img
                      src={saved.city?.imageUrl || "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80"}
                      alt={saved.city?.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2.5 right-2.5 p-1 rounded-full bg-white/90 shadow-xs text-zinc-950">
                      <Heart className="w-3.5 h-3.5 fill-zinc-950" />
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-zinc-950">{saved.city?.name}</h4>
                      <p className="text-xs font-mono text-zinc-500">{saved.city?.country}</p>
                    </div>
                    <Link href={`/trips/new?city=${encodeURIComponent(saved.city?.name || "")}`}>
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-lg bg-zinc-950 text-white font-mono text-[11px] uppercase font-semibold"
                      >
                        Plan
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
