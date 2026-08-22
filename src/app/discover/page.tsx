import { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, MapPin, Star } from "lucide-react"
import prisma from "@/lib/db"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Discover | GlobeTrotter",
}

export default async function DiscoverPage() {
  const popularCities = await prisma.city.findMany({
    orderBy: {
      costIndex: "desc",
    },
    take: 12,
  })

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Where will you go next?
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          Discover new destinations, explore popular cities, and get inspired for your next adventure.
        </p>
        
        <div className="w-full max-w-2xl relative mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search for cities, countries, or landmarks..." 
              className="w-full pl-10 pr-24 h-14 text-lg rounded-full shadow-sm"
            />
            <Button className="absolute right-1.5 top-1.5 bottom-1.5 rounded-full px-6">
              Search
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Popular Destinations</h2>
            <p className="text-muted-foreground">Trending places among GlobeTrotter users</p>
          </div>
          <Button variant="ghost">View All</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularCities.map((city) => (
            <Card key={city.id} className="overflow-hidden group cursor-pointer hover:border-primary/50 transition-colors">
              <div className="h-48 bg-muted relative overflow-hidden">
                {city.imageUrl ? (
                  <img 
                    src={city.imageUrl} 
                    alt={city.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="w-full h-full bg-secondary flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-background/90 backdrop-blur rounded-full p-1.5 text-yellow-500 shadow-sm">
                  <Star className="w-4 h-4 fill-current" />
                </div>
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-lg">{city.name}</CardTitle>
                <CardDescription>{city.country}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Cost Level</span>
                  <span className="font-medium text-primary">
                    {Array(city.costIndex).fill('$').join('')}
                    <span className="text-muted-foreground/30">{Array(5 - city.costIndex).fill('$').join('')}</span>
                  </span>
                </div>
                <div className="mt-4">
                  <Link href="/trips/new">
                    <Button variant="secondary" className="w-full h-8 text-xs">Plan a trip here</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}

          {popularCities.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              No destinations found. Please run the seed script to populate data.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
