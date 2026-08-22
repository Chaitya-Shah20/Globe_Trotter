"use client"

import Link from "next/link"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, MapPin, CalendarDays, ArrowRight, Plane, Wallet } from "lucide-react"

export function DashboardContent({ upcomingTrips, popularCities }: { upcomingTrips: any[], popularCities: any[] }) {
  return (
    <div className="space-y-8">
      {/* Action Bar */}
      <div className="flex gap-4">
        <Link href="/trips/new">
          <Button size="lg" className="gap-2 shadow-sm">
            <Plus className="w-5 h-5" />
            Plan New Trip
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Upcoming Trips</h2>
            <Link href="/trips">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {upcomingTrips.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center h-48 text-center">
                <Plane className="w-12 h-12 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium">No upcoming trips</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">Start planning your next adventure today.</p>
                <Link href="/trips/new">
                  <Button variant="outline">Create a Trip</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {upcomingTrips.map((trip) => (
                <Card key={trip.id} className="overflow-hidden group hover:border-primary/50 transition-colors">
                  <div className="h-32 bg-muted relative overflow-hidden">
                    {trip.coverImage ? (
                      <img src={trip.coverImage} alt={trip.name} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-primary/40" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="line-clamp-1">{trip.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <CalendarDays className="w-3 h-3" />
                      {format(new Date(trip.startDate), "MMM d")} - {format(new Date(trip.endDate), "MMM d, yyyy")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex flex-wrap gap-1">
                      {trip.stops.slice(0, 3).map((stop: any) => (
                        <span key={stop.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                          {stop.city.name}
                        </span>
                      ))}
                      {trip.stops.length > 3 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary/50 text-secondary-foreground">
                          +{trip.stops.length - 3} more
                        </span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Link href={`/trips/${trip.id}`} className="w-full">
                      <Button variant="secondary" className="w-full">View Itinerary</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">Discover</h2>
          <div className="grid grid-cols-1 gap-4">
            {popularCities.map((city) => (
              <Card key={city.id} className="overflow-hidden flex flex-row items-center cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="w-24 h-24 shrink-0 bg-muted">
                  {city.imageUrl ? (
                    <img src={city.imageUrl} alt={city.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary">
                      <MapPin className="w-6 h-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-semibold">{city.name}</h4>
                  <p className="text-xs text-muted-foreground">{city.country}</p>
                </div>
              </Card>
            ))}
          </div>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" /> Budget Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Plan trips carefully to track your expenses. The budget module helps you see daily costs across transport, accommodation, and activities.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/budget">
                <Button variant="link" className="px-0">Explore budgeting tools <ArrowRight className="w-4 h-4 ml-1" /></Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
