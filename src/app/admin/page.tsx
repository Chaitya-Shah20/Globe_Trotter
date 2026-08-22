import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { notFound, redirect } from "next/navigation"
import prisma from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Plane, Globe, Activity } from "lucide-react"

export const metadata: Metadata = {
  title: "Admin Dashboard | GlobeTrotter",
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login")
  }

  if (session.user.role !== "ADMIN") {
    notFound()
  }

  const [totalUsers, totalTrips, totalDestinations] = await Promise.all([
    prisma.user.count(),
    prisma.trip.count(),
    prisma.city.count(),
  ])

  // Get active users (users with trips)
  const activeUsersData = await prisma.user.count({
    where: {
      trips: {
        some: {}
      }
    }
  })

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Overview</h1>
        <p className="text-muted-foreground">Platform analytics and metrics foundation.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered platform users
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Trips Planned
            </CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTrips}</div>
            <p className="text-xs text-muted-foreground">
              Total itineraries created
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Planners
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsersData}</div>
            <p className="text-xs text-muted-foreground">
              Users with at least one trip
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Destinations DB
            </CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDestinations}</div>
            <p className="text-xs text-muted-foreground">
              Supported cities in database
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>
              New registrations on the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Logic to list recent users would go here */}
            <div className="text-sm text-muted-foreground py-4 text-center">
              User table would be rendered here
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>
              API Status and Integrations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Database (PostgreSQL)</span>
              <span className="px-2 py-1 rounded bg-green-500/10 text-green-500 font-medium">Connected</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Mapbox API</span>
              <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 font-medium">Mock Mode</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Gemini AI</span>
              <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 font-medium">Mock Mode</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Supabase Storage</span>
              <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 font-medium">Mock Mode</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
