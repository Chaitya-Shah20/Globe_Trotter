import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    // Strict Role-based access control
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const { userId } = await params

    if (userId === session.user.id) {
      return new NextResponse("Cannot delete yourself", { status: 400 })
    }

    // Prisma onDelete: Cascade will handle relations (trips, saved destinations)
    await prisma.user.delete({
      where: { id: userId },
    })

    return new NextResponse("User deleted successfully", { status: 200 })
  } catch (error) {
    console.error("[ADMIN_USER_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    // Strict Role-based access control
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 })
    }

    const { userId } = await params
    const body = await req.json()
    const { role } = body

    if (userId === session.user.id) {
      return new NextResponse("Cannot modify your own role", { status: 400 })
    }

    if (role !== "ADMIN" && role !== "USER") {
      return new NextResponse("Invalid role", { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("[ADMIN_USER_PATCH]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
