import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

// ─── Activity type constants ───
const ACTIVITY_TYPES = [
  "SIGHTSEEING",
  "FOOD",
  "ADVENTURE",
  "NIGHTLIFE",
  "SHOPPING",
  "WELLNESS",
  "TRANSPORT",
  "ACCOMMODATION",
] as const

// ─── Curated activities for auto-seeding sparse DBs ───
const CURATED_ACTIVITIES = [
  {
    name: "Walking City Tour",
    description: "Explore the city highlights on foot with a knowledgeable local guide.",
    type: "SIGHTSEEING",
    defaultCost: 15.0,
    durationMinutes: 150,
    imageUrl: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Street Food Adventure",
    description: "Discover the best local street food stalls and hidden culinary gems.",
    type: "FOOD",
    defaultCost: 30.0,
    durationMinutes: 120,
    imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Sunset Viewpoint Hike",
    description: "Hike to a scenic overlook for unforgettable sunset panoramas.",
    type: "ADVENTURE",
    defaultCost: 10.0,
    durationMinutes: 180,
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
  },
]

// Seeds generic activities into cities that have zero activities
async function ensureSeedActivities() {
  const citiesWithoutActivities = await prisma.city.findMany({
    where: {
      activities: {
        none: {},
      },
    },
    take: 20,
  })

  for (const city of citiesWithoutActivities) {
    for (const template of CURATED_ACTIVITIES) {
      await prisma.activity.create({
        data: {
          name: template.name,
          description: template.description,
          type: template.type,
          defaultCost: template.defaultCost,
          durationMinutes: template.durationMinutes,
          imageUrl: template.imageUrl,
          cityId: city.id,
        },
      })
    }
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    const query = (searchParams.get("q") || "").trim().toLowerCase()
    const cityId = searchParams.get("cityId") || ""
    const type = (searchParams.get("type") || "").trim().toUpperCase()
    const maxCost = searchParams.get("maxCost")
      ? parseFloat(searchParams.get("maxCost")!)
      : null
    const maxDuration = searchParams.get("maxDuration")
      ? parseInt(searchParams.get("maxDuration")!, 10)
      : null
    const sortBy = searchParams.get("sortBy") || "popular"
    const limit = parseInt(searchParams.get("limit") || "50", 10)

    // Ensure activities exist
    await ensureSeedActivities()

    // Build Prisma where clause
    const where: Record<string, unknown> = {}

    if (cityId) {
      where.cityId = cityId
    }

    if (type && ACTIVITY_TYPES.includes(type as typeof ACTIVITY_TYPES[number])) {
      where.type = type
    }

    if (maxCost !== null && !isNaN(maxCost)) {
      where.defaultCost = { lte: maxCost }
    }

    if (maxDuration !== null && !isNaN(maxDuration)) {
      where.durationMinutes = { lte: maxDuration }
    }

    // Fetch from database
    const dbActivities = await prisma.activity.findMany({
      where,
      include: {
        city: {
          select: {
            id: true,
            name: true,
            country: true,
          },
        },
        _count: {
          select: {
            itineraryItems: true,
          },
        },
      },
    })

    // Enrich and filter
    let enriched = dbActivities.map((activity) => {
      const popularityScore = Math.min(
        99,
        activity._count.itineraryItems * 5 + 50 + Math.floor(Math.random() * 30)
      )

      return {
        id: activity.id,
        name: activity.name,
        description: activity.description,
        type: activity.type,
        defaultCost: activity.defaultCost,
        durationMinutes: activity.durationMinutes,
        imageUrl: activity.imageUrl,
        cityId: activity.cityId,
        cityName: activity.city.name,
        cityCountry: activity.city.country,
        popularityScore,
        timesBooked: activity._count.itineraryItems,
      }
    })

    // Text search filter
    if (query) {
      enriched = enriched.filter(
        (a) =>
          a.name.toLowerCase().includes(query) ||
          (a.description || "").toLowerCase().includes(query) ||
          a.cityName.toLowerCase().includes(query) ||
          a.type.toLowerCase().includes(query)
      )
    }

    // Sorting
    if (sortBy === "cost_asc") {
      enriched.sort((a, b) => a.defaultCost - b.defaultCost)
    } else if (sortBy === "cost_desc") {
      enriched.sort((a, b) => b.defaultCost - a.defaultCost)
    } else if (sortBy === "duration") {
      enriched.sort((a, b) => a.durationMinutes - b.durationMinutes)
    } else if (sortBy === "name") {
      enriched.sort((a, b) => a.name.localeCompare(b.name))
    } else {
      // popular (default)
      enriched.sort((a, b) => b.popularityScore - a.popularityScore)
    }

    // Apply limit
    enriched = enriched.slice(0, limit)

    return NextResponse.json({
      activities: enriched,
      total: enriched.length,
      types: ACTIVITY_TYPES,
    })
  } catch (error) {
    console.error("Failed to fetch activities:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
