import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import { ProfileContent } from "@/components/profile/profile-content"

export const metadata: Metadata = {
  title: "Traveler Passport & Profile | GlobeTrotter",
  description: "View your verified traveler dossier, expedition statistics, and curated bucket list.",
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      preferences: true,
      trips: {
        orderBy: {
          startDate: "desc",
        },
        include: {
          stops: {
            include: {
              city: true,
            },
            orderBy: {
              order: "asc",
            },
          },
          expenses: true,
        },
      },
      savedDestinations: {
        include: {
          city: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <ProfileContent
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        createdAt: user.createdAt,
        preferences: user.preferences,
      }}
      trips={user.trips}
      savedDestinations={user.savedDestinations}
    />
  )
}
