"use server"

import prisma from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function updateTripBudget(tripId: string, budget: number | null) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      throw new Error("Unauthorized")
    }
    
    // Ensure the budget is not negative
    if (budget !== null && budget < 0) {
      throw new Error("Budget cannot be negative")
    }

    // Verify ownership
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      select: { ownerId: true }
    })

    if (!trip || trip.ownerId !== session.user.id) {
      throw new Error("Unauthorized to edit this trip")
    }

    await prisma.trip.update({
      where: { id: tripId },
      data: { totalBudget: budget }
    })

    revalidatePath(`/trips/${tripId}`)
    return { success: true }
  } catch (error: any) {
    console.error("Failed to update budget:", error)
    return { success: false, error: error.message }
  }
}
