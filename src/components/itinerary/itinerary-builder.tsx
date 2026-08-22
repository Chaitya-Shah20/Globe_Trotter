"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, CalendarDays, Wallet, Map as MapIcon, Plus, Settings } from "lucide-react"

import { CityManager } from "@/components/cities/city-manager"
import { DayView } from "@/components/itinerary/day-view"
import { BudgetSummary } from "@/components/budget/budget-summary"
import { MapView } from "@/components/map/map-view"

export function ItineraryBuilder({ initialTrip, isOwner }: { initialTrip: any, isOwner: boolean }) {
  const [trip, setTrip] = useState(initialTrip)
  
  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{trip.name}</h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <CalendarDays className="w-4 h-4" />
            {format(new Date(trip.startDate), "MMM d, yyyy")} - {format(new Date(trip.endDate), "MMM d, yyyy")}
          </p>
        </div>
        {isOwner && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Invite Friends
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="overview" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-4 md:w-[400px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
        </TabsList>
        
        <div className="mt-6 flex-1">
          <TabsContent value="overview" className="h-full m-0">
            <CityManager trip={trip} isOwner={isOwner} setTrip={setTrip} />
          </TabsContent>
          
          <TabsContent value="itinerary" className="h-full m-0">
            <DayView trip={trip} isOwner={isOwner} setTrip={setTrip} />
          </TabsContent>
          
          <TabsContent value="budget" className="h-full m-0">
            <BudgetSummary trip={trip} />
          </TabsContent>
          
          <TabsContent value="map" className="h-full m-0">
            <MapView trip={trip} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
