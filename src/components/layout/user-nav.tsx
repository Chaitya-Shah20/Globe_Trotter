"use client"

import { signOut } from "next-auth/react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, Shield, LogOut, Compass, Map } from "lucide-react"

interface UserNavProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
  }
}

export function UserNav({ user }: UserNavProps) {
  const initials = user.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email?.slice(0, 2).toUpperCase() || "GT"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <button
          type="button"
          aria-label="User profile menu"
          className="flex items-center gap-2 p-1 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors focus:outline-hidden"
        >
          <Avatar className="h-7 w-7 border border-zinc-200 dark:border-zinc-800">
            <AvatarImage src={user.image || ""} alt={user.name || "User"} />
            <AvatarFallback className="text-[10px] font-mono font-bold bg-zinc-900 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      } />
      <DropdownMenuContent className="w-56 p-1.5 shadow-lg border-zinc-200 dark:border-zinc-800 rounded-2xl" align="end">
        <DropdownMenuLabel className="font-normal px-2.5 py-2">
          <div className="flex flex-col space-y-1">
            <p className="text-xs font-bold leading-none text-zinc-950 dark:text-white">
              {user.name || "Traveler"}
            </p>
            <p className="text-[11px] font-mono leading-none text-zinc-400 truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
        <DropdownMenuGroup>
          <Link href="/dashboard">
            <DropdownMenuItem className="cursor-pointer rounded-xl text-xs gap-2 py-2">
              <Compass className="w-3.5 h-3.5 text-zinc-500" />
              <span>Dashboard</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/trips">
            <DropdownMenuItem className="cursor-pointer rounded-xl text-xs gap-2 py-2">
              <Map className="w-3.5 h-3.5 text-zinc-500" />
              <span>My Trips</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/profile">
            <DropdownMenuItem className="cursor-pointer rounded-xl text-xs gap-2 py-2">
              <User className="w-3.5 h-3.5 text-zinc-500" />
              <span>User Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/profile/settings">
            <DropdownMenuItem className="cursor-pointer rounded-xl text-xs gap-2 py-2">
              <Settings className="w-3.5 h-3.5 text-zinc-500" />
              <span>Settings</span>
            </DropdownMenuItem>
          </Link>
          <Link href="/admin">
            <DropdownMenuItem className="cursor-pointer rounded-xl text-xs gap-2 py-2 font-medium text-zinc-950 dark:text-white">
              <Shield className="w-3.5 h-3.5 text-zinc-950 dark:text-white" />
              <span>Admin Dashboard</span>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
        <DropdownMenuItem
          className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30 rounded-xl text-xs gap-2 py-2"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
