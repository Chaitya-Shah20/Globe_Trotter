"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Clock, Plus, GripVertical, Info } from "lucide-react"

export function DayView({ trip, isOwner, setTrip }: { trip: any, isOwner: boolean, setTrip: any }) {
  const [selectedDay, setSelectedDay] = useState(trip.stops[0]?.days[0]?.id || null)

  const allDays = trip.stops.flatMap((stop: any) => stop.days)
  
  if (allDays.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <Info className="w-12 h-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium">No dates scheduled</h3>
        <p className="text-sm text-muted-foreground mt-1 mb-4">Add destinations to your trip to generate a day-by-day itinerary.</p>
      </div>
    )
  }

  const currentDayData = allDays.find((d: any) => d.id === selectedDay) || allDays[0]
  const currentStop = trip.stops.find((s: any) => s.id === currentDayData?.stopId)

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full">
      {/* Day Selector Sidebar */}
      <div className="md:w-64 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto pb-4 md:pb-0">
        {trip.stops.map((stop: any) => (
          <div key={stop.id} className="mb-4 shrink-0 w-48 md:w-auto">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2 sticky left-0">
              {stop.city.name}
            </h4>
            <div className="flex flex-col gap-1">
              {stop.days.map((day: any) => (
                <Button
                  key={day.id}
                  variant={selectedDay === day.id ? "secondary" : "ghost"}
                  className={`justify-start w-full ${selectedDay === day.id ? 'font-semibold' : 'font-normal'}`}
                  onClick={() => setSelectedDay(day.id)}
                >
                  Day {allDays.findIndex((d: any) => d.id === day.id) + 1} - {format(new Date(day.date), "MMM d")}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Separator orientation="vertical" className="hidden md:block h-auto" />

      {/* Day Content */}
      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">
              {currentStop?.city.name} - {format(new Date(currentDayData.date), "EEEE, MMMM d, yyyy")}
            </h2>
          </div>
          {isOwner && (
            <Button className="gap-2 shrink-0">
              <Plus className="w-4 h-4" /> Add Activity
            </Button>
          )}
        </div>

        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted before:to-transparent">
          {currentDayData.activities.length === 0 ? (
            <Card className="relative z-10 border-dashed ml-10 md:mx-auto md:w-3/4 text-center p-8 bg-background">
              <p className="text-muted-foreground">Free day! No activities planned yet.</p>
            </Card>
          ) : (
            currentDayData.activities.map((item: any, idx: number) => (
              <div key={item.id} className="relative z-10 flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Timeline Icon */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-secondary text-secondary-foreground shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                </div>
                
                {/* Content */}
                <Card className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] hover:border-primary/50 transition-colors">
                  <CardContent className="p-4 flex flex-col gap-2 relative group">
                    {isOwner && (
                      <div className="absolute top-2 right-2 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab">
                        <GripVertical className="w-4 h-4" />
                      </div>
                    )}
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-lg">{item.activity.name}</h4>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{item.startTime ? format(new Date(item.startTime), "h:mm a") : 'Flexible'}</span>
                      {item.endTime && <span> - {format(new Date(item.endTime), "h:mm a")}</span>}
                    </div>
                    <p className="text-sm line-clamp-2">{item.activity.description}</p>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t text-sm font-medium">
                      <span className="text-muted-foreground capitalize">{item.activity.type.toLowerCase()}</span>
                      <span>${item.customCost ?? item.activity.defaultCost}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
