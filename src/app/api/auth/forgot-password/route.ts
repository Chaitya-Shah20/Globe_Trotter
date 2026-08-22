import { NextResponse } from "next/server"
import prisma from "@/lib/db"
import * as z from "zod"

const forgotSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = forgotSchema.parse(body)

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    // For security, always return success message even if email is not found
    return NextResponse.json({
      message: "If an account with that email exists, password reset instructions have been sent.",
      status: "success",
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 422 })
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    )
  }
}
