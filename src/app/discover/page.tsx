import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"
import { CitySearch } from "@/components/cities/city-search"

export const metadata: Metadata = {
  title: "Global City Search & Discover | GlobeTrotter",
  description: "Search world destinations, filter by region and cost index, and add cities to your travel itinerary.",
}

function getRegionForCountry(country: string): string {
  const c = country.toLowerCase()
  if (["france", "italy", "united kingdom", "spain", "netherlands", "switzerland", "iceland", "germany", "greece", "portugal", "austria", "norway", "sweden", "czech republic", "ireland"].includes(c)) {
    return "Europe"
  }
  if (["japan", "indonesia", "singapore", "thailand", "south korea", "vietnam", "india", "china", "malaysia", "philippines"].includes(c)) {
    return "Asia"
  }
  if (["united states", "canada", "mexico", "brazil", "argentina", "peru", "colombia", "chile"].includes(c)) {
    return "Americas"
  }
  if (["australia", "new zealand", "fiji"].includes(c)) {
    return "Oceania"
  }
  if (["united arab emirates", "egypt", "south africa", "morocco", "kenya", "saudi arabia", "turkey", "israel", "qatar"].includes(c)) {
    return "Africa & Middle East"
  }
  return "Europe"
}

export default async function DiscoverPage() {
  const session = await getServerSession(authOptions)

  const dbCities = await prisma.city.findMany({
    take: 24,
    include: {
      _count: {
        select: {
          activities: true,
          stops: true,
          savedDestinations: true,
        },
      },
      ...(session?.user?.id
        ? {
            savedDestinations: {
              where: { userId: session.user.id },
              select: { id: true },
            },
          }
        : {}),
    },
  })

  const initialCities = dbCities.map((city) => ({
    id: city.id,
    name: city.name,
    country: city.country,
    region: getRegionForCountry(city.country),
    lat: city.lat,
    lng: city.lng,
    costIndex: city.costIndex,
    imageUrl: city.imageUrl,
    activityCount: city._count.activities,
    popularityScore: Math.min(99, (city._count.stops * 3) + (city._count.savedDestinations * 2) + (city.costIndex * 10) + 70),
    isSaved: session?.user?.id
      ? Array.isArray(city.savedDestinations) && city.savedDestinations.length > 0
      : false,
  }))

  return (
    <div className="min-h-screen bg-zinc-50/60 text-zinc-900 selection:bg-zinc-950 selection:text-white font-sans antialiased pb-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <CitySearch initialCities={initialCities} />
      </div>
    </div>
  )
}
