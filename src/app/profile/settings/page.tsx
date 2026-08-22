import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import { ProfileSettingsForm } from "@/components/profile/profile-settings-form"

export const metadata: Metadata = {
  title: "Account Settings | GlobeTrotter",
  description: "Manage your traveler identity, global preferences, and security credentials.",
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      preferences: {
        select: {
          currency: true,
          language: true,
        },
      },
    },
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-zinc-50/60 text-zinc-900 selection:bg-zinc-950 selection:text-white font-sans antialiased pb-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <ProfileSettingsForm initialUser={user} />
      </div>
    </div>
  )
}
