import { Metadata } from "next"
import { TripForm } from "@/components/trips/trip-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Plan New Trip | GlobeTrotter",
}

export default function NewTripPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Plan a New Trip</CardTitle>
          <CardDescription>
            Where to next? Enter the basic details of your upcoming adventure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TripForm />
        </CardContent>
      </Card>
    </div>
  )
}
