import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import {
  Users,
  Plane,
  Activity as ActivityIcon,
  Shield,
  TrendingUp,
  MapPin,
  BarChart3,
} from "lucide-react"
import { UserManagementTable } from "@/components/admin/user-management-table"

export const metadata: Metadata = {
  title: "Admin Analytics | GlobeTrotter",
  description: "Platform analytics, telemetry data, and user management",
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)

  // 1. Strict Role-based access control
  if (!session || !session.user || session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  // Allow access for ADMIN role
  let totalUsers = 0
  let totalTrips = 0
  let totalStops = 0
  let totalActivities = 0
  let popularCities: any[] = []
  let popularActivities: any[] = []
  let users: any[] = []

  try {
    const [uCount, tCount, sCount, aCount] = await Promise.all([
      prisma.user.count(),
      prisma.trip.count(),
      prisma.tripStop.count(),
      prisma.itineraryActivity.count(),
    ])

    totalUsers = uCount
    totalTrips = tCount
    totalStops = sCount
    totalActivities = aCount

    // 2. Popular Cities Aggregation (Calculated from REAL trip data, not a static score)
    const popularCitiesData = await prisma.tripStop.groupBy({
      by: ["cityId"],
      _count: { cityId: true },
      orderBy: { _count: { cityId: "desc" } },
      take: 5,
      where: { cityId: { not: null } },
    })

    popularCities = await Promise.all(
      popularCitiesData.map(async (data) => {
        const city = await prisma.city.findUnique({
          where: { id: data.cityId as string },
          select: { name: true, country: true },
        })
        return {
          name: city?.name || "Unknown City",
          country: city?.country || "Unknown Country",
          count: data._count.cityId,
        }
      })
    )

    // 3. Popular Activities Aggregation (Calculated from REAL trip data)
    const popularActivitiesData = await prisma.itineraryActivity.groupBy({
      by: ["activityId"],
      _count: { activityId: true },
      orderBy: { _count: { activityId: "desc" } },
      take: 5,
      where: { activityId: { not: null } },
    })

    popularActivities = await Promise.all(
      popularActivitiesData.map(async (data) => {
        const activity = await prisma.activity.findUnique({
          where: { id: data.activityId as string },
          select: { name: true, category: true },
        })
        return {
          name: activity?.name || "Unknown Activity",
          category: activity?.category || "activities",
          count: data._count.activityId,
        }
      })
    )

    // 4. User Management Data
    users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    })
  } catch (e) {
    // fallback
    console.error("[ADMIN_ERROR]", e)
  }

  const avgTripsPerUser = totalUsers > 0 ? (totalTrips / totalUsers).toFixed(1) : "0"

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-950 font-sans antialiased pb-24">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-white pt-24 pb-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
              <Shield className="w-3.5 h-3.5 text-zinc-950" />
              <span>Restricted Access</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
              Admin & Analytics
            </h1>
            <p className="text-sm text-zinc-600 font-light font-mono mt-1">
              Platform analytics, telemetry data, and user management.
            </p>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-700 bg-zinc-100 px-4 py-2 rounded-xl border border-zinc-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>Admin: {session.user.name}</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          <div className="p-6 rounded-3xl border border-zinc-200 bg-white shadow-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] uppercase tracking-wider">Total Users</span>
              <Users className="w-4 h-4 text-zinc-700" />
            </div>
            <div className="text-3xl font-bold text-zinc-950">{totalUsers.toLocaleString()}</div>
            <p className="text-[11px] text-emerald-600 font-sans bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
              {users.length > 0 ? "Active Database" : "No users"}
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-zinc-200 bg-white shadow-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] uppercase tracking-wider">Trips Created</span>
              <Plane className="w-4 h-4 text-zinc-700" />
            </div>
            <div className="text-3xl font-bold text-zinc-950">{totalTrips.toLocaleString()}</div>
            <p className="text-[11px] text-emerald-600 font-sans bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
              {avgTripsPerUser} avg per user
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-zinc-200 bg-white shadow-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] uppercase tracking-wider">Total Stops</span>
              <MapPin className="w-4 h-4 text-zinc-700" />
            </div>
            <div className="text-3xl font-bold text-zinc-950">{totalStops.toLocaleString()}</div>
            <p className="text-[11px] text-zinc-500 font-sans mt-1">
              Destinations added
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-zinc-200 bg-white shadow-xs space-y-2">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[11px] uppercase tracking-wider">Activities Booked</span>
              <ActivityIcon className="w-4 h-4 text-zinc-700" />
            </div>
            <div className="text-3xl font-bold text-zinc-950">{totalActivities.toLocaleString()}</div>
            <p className="text-[11px] text-zinc-500 font-sans mt-1">
              Planned experiences
            </p>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Popular Destinations */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-zinc-100 rounded-xl">
                <BarChart3 className="w-5 h-5 text-zinc-950" />
              </div>
              <h2 className="text-lg font-bold tracking-tight">Top Destinations</h2>
            </div>
            {popularCities.length === 0 ? (
              <p className="text-sm text-zinc-500 font-mono">No itinerary data available yet.</p>
            ) : (
              <div className="space-y-4">
                {popularCities.map((city, i) => (
                  <div key={i} className="flex items-center justify-between group p-3 hover:bg-zinc-50 rounded-2xl transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono font-bold text-zinc-400 w-4">{i + 1}</span>
                      <div>
                        <div className="text-sm font-bold text-zinc-950">{city.name}</div>
                        <div className="text-xs text-zinc-500">{city.country}</div>
                      </div>
                    </div>
                    <div className="text-xs font-mono font-semibold bg-zinc-100 px-2.5 py-1 rounded-md text-zinc-600">
                      {city.count} {city.count === 1 ? 'visit' : 'visits'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Popular Activities */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-zinc-100 rounded-xl">
                <TrendingUp className="w-5 h-5 text-zinc-950" />
              </div>
              <h2 className="text-lg font-bold tracking-tight">Most Planned Activities</h2>
            </div>
            {popularActivities.length === 0 ? (
              <p className="text-sm text-zinc-500 font-mono">No activity data available yet.</p>
            ) : (
              <div className="space-y-4">
                {popularActivities.map((act, i) => (
                  <div key={i} className="flex items-center justify-between group p-3 hover:bg-zinc-50 rounded-2xl transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono font-bold text-zinc-400 w-4">{i + 1}</span>
                      <div>
                        <div className="text-sm font-bold text-zinc-950 truncate max-w-[200px] sm:max-w-[240px]">{act.name}</div>
                        <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{act.category}</div>
                      </div>
                    </div>
                    <div className="text-xs font-mono font-semibold bg-zinc-100 px-2.5 py-1 rounded-md text-zinc-600">
                      {act.count} times
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* User Management Section */}
        <div className="space-y-6 pt-6 border-t border-zinc-200">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-950">User Management</h2>
            <p className="text-sm text-zinc-500 font-mono">Manage accounts, promote administrators, and delete users.</p>
          </div>
          <UserManagementTable initialUsers={users} currentUserId={session.user.id} />
        </div>
      </main>
    </div>
  )
}
