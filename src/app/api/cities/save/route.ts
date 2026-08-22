import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { cityId } = await req.json()

    if (!cityId) {
      return NextResponse.json({ message: "cityId is required" }, { status: 400 })
    }

    const existing = await prisma.savedDestination.findUnique({
      where: {
        userId_cityId: {
          userId: session.user.id,
          cityId,
        },
      },
    })

    if (existing) {
      // Remove bookmark
      await prisma.savedDestination.delete({
        where: { id: existing.id },
      })
      return NextResponse.json({ saved: false, message: "Removed from saved destinations" })
    } else {
      // Add bookmark
      await prisma.savedDestination.create({
        data: {
          userId: session.user.id,
          cityId,
        },
      })
      return NextResponse.json({ saved: true, message: "Saved to your destinations" })
    }
  } catch (error: any) {
    console.error("Toggle bookmark error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
