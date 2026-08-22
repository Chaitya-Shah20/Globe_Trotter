import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import Link from "next/link"
import { Plus, Calendar, MapPin, ArrowRight, Wallet, Compass, Plane, Route, Star } from "lucide-react"

export const metadata: Metadata = {
  title: "Dashboard | GlobeTrotter",
  description: "Overview of your upcoming trips and travel metrics",
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login")
  }

  let userTrips: any[] = []
  let popularCities: any[] = []

  try {
    userTrips = await prisma.trip.findMany({
      where: { ownerId: session.user.id },
      orderBy: { startDate: "asc" },
      include: {
        stops: {
          orderBy: { order: "asc" },
          include: { city: true },
        },
        expenses: true,
      },
    })

    popularCities = await prisma.city.findMany({
      orderBy: { popularityScore: "desc" },
      take: 4,
    })
  } catch (e) {
    // Database fallback
  }

  const upcomingTrips = userTrips.filter((t) => new Date(t.endDate) >= new Date())
  const pastTrips = userTrips.filter((t) => new Date(t.endDate) < new Date())

  // Fetch recommended destinations
  const popularCities = await prisma.city.findMany({
    orderBy: {
      costIndex: "desc",
    },
    take: 4,
  })

  return (
    <DashboardContent 
      upcomingTrips={upcomingTrips} 
      popularCities={popularCities} 
      userName={session.user.name || "Traveler"} 
    />
  )
}
