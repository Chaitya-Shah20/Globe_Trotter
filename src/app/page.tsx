import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Compass, Map, Calendar, Plane } from "lucide-react"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24 max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-primary">
            Plan your perfect trip with <span className="text-secondary-foreground">GlobeTrotter</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The intelligent travel planner that helps you design, organize, and budget your next adventure seamlessly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/signup">
            <Button size="lg" className="w-full sm:w-auto text-lg px-8">Get Started</Button>
          </Link>
          <Link href="/discover">
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">Discover Destinations</Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 mt-16 text-left">
          <div className="space-y-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Map className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Multi-City Itineraries</h3>
            <p className="text-muted-foreground">Easily plan complex trips with multiple stops and visualize them on an interactive map.</p>
          </div>
          <div className="space-y-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Day-by-Day Planning</h3>
            <p className="text-muted-foreground">Organize your activities with a drag-and-drop calendar and stay on top of your schedule.</p>
          </div>
          <div className="space-y-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Compass className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Smart Budgeting</h3>
            <p className="text-muted-foreground">Track expenses, see category breakdowns, and get alerts when you are over budget.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
