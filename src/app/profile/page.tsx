import { Metadata } from "next"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/db"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MapPin, Plane, Settings, Heart } from "lucide-react"

export const metadata: Metadata = {
  title: "Profile | GlobeTrotter",
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      _count: {
        select: { trips: true, savedDestinations: true }
      },
      savedDestinations: {
        include: { city: true },
        take: 3,
      }
    }
  })

  if (!user) {
    redirect("/login")
  }

  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.slice(0, 2).toUpperCase() || "U"

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl space-y-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <Card className="flex-1 w-full">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Avatar className="w-20 h-20 border-2">
              <AvatarImage src={user.image || ""} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-2xl">{user.name}</CardTitle>
              <CardDescription className="text-base">{user.email}</CardDescription>
            </div>
            <Link href="/profile/settings">
              <Button variant="outline" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-primary">{user._count.trips}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                  <Plane className="w-4 h-4" /> Trips Planned
                </div>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-primary">{user._count.savedDestinations}</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                  <Heart className="w-4 h-4" /> Saved Places
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <h2 className="text-2xl font-bold tracking-tight">Saved Destinations</h2>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        
        {user.savedDestinations.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <Heart className="w-8 h-8 mb-2 opacity-50" />
              <p>You haven't saved any destinations yet.</p>
              <Link href="/discover" className="mt-4">
                <Button variant="outline">Explore Places</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {user.savedDestinations.map((saved) => (
              <Card key={saved.id} className="overflow-hidden">
                <div className="h-32 bg-muted relative">
                  {saved.city.imageUrl ? (
                    <img src={saved.city.imageUrl} alt={saved.city.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Button variant="ghost" size="icon-sm" className="h-8 w-8 bg-background/50 hover:bg-background/80 rounded-full">
                      <Heart className="w-4 h-4 fill-primary text-primary" />
                    </Button>
                  </div>
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-lg">{saved.city.name}</CardTitle>
                  <CardDescription>{saved.city.country}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
