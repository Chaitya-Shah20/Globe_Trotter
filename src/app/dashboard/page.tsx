import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export const metadata: Metadata = {
  title: "Dashboard | GlobeTrotter",
  description: "Overview of your trips and budget",
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login")
  }

  // Fetch user's trips
  const upcomingTrips = await prisma.trip.findMany({
    where: {
      ownerId: session.user.id,
      startDate: {
        gte: new Date(),
      },
    },
    orderBy: {
      startDate: "asc",
    },
    take: 3,
    include: {
      stops: {
        include: {
          city: true,
        },
      },
    },
  })

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
