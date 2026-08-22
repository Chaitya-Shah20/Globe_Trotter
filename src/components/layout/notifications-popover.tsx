"use client"

import { useState } from "react"
import { Bell, Check, Clock, MapPin, Sparkles, X } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

interface Notification {
  id: string
  title: string
  description: string
  time: string
  read: boolean
  type: "trip" | "budget" | "discovery"
}

const initialNotifications: Notification[] = [
  {
    id: "notif-1",
    title: "European Grand Escape Upcoming",
    description: "Your trip to Paris begins in 21 days. Check your checklist.",
    time: "2h ago",
    read: false,
    type: "trip",
  },
  {
    id: "notif-2",
    title: "Budget Optimization Alert",
    description: "High-speed rail fares for Paris → Amsterdam are currently 15% lower.",
    time: "5h ago",
    read: false,
    type: "budget",
  },
  {
    id: "notif-3",
    title: "New Landmark Added in Kyoto",
    description: "Arashiyama Bamboo Grove guide is now featured in Discover.",
    time: "1d ago",
    read: true,
    type: "discovery",
  },
]

export function NotificationsPopover() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  function dismissNotification(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger render={
        <button
          type="button"
          aria-label="View notifications"
          className="relative p-2 rounded-full text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors focus:outline-hidden"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-zinc-950 dark:bg-white ring-2 ring-white dark:ring-zinc-950" />
          )}
        </button>
      } />
      <PopoverContent align="end" className="w-80 sm:w-96 p-0 shadow-lg border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-zinc-900 dark:text-white">
              Notifications
            </span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
                {unreadCount} new
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-[11px] font-mono text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-zinc-400">
              No recent notifications
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 flex items-start gap-3 transition-colors ${
                  n.read ? "bg-white dark:bg-zinc-950 opacity-80" : "bg-zinc-50/50 dark:bg-zinc-900/40"
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5 text-zinc-700 dark:text-zinc-300">
                  {n.type === "trip" && <MapPin className="w-3.5 h-3.5" />}
                  {n.type === "budget" && <Clock className="w-3.5 h-3.5" />}
                  {n.type === "discovery" && <Sparkles className="w-3.5 h-3.5" />}
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-semibold text-zinc-950 dark:text-white truncate">
                      {n.title}
                    </p>
                    <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                      {n.time}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {n.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => dismissNotification(n.id)}
                  aria-label="Dismiss notification"
                  className="text-zinc-400 hover:text-zinc-950 dark:hover:text-white p-0.5 rounded transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
