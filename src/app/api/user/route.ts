import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Because of cascade delete setup in Prisma schema, 
    // deleting the user will delete all their trips, stops, activities, etc.
    await prisma.user.delete({
      where: {
        id: session.user.id,
      },
    })

    return NextResponse.json({ message: "Account deleted successfully" }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
