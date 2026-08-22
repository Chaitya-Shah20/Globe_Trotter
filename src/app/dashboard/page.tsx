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

  // Fetch recommended destinations (mocked via db or hardcoded if empty)
  const popularCities = await prisma.city.findMany({
    orderBy: {
      costIndex: "desc", // Just arbitrary ordering for recommendations
    },
    take: 4,
  })

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {session.user.name?.split(" ")[0]}!</h1>
          <p className="text-muted-foreground">Here is an overview of your upcoming adventures.</p>
        </div>
      </div>
      
      <DashboardContent upcomingTrips={upcomingTrips} popularCities={popularCities} />
    </div>
  )
}
