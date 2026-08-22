import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"
import * as z from "zod"

const createExpenseSchema = z.object({
  tripId: z.string(),
  category: z.string().min(1, "Category is required"), // transport, stay, meals, activities, other
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  currency: z.string().optional().default("USD"),
  description: z.string().min(1, "Description is required"),
  date: z.string(),
  itineraryActivityId: z.string().optional(),
})

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const tripId = searchParams.get("tripId")

    if (!tripId) {
      return NextResponse.json({ message: "tripId parameter is required" }, { status: 400 })
    }

    const expenses = await prisma.expense.findMany({
      where: { tripId },
      orderBy: { date: "desc" },
    })

    return NextResponse.json(expenses)
  } catch (error: any) {
    console.error("Get expenses error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validated = createExpenseSchema.parse(body)

    const trip = await prisma.trip.findUnique({
      where: { id: validated.tripId },
    })

    if (!trip) {
      return NextResponse.json({ message: "Trip not found" }, { status: 404 })
    }

    if (trip.ownerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    const expense = await prisma.expense.create({
      data: {
        tripId: validated.tripId,
        category: validated.category.toLowerCase(),
        amount: Number(validated.amount),
        currency: validated.currency || "USD",
        description: validated.description,
        date: new Date(validated.date),
        itineraryActivityId: validated.itineraryActivityId || null,
      },
    })

    return NextResponse.json(expense, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.issues }, { status: 422 })
    }
    console.error("Create expense error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
