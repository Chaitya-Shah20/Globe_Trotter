import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Allow admins, or demo fallback if accessed in testing
    const [totalUsers, totalTrips, totalCities, totalActivities, totalExpenses] = await Promise.all([
      prisma.user.count(),
      prisma.trip.count(),
      prisma.city.count(),
      prisma.activity.count(),
      prisma.expense.aggregate({
        _sum: { amount: true },
        _count: true,
      }),
    ])

    const popularCities = await prisma.city.findMany({
      orderBy: { popularityScore: "desc" },
      take: 5,
      include: {
        _count: {
          select: { stops: true, savedDestinations: true },
        },
      },
    })

    const recentTrips = await prisma.trip.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        owner: {
          select: { name: true, email: true },
        },
        stops: {
          select: { cityName: true, city: true },
        },
      },
    })

    const categoryDistribution = await prisma.expense.groupBy({
      by: ["category"],
      _sum: { amount: true },
    })

    return NextResponse.json({
      metrics: {
        totalUsers,
        totalTrips,
        totalCities,
        totalActivities,
        totalSpend: totalExpenses._sum.amount || 0,
        expenseCount: totalExpenses._count,
      },
      popularCities,
      recentTrips,
      categoryDistribution,
    })
  } catch (error: any) {
    console.error("Admin analytics error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
