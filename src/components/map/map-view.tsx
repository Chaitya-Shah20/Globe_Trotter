"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from "lucide-react"

export function MapView({ trip }: { trip: any }) {
  const hasStops = trip.stops && trip.stops.length > 0

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden border relative flex flex-col">
      <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur p-4 rounded-lg shadow-md max-w-sm">
        <h3 className="font-semibold text-lg mb-2">Trip Map</h3>
        <p className="text-sm text-muted-foreground">
          Mock map abstraction. In a real application, this would use Mapbox GL JS to display the route connecting:
        </p>
        <div className="mt-3 space-y-2">
          {hasStops ? (
            trip.stops.map((stop: any, idx: number) => (
              <div key={stop.id} className="flex items-center gap-2 text-sm">
                <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium shrink-0">
                  {idx + 1}
                </div>
                <span className="font-medium">{stop.city.name}</span>
                <span className="text-xs text-muted-foreground">({stop.city.country})</span>
              </div>
            ))
          ) : (
            <p className="text-sm italic text-muted-foreground">No destinations added.</p>
          )}
        </div>
      </div>
      
      {/* Mock Map Background */}
      <div className="flex-1 bg-blue-50/50 flex items-center justify-center relative overflow-hidden">
        {/* Fake grid pattern to look like a map background */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        
        {hasStops ? (
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <MapPin className="w-16 h-16 text-primary/50 mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-primary/70">Mapbox Integration Pending</h2>
            <p className="text-muted-foreground mt-2 max-w-md px-4">
              The infrastructure is ready. Just add your Mapbox access token to render the interactive map.
            </p>
          </div>
        ) : (
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <MapPin className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-medium text-muted-foreground/60">No route to display</h2>
          </div>
        )}
      </div>
    </div>
  )
}
