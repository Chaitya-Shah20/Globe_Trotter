"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import {
  User,
  Lock,
  Globe,
  Trash2,
  LogOut,
  ChevronLeft,
  Loader2,
  Check,
  Shield,
} from "lucide-react"

export default function ProfileSettingsPage() {
  const { data: session, update } = useSession()
  const router = useRouter()

  // Profile Form States
  const [name, setName] = useState(session?.user?.name || "")
  const [image, setImage] = useState(session?.user?.image || "")
  const [language, setLanguage] = useState("en")
  const [currency, setCurrency] = useState("USD")
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // Profile Update Handler
  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault()
    setIsUpdatingProfile(true)

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          image: image.trim(),
          language,
          currency,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "Failed to update profile")
      }

      await update()
      toast.success("Profile preferences saved successfully")
    } catch (err: any) {
      toast.error(err.message || "Could not update profile")
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  // Password Update Handler
  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    setIsUpdatingPassword(true)

    try {
      const res = await fetch("/api/user/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "Failed to change password")
      }

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      toast.success("Password changed successfully")
    } catch (err: any) {
      toast.error(err.message || "Could not change password")
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  // Delete Account Handler
  async function handleDeleteAccount() {
    if (!confirm("Are you sure you want to permanently delete your GlobeTrotter account? This will erase all trips, itineraries, and expenses. This cannot be undone.")) {
      return
    }

    try {
      const res = await fetch("/api/user", {
        method: "DELETE",
      })

      if (!res.ok) {
        throw new Error("Failed to delete account")
      }

      toast.success("Account deleted")
      signOut({ callbackUrl: "/" })
    } catch (err: any) {
      toast.error(err.message || "Could not delete account")
    }
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-950 font-sans antialiased pb-24">
      {/* Top Header & Breadcrumb */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
          <Link
            href="/profile"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-zinc-500 hover:text-zinc-950 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Profile</span>
          </Link>
          <span className="text-xs font-mono uppercase text-zinc-400">Settings</span>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 space-y-10">
        {/* Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 inline-block" />
            <span>User Configuration</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-950">
            Account Settings
          </h1>
          <p className="text-sm text-zinc-600 font-light">
            Update personal information, telemetry standards, and security parameters.
          </p>
        </div>

        {/* 1. Profile Information Card */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
            <User className="w-4 h-4 text-zinc-700" />
            <h3 className="text-base font-bold text-zinc-950">Personal Details & Preferences</h3>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-700 block">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Elena Rostova"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-zinc-300 bg-white text-xs text-zinc-950 focus:outline-hidden focus:ring-2 focus:ring-zinc-950 font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-700 block">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={session?.user?.email || "user@globetrotter.app"}
                  className="w-full h-10 px-3.5 rounded-xl border border-zinc-200 bg-zinc-100 text-xs font-mono text-zinc-500 cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-700 block">
                  Profile Photo URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-zinc-300 bg-white text-xs font-mono text-zinc-950 focus:outline-hidden focus:ring-2 focus:ring-zinc-950"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-700 block">
                  Telemetry Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-zinc-300 bg-white text-xs font-mono text-zinc-950 focus:outline-hidden focus:ring-2 focus:ring-zinc-950"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="px-6 py-2.5 rounded-xl bg-zinc-950 text-white font-mono text-xs uppercase tracking-wider font-semibold hover:bg-zinc-800 transition-all flex items-center gap-2"
              >
                {isUpdatingProfile && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        </div>

        {/* 2. Security & Password Change */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
            <Lock className="w-4 h-4 text-zinc-700" />
            <h3 className="text-base font-bold text-zinc-950">Security & Authentication</h3>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-700 block">
                  Current Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-zinc-300 bg-white text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-zinc-950"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-700 block">
                  New Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-zinc-300 bg-white text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-zinc-950"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-700 block">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-zinc-300 bg-white text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-zinc-950"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="px-6 py-2.5 rounded-xl bg-zinc-950 text-white font-mono text-xs uppercase tracking-wider font-semibold hover:bg-zinc-800 transition-all flex items-center gap-2"
              >
                {isUpdatingPassword && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Change Password</span>
              </button>
            </div>
          </form>
        </div>

        {/* 3. Danger Zone */}
        <div className="rounded-3xl border border-red-200 bg-red-50/30 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-red-100">
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-red-950">Danger Zone</h3>
              <p className="text-xs text-red-700 font-light">
                Permanent actions regarding your account and stored itineraries.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-5 py-2 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-100 text-xs font-mono uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out of session</span>
            </button>

            <button
              type="button"
              onClick={handleDeleteAccount}
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-2xs transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
