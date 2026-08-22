import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/db"
import { compare, hash } from "bcryptjs"
import * as z from "zod"

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
})

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = updatePasswordSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message || "Invalid input data" },
        { status: 422 }
      )
    }

    const { currentPassword, newPassword } = parsed.data

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user || !user.password) {
      return NextResponse.json(
        { message: "Cannot change password for this account." },
        { status: 400 }
      )
    }

    const isMatch = await compare(currentPassword, user.password)
    if (!isMatch) {
      return NextResponse.json(
        { message: "Incorrect current password" },
        { status: 400 }
      )
    }

    const hashedPassword = await hash(newPassword, 10)

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        password: hashedPassword,
      },
    })

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Failed to update password:", error)
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
