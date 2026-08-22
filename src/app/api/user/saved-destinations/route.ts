import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"
import * as z from "zod"

const toggleSchema = z.object({
  cityId: z.string().min(1, "City ID is required"),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const saved = await prisma.savedDestination.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        city: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(saved)
  } catch (error) {
    console.error("Failed to fetch saved destinations:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = toggleSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "Invalid input data" },
        { status: 422 }
      )
    }

    const { cityId } = parsed.data

    // Check if city exists
    const city = await prisma.city.findUnique({
      where: { id: cityId },
    })

    if (!city) {
      return NextResponse.json({ message: "Destination city not found" }, { status: 404 })
    }

    // Check if already saved
    const existing = await prisma.savedDestination.findUnique({
      where: {
        userId_cityId: {
          userId: session.user.id,
          cityId,
        },
      },
    })

    if (existing) {
      // Remove
      await prisma.savedDestination.delete({
        where: { id: existing.id },
      })
      return NextResponse.json({
        isSaved: false,
        message: `Removed ${city.name} from your bucket list`,
      })
    } else {
      // Add
      const created = await prisma.savedDestination.create({
        data: {
          userId: session.user.id,
          cityId,
        },
        include: {
          city: true,
        },
      })
      return NextResponse.json({
        isSaved: true,
        destination: created,
        message: `Added ${city.name} to your bucket list`,
      }, { status: 201 })
    }
  } catch (error) {
    console.error("Failed to toggle saved destination:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const cityId = searchParams.get("cityId")

    if (!cityId) {
      return NextResponse.json({ message: "City ID is required" }, { status: 400 })
    }

    await prisma.savedDestination.deleteMany({
      where: {
        userId: session.user.id,
        cityId,
      },
    })

    return NextResponse.json({ message: "Removed from bucket list" }, { status: 200 })
  } catch (error) {
    console.error("Failed to delete saved destination:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
