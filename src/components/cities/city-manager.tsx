"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Plus, GripVertical, Trash2 } from "lucide-react"
import { useState } from "react"

export function CityManager({ trip, isOwner, setTrip }: { trip: any, isOwner: boolean, setTrip: any }) {
  const [isAddingCity, setIsAddingCity] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Destinations</h2>
          <p className="text-muted-foreground">Manage the cities you plan to visit on this trip.</p>
        </div>
        {isOwner && (
          <Button onClick={() => setIsAddingCity(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Add Destination
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {trip.stops.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center h-48 text-center py-6">
              <p className="text-muted-foreground mb-4">You haven't added any destinations yet.</p>
              {isOwner && (
                <Button variant="outline" onClick={() => setIsAddingCity(true)}>Add Your First Destination</Button>
              )}
            </CardContent>
          </Card>
        ) : (
          trip.stops.map((stop: any, index: number) => (
            <Card key={stop.id} className="overflow-hidden group">
              <div className="flex flex-col sm:flex-row">
                <div className="w-full sm:w-48 h-32 sm:h-auto bg-muted shrink-0 relative">
                  {stop.city.imageUrl ? (
                    <img src={stop.city.imageUrl} alt={stop.city.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-secondary">
                      <span className="text-muted-foreground font-medium">{stop.city.name}</span>
                    </div>
                  )}
                  {isOwner && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 backdrop-blur rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                      <GripVertical className="w-4 h-4" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 flex flex-col justify-between p-4 sm:p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{stop.city.name}, {stop.city.country}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {format(new Date(stop.arrivalDate), "MMM d")} - {format(new Date(stop.departureDate), "MMM d")}
                      </p>
                    </div>
                    {isOwner && (
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="mt-4 flex gap-4 text-sm">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Activities</span>
                      <span className="font-medium">{stop.days.reduce((acc: number, day: any) => acc + day.activities.length, 0)} planned</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">Est. Cost Level</span>
                      <span className="font-medium">{Array(stop.city.costIndex).fill('$').join('')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
      
      {/* City Search Modal would go here */}
      {isAddingCity && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle>Search for a city</CardTitle>
            <CardDescription>Mock abstraction: In a real app, this would use Mapbox or Google Places API.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <input type="text" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="Enter city name..." />
              <Button onClick={() => setIsAddingCity(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
