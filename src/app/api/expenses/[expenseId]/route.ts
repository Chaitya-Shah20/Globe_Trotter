import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ expenseId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    const { expenseId } = await params

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
      include: { trip: true }
    })

    if (!expense) {
      return NextResponse.json({ message: "Expense not found" }, { status: 404 })
    }

    if (expense.trip.ownerId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 })
    }

    await prisma.expense.delete({
      where: { id: expenseId }
    })

    return NextResponse.json({ message: "Expense deleted successfully" })
  } catch (error: any) {
    console.error("Delete expense error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
