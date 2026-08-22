import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { UserNav } from "@/components/layout/user-nav"
import { NotificationsPopover } from "@/components/layout/notifications-popover"
import { GlobeTrotterLogo } from "@/components/layout/globe-trotter-logo"
import { Plus } from "lucide-react"

export async function Navbar() {
  let session = null
  try {
    session = await getServerSession(authOptions)
  } catch (e) {
    // Graceful fallback
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/90 backdrop-blur-md dark:bg-zinc-950/90 dark:border-zinc-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Navigation: Logo & Main Navigation Links */}
        <div className="flex items-center gap-8">
          <GlobeTrotterLogo className="w-6 h-6" />

          <nav className="hidden md:flex items-center gap-6 text-xs font-mono uppercase tracking-wider">
            <Link
              href="/dashboard"
              className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/trips"
              className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              My Trips
            </Link>
            <Link
              href="/discover"
              className="text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              Discover
            </Link>
          </nav>
        </div>

        {/* Right Actions: Plan Button, Notifications & Profile */}
        <div className="flex items-center gap-3">
          <Link href="/trips/new">
            <button
              type="button"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-mono uppercase tracking-wider font-semibold shadow-xs hover:opacity-90 active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Plan Trip</span>
            </button>
          </Link>

          <NotificationsPopover />

          {session?.user ? (
            <UserNav user={session.user} />
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider font-medium text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors"
                >
                  Sign In
                </button>
              </Link>
              <Link href="/signup">
                <button
                  type="button"
                  className="px-3.5 py-1.5 rounded-xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 text-xs font-mono uppercase tracking-wider font-semibold shadow-xs hover:opacity-90 transition-all"
                >
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
