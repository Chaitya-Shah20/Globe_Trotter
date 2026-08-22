import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import prisma from "@/lib/db"
import * as z from "zod"

const signupSchema = z.object({
  name: z.string().min(2, "Full Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  if (data.confirmPassword !== undefined && data.confirmPassword !== "") {
    return data.password === data.confirmPassword
  }
  return true
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validated = signupSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase().trim() },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "An account with this email address already exists." },
        { status: 409 }
      )
    }

    const hashedPassword = await hash(validated.password, 12)

    const user = await prisma.user.create({
      data: {
        name: validated.name.trim(),
        email: validated.email.toLowerCase().trim(),
        password: hashedPassword,
        preferences: {
          create: {
            currency: "USD",
            language: "en",
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    })

    return NextResponse.json(
      { message: "Account created successfully", user },
      { status: 201 }
    )
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: error.issues[0]?.message || "Invalid input data", errors: error.issues },
        { status: 422 }
      )
    }

    console.error("Signup error:", error)
    return NextResponse.json(
      { message: "Internal server error during registration" },
      { status: 500 }
    )
  }
}
