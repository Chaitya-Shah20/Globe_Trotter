import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Bell, ChevronDown, MapPin, Compass } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { GlobeTrotterLogo } from "@/components/layout/logo"
import { UserNav } from "@/components/layout/user-nav"

export async function Navbar() {
  const session = await getServerSession(authOptions)
  const travelerName = session?.user?.name ? session.user.name.split(" ")[0] : "Traveler"

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pointer-events-none">
      <div className="pointer-events-auto flex items-center justify-between py-3 px-5 sm:px-6 rounded-2xl bg-zinc-950/70 backdrop-blur-xl border border-white/10 shadow-2xl">
        {/* Left: GlobeTrotter Brand Logo */}
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <GlobeTrotterLogo />
        </Link>

        {/* Center: Minimal Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.18em] font-medium text-zinc-300 font-mono">
          <Link
            href="/dashboard"
            className="hover:text-white transition-colors duration-200 py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
          >
            Dashboard
          </Link>
          <Link
            href="/trips"
            className="hover:text-white transition-colors duration-200 py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
          >
            My Trips
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger render={
              <button
                type="button"
                className="hover:text-white transition-colors duration-200 py-1 relative flex items-center gap-1 group"
              >
                <span>Explore</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            } />
            <DropdownMenuContent className="w-48 p-1.5 shadow-lg border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-950" align="start">
              <Link href="/discover">
                <DropdownMenuItem className="cursor-pointer rounded-xl text-xs gap-2 py-2">
                  <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                  <span>City Search</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/discover/activities">
                <DropdownMenuItem className="cursor-pointer rounded-xl text-xs gap-2 py-2">
                  <Compass className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Activity Search</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            href="/trips/new"
            className="hover:text-white transition-colors duration-200 py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
          >
            Plan Trip
          </Link>
          {session?.user?.role === "ADMIN" && (
            <Link
              href="/admin"
              className="hover:text-white transition-colors duration-200 py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Right: Notifications & User Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            type="button"
            aria-label="Notifications"
            className="relative p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-all"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-white ring-2 ring-zinc-950" />
          </button>

          <div className="h-4 w-[1px] bg-zinc-800 hidden sm:block" />

          {session ? (
            <UserNav user={{ name: session.user.name, email: session.user.email, image: session.user.image, role: session.user.role as string }} />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs tracking-wider uppercase font-mono text-zinc-300 hover:text-white px-3 py-1.5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="text-xs tracking-wider uppercase font-mono bg-white text-zinc-950 px-3.5 py-1.5 rounded-xl font-semibold hover:bg-zinc-200 transition-all"
              >
                Join
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
