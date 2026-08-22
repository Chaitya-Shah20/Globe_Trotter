import { Metadata } from "next"
import prisma from "@/lib/db"
import Link from "next/link"
import { Compass, MapPin, Search } from "lucide-react"

export const metadata: Metadata = {
  title: "Global Activity Search | GlobeTrotter",
  description: "Browse world-class experiences and add them to your trips.",
}

export default async function GlobalActivitySearchPage() {
  const activities = await prisma.activity.findMany({
    take: 40,
    orderBy: { defaultCost: "desc" },
    include: { city: true },
  })

  return (
    <div className="min-h-screen bg-zinc-50/60 text-zinc-900 selection:bg-zinc-950 selection:text-white font-sans antialiased pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        <div className="mb-10 text-center space-y-4 pt-10">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-950 flex justify-center items-center gap-3">
            <Compass className="w-8 h-8 text-zinc-400" />
            Discover Global Activities
          </h1>
          <p className="text-zinc-500 max-w-2xl mx-auto font-mono text-sm">
            Browse top experiences around the world. Add them to your itineraries using the trip builder.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.map((activity) => (
            <div key={activity.id} className="group rounded-3xl border border-zinc-200 bg-white overflow-hidden shadow-xs hover:border-zinc-300 transition-all flex flex-col">
              <div className="h-48 w-full overflow-hidden bg-zinc-100 relative">
                <img
                  src={activity.imageUrl || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80"}
                  alt={activity.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-white/90 backdrop-blur-md shadow-xs text-[10px] font-bold font-mono tracking-wider uppercase text-zinc-950">
                  ${activity.defaultCost.toFixed(0)}
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-mono uppercase tracking-wider mb-2">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{activity.city.name}</span>
                  </div>
                  <h3 className="text-base font-bold text-zinc-950 leading-tight">
                    {activity.name}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                    {activity.description}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                    {activity.durationMinutes} mins
                  </span>
                  <Link href={`/trips/new?city=${encodeURIComponent(activity.city.name)}`}>
                    <button className="text-xs font-semibold text-zinc-950 hover:text-zinc-600 transition-colors uppercase tracking-wider">
                      Plan Trip
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
