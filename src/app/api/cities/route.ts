import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

// Curated global cities catalog to ensure rich discovery experience
const CURATED_GLOBAL_CITIES = [
  {
    name: "Paris",
    country: "France",
    region: "Europe",
    lat: 48.8566,
    lng: 2.3522,
    costIndex: 4,
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80",
    description: "The City of Light, famed for haute couture, world-class gastronomy, and iconic landmarks like the Eiffel Tower and the Louvre.",
  },
  {
    name: "Tokyo",
    country: "Japan",
    region: "Asia",
    lat: 35.6762,
    lng: 139.6503,
    costIndex: 4,
    imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80",
    description: "A neon-lit metropolis blending futuristic skyscraper districts with ancient shrines, street-food alleys, and serene gardens.",
  },
  {
    name: "Rome",
    country: "Italy",
    region: "Europe",
    lat: 41.9028,
    lng: 12.4964,
    costIndex: 3,
    imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1000&q=80",
    description: "The Eternal City, steeped in nearly three millennia of globally influential art, architecture, and classical culture.",
  },
  {
    name: "New York",
    country: "United States",
    region: "Americas",
    lat: 40.7128,
    lng: -74.006,
    costIndex: 5,
    imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1000&q=80",
    description: "The cultural and financial capital of the world, featuring Broadway, Central Park, and iconic skyline views.",
  },
  {
    name: "London",
    country: "United Kingdom",
    region: "Europe",
    lat: 51.5074,
    lng: -0.1278,
    costIndex: 4,
    imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1000&q=80",
    description: "Historic British capital showcasing the Tower of London, Big Ben, thriving arts, and quintessential royal grandeur.",
  },
  {
    name: "Kyoto",
    country: "Japan",
    region: "Asia",
    lat: 35.0116,
    lng: 135.7681,
    costIndex: 3,
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=80",
    description: "Famous for classical Buddhist temples, gardens, imperial palaces, Shinto shrines, and traditional wooden houses.",
  },
  {
    name: "Barcelona",
    country: "Spain",
    region: "Europe",
    lat: 41.3879,
    lng: 2.16992,
    costIndex: 3,
    imageUrl: "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1000&q=80",
    description: "Catalonia’s seaside capital renowned for Gaudí’s architectural wonders, vibrant tapas culture, and Mediterranean beaches.",
  },
  {
    name: "Dubai",
    country: "United Arab Emirates",
    region: "Africa & Middle East",
    lat: 25.2048,
    lng: 55.2708,
    costIndex: 5,
    imageUrl: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=80",
    description: "An oasis of luxury shopping, ultramodern architecture, soaring skyscrapers, and desert adventures.",
  },
  {
    name: "Amsterdam",
    country: "Netherlands",
    region: "Europe",
    lat: 52.3676,
    lng: 4.9041,
    costIndex: 4,
    imageUrl: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?auto=format&fit=crop&w=1000&q=80",
    description: "The picturesque canal city characterized by its artistic heritage, cycling culture, and narrow gabled houses.",
  },
  {
    name: "Zurich",
    country: "Switzerland",
    region: "Europe",
    lat: 47.3769,
    lng: 8.5417,
    costIndex: 5,
    imageUrl: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1000&q=80",
    description: "Alpine wonderland combining lakefront luxury, Swiss heritage, pristine chocolate boutiques, and mountain vistas.",
  },
  {
    name: "Bali",
    country: "Indonesia",
    region: "Asia",
    lat: -8.4095,
    lng: 115.1889,
    costIndex: 2,
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80",
    description: "Tropical island sanctuary renowned for forested volcanic mountains, iconic rice paddies, and coral reefs.",
  },
  {
    name: "Sydney",
    country: "Australia",
    region: "Oceania",
    lat: -33.8688,
    lng: 151.2093,
    costIndex: 4,
    imageUrl: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1000&q=80",
    description: "Harbour city famous for its sail-like Opera House, Bondi Beach, and vibrant sun-drenched lifestyle.",
  },
  {
    name: "Singapore",
    country: "Singapore",
    region: "Asia",
    lat: 1.3521,
    lng: 103.8198,
    costIndex: 4,
    imageUrl: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1000&q=80",
    description: "Futuristic garden city boasting Marina Bay Sands, supertree groves, and world-class hawker gastronomy.",
  },
  {
    name: "Cairo",
    country: "Egypt",
    region: "Africa & Middle East",
    lat: 30.0444,
    lng: 31.2357,
    costIndex: 1,
    imageUrl: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1000&q=80",
    description: "Cradle of ancient civilization set along the Nile, home to the Great Pyramids of Giza and historic bazaars.",
  },
  {
    name: "Reykjavik",
    country: "Iceland",
    region: "Europe",
    lat: 64.1466,
    lng: -21.9426,
    costIndex: 4,
    imageUrl: "https://images.unsplash.com/photo-1507272931001-fc06c17e4f43?auto=format&fit=crop&w=1000&q=80",
    description: "Gateway to the Aurora Borealis, dramatic geothermal geysers, glaciers, and volcanic landscapes.",
  },
  {
    name: "Bangkok",
    country: "Thailand",
    region: "Asia",
    lat: 13.7563,
    lng: 100.5018,
    costIndex: 2,
    imageUrl: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1000&q=80",
    description: "Dynamic metropolis famous for ornate shrines, bustling river life, and vibrant night markets.",
  },
  {
    name: "Cape Town",
    country: "South Africa",
    region: "Africa & Middle East",
    lat: -33.9249,
    lng: 18.4241,
    costIndex: 2,
    imageUrl: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1000&q=80",
    description: "Port city beneath flat-topped Table Mountain, known for dramatic coastal drives, vineyards, and penguins.",
  },
  {
    name: "Venice",
    country: "Italy",
    region: "Europe",
    lat: 45.4408,
    lng: 12.3155,
    costIndex: 4,
    imageUrl: "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?auto=format&fit=crop&w=1000&q=80",
    description: "The floating city built across more than 100 islands, adorned with Gothic palaces and winding canals.",
  },
]

// Mapping helper for regions
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

// Ensures baseline cities exist in DB
async function ensureSeedCities() {
  const count = await prisma.city.count()
  if (count < 8) {
    for (const item of CURATED_GLOBAL_CITIES) {
      const existing = await prisma.city.findFirst({
        where: { name: item.name },
      })
      if (!existing) {
        await prisma.city.create({
          data: {
            name: item.name,
            country: item.country,
            lat: item.lat,
            lng: item.lng,
            costIndex: item.costIndex,
            imageUrl: item.imageUrl,
          },
        })
      }
    }
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(req.url)

    const query = (searchParams.get("q") || "").trim().toLowerCase()
    const region = (searchParams.get("region") || "").trim()
    const costIndex = searchParams.get("costIndex")
      ? parseInt(searchParams.get("costIndex")!, 10)
      : null
    const sortBy = searchParams.get("sortBy") || "popular"
    const limit = parseInt(searchParams.get("limit") || "50", 10)

    // Ensure database has cities
    await ensureSeedCities()

    // Fetch from Postgres
    const dbCities = await prisma.city.findMany({
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

    // Enrich and filter cities
    let enriched = dbCities.map((city) => {
      const detectedRegion = getRegionForCountry(city.country)
      const isSaved = session?.user?.id
        ? Array.isArray(city.savedDestinations) && city.savedDestinations.length > 0
        : false

      // Calculate popularity score based on stops & saves
      const popularityScore = (city._count.stops * 3) + (city._count.savedDestinations * 2) + (city.costIndex * 10) + 70

      return {
        id: city.id,
        name: city.name,
        country: city.country,
        region: detectedRegion,
        lat: city.lat,
        lng: city.lng,
        costIndex: city.costIndex,
        imageUrl: city.imageUrl,
        activityCount: city._count.activities,
        popularityScore: Math.min(99, popularityScore),
        isSaved,
      }
    })

    // Search query filter
    if (query) {
      enriched = enriched.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.country.toLowerCase().includes(query) ||
          c.region.toLowerCase().includes(query)
      )
    }

    // Region filter
    if (region && region !== "all" && region !== "All") {
      enriched = enriched.filter(
        (c) => c.region.toLowerCase() === region.toLowerCase()
      )
    }

    // Cost Index filter
    if (costIndex && costIndex >= 1 && costIndex <= 5) {
      enriched = enriched.filter((c) => c.costIndex === costIndex)
    }

    // Sorting
    if (sortBy === "cost_asc") {
      enriched.sort((a, b) => a.costIndex - b.costIndex)
    } else if (sortBy === "cost_desc") {
      enriched.sort((a, b) => b.costIndex - a.costIndex)
    } else if (sortBy === "alphabetical") {
      enriched.sort((a, b) => a.name.localeCompare(b.name))
    } else {
      // Default: popular
      enriched.sort((a, b) => b.popularityScore - a.popularityScore)
    }

    return NextResponse.json({
      cities: enriched.slice(0, limit),
      total: enriched.length,
    })
  } catch (error) {
    console.error("Failed to search cities:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
