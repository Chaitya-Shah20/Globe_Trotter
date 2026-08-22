import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Bell } from "lucide-react"
import { GlobeTrotterLogo } from "@/components/layout/logo"

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
          <Link
            href="/discover"
            className="hover:text-white transition-colors duration-200 py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-white after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
          >
            Discover
          </Link>
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
            <Link
              href="/profile"
              className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-zinc-900/90 border border-white/10 hover:border-white/30 hover:bg-zinc-800 transition-all text-xs font-medium"
            >
              <div className="w-6 h-6 rounded-lg bg-zinc-100 text-zinc-950 flex items-center justify-center font-bold text-xs uppercase">
                {travelerName.charAt(0)}
              </div>
              <span className="hidden sm:inline text-zinc-200">{travelerName}</span>
            </Link>
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
