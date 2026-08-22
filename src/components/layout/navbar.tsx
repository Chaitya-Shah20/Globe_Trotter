import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/layout/user-nav"
import { Map, MapPinned } from "lucide-react"

export async function Navbar() {
  const session = await getServerSession(authOptions)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <MapPinned className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">GlobeTrotter</span>
          </Link>
          
          <nav className="hidden md:flex ml-6 gap-6 text-sm font-medium">
            <Link href="/discover" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Discover
            </Link>
            {session && (
              <>
                <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
                  Dashboard
                </Link>
                <Link href="/trips" className="transition-colors hover:text-foreground/80 text-foreground/60">
                  My Trips
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <UserNav user={session.user} />
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
