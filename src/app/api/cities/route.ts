import { NextResponse } from "next/server"
import prisma from "@/lib/db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")
    const region = searchParams.get("region")
    const country = searchParams.get("country")
    const maxCost = searchParams.get("maxCost")

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { country: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    if (region && region !== "All") {
      where.region = { equals: region, mode: "insensitive" }
    }

    if (country && country !== "All") {
      where.country = { contains: country, mode: "insensitive" }
    }

    if (maxCost) {
      where.costIndex = { lte: Number(maxCost) }
    }

    const cities = await prisma.city.findMany({
      where,
      include: {
        activities: {
          take: 4,
        },
      },
      orderBy: [
        { costIndex: "desc" },
        { name: "asc" },
      ],
    })

    return NextResponse.json(cities)
  } catch (error: any) {
    console.error("Get cities error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
