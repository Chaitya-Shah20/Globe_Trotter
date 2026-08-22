import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import Link from "next/link"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, MapPin, CalendarDays, Map, MoreVertical } from "lucide-react"

export const metadata: Metadata = {
  title: "My Trips | GlobeTrotter",
}

export default async function TripsPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login")
  }

  const trips = await prisma.trip.findMany({
    where: {
      ownerId: session.user.id,
    },
    orderBy: {
      startDate: "asc",
    },
    include: {
      stops: {
        include: {
          city: true,
        },
      },
    },
  })

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Trips</h1>
          <p className="text-muted-foreground">Manage your past, present, and future adventures.</p>
        </div>
        <Link href="/trips/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Plan New Trip
          </Button>
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border rounded-lg bg-muted/20 border-dashed">
          <Map className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">No trips yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            You haven't planned any trips yet. Start by creating a new itinerary for your next dream destination.
          </p>
          <Link href="/trips/new">
            <Button size="lg">Create Your First Trip</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Card key={trip.id} className="overflow-hidden group hover:border-primary/50 transition-colors flex flex-col">
              <div className="h-40 bg-muted relative overflow-hidden shrink-0">
                {trip.coverImage ? (
                  <img src={trip.coverImage} alt={trip.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-10 h-10 text-primary/40" />
                  </div>
                )}
                {/* Status Badge */}
                <div className="absolute top-3 left-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium shadow-sm">
                  {new Date(trip.endDate) < new Date() ? "Past" : new Date(trip.startDate) > new Date() ? "Upcoming" : "In Progress"}
                </div>
              </div>
              <CardHeader className="pb-2 flex-grow">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-2">{trip.name}</CardTitle>
                </div>
                <CardDescription className="flex items-center gap-1.5 mt-2 text-xs font-medium">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {format(new Date(trip.startDate), "MMM d, yyyy")} - {format(new Date(trip.endDate), "MMM d, yyyy")}
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-3">
                  {trip.stops.slice(0, 3).map((stop) => (
                    <span key={stop.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                      {stop.city.name}
                    </span>
                  ))}
                  {trip.stops.length > 3 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary/50 text-secondary-foreground">
                      +{trip.stops.length - 3}
                    </span>
                  )}
                  {trip.stops.length === 0 && (
                    <span className="text-xs text-muted-foreground italic">No destinations added</span>
                  )}
                </div>
              </CardHeader>
              <CardFooter className="pt-4 border-t gap-2 bg-muted/20">
                <Link href={`/trips/${trip.id}`} className="flex-1">
                  <Button variant="default" className="w-full">Open</Button>
                </Link>
                <Link href={`/trips/${trip.id}/edit`}>
                  <Button variant="outline" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
