"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  User,
  Mail,
  Shield,
  KeyRound,
  Globe2,
  Coins,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Sparkles,
  Camera,
  Trash2,
  Save,
  ArrowLeft,
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

interface UserProfileData {
  id: string
  name: string | null
  email: string | null
  image: string | null
  role: string
  preferences?: {
    currency: string
    language: string
  } | null
}

interface ProfileSettingsFormProps {
  initialUser: UserProfileData
}

const AVATAR_PRESETS = [
  {
    name: "Alpine Explorer",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Urban Wanderer",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Ocean Voyager",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Desert Nomad",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Global Flâneur",
    url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
  },
]

const CURRENCIES = [
  { code: "USD", symbol: "$", label: "US Dollar (USD)" },
  { code: "EUR", symbol: "€", label: "Euro (EUR)" },
  { code: "GBP", symbol: "£", label: "British Pound (GBP)" },
  { code: "INR", symbol: "₹", label: "Indian Rupee (INR)" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen (JPY)" },
  { code: "CAD", symbol: "CA$", label: "Canadian Dollar (CAD)" },
  { code: "AUD", symbol: "AU$", label: "Australian Dollar (AUD)" },
  { code: "CHF", symbol: "CHF", label: "Swiss Franc (CHF)" },
  { code: "SGD", symbol: "SG$", label: "Singapore Dollar (SGD)" },
]

const LANGUAGES = [
  { code: "en", label: "English (US)" },
  { code: "es", label: "Español (Spanish)" },
  { code: "fr", label: "Français (French)" },
  { code: "de", label: "Deutsch (German)" },
  { code: "ja", label: "日本語 (Japanese)" },
  { code: "it", label: "Italiano (Italian)" },
]

export function ProfileSettingsForm({ initialUser }: ProfileSettingsFormProps) {
  const router = useRouter()
  const { data: session, update: updateSession } = useSession()

  // Profile Form States
  const [name, setName] = useState(initialUser.name || "")
  const [email, setEmail] = useState(initialUser.email || "")
  const [imageUrl, setImageUrl] = useState(initialUser.image || "")
  const [currency, setCurrency] = useState(initialUser.preferences?.currency || "USD")
  const [language, setLanguage] = useState(initialUser.preferences?.language || "en")
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // Password States
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

  // Danger Zone
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : initialUser.email?.slice(0, 2).toUpperCase() || "GT"

  // Handle Profile & Preferences Update
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Please enter a valid full name")
      return
    }

    setIsSavingProfile(true)
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim() || undefined,
          image: imageUrl.trim() || null,
          currency,
          language,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || "Failed to update profile")
      }

      toast.success("Profile and preferences saved successfully!")
      // Sync NextAuth session client-side
      await updateSession({
        name: name.trim(),
        email: email.trim() || undefined,
        image: imageUrl.trim() || null,
      })
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "An error occurred while saving profile")
    } finally {
      setIsSavingProfile(false)
    }
  }

  // Handle Password Change
  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!currentPassword) {
      toast.error("Please enter your current password")
      return
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    setIsUpdatingPassword(true)
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || "Failed to update password")
      }

      toast.success("Password updated successfully!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      toast.error(error.message || "Failed to change password")
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  // Handle Account Deletion
  async function handleDeleteAccount() {
    if (deleteConfirmText !== "DELETE MY ACCOUNT") {
      toast.error('Please type "DELETE MY ACCOUNT" to confirm')
      return
    }

    setIsDeleting(true)
    try {
      const res = await fetch("/api/user", { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete account")

      toast.success("Your account and all associated data have been deleted.")
      signOut({ callbackUrl: "/" })
    } catch (error) {
      toast.error("Failed to delete account. Please try again.")
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-10">
      {/* Top Header with Back Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-500 hover:text-zinc-950 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Profile</span>
          </Link>
          <h1 className="text-3xl sm:text-4xl font-light text-zinc-950 tracking-tight">
            Account <span className="font-semibold">Settings</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Manage your traveler identity, global preferences, and security.
          </p>
        </div>

        <Link
          href="/profile"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-mono font-medium transition-all"
        >
          <span>View Public Dossier</span>
        </Link>
      </div>

      {/* 1. PERSONAL INFORMATION & IDENTITY */}
      <form onSubmit={handleSaveProfile} className="space-y-8">
        <div className="rounded-3xl bg-white border border-zinc-200 shadow-xs overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-white flex items-center justify-center shadow-xs">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-zinc-950">Traveler Identity</h2>
                <p className="text-xs text-zinc-500">Your public name and profile avatar</p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-mono text-zinc-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Passport ID Active
            </span>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Avatar Selector & Preview */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-3xl overflow-hidden bg-zinc-900 border-2 border-zinc-200 shadow-md flex items-center justify-center">
                  {imageUrl ? (
                    <img src={imageUrl} alt={name || "Avatar"} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold font-mono text-white">{initials}</span>
                  )}
                </div>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    aria-label="Remove photo"
                    className="absolute -top-2 -right-2 p-1.5 rounded-full bg-rose-500 text-white hover:bg-rose-600 shadow-sm transition-all"
                    title="Remove Avatar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex-1 space-y-3">
                <label className="text-xs font-mono uppercase tracking-wider text-zinc-600 font-semibold">
                  Select a Travel Avatar Preset
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className={`relative rounded-2xl overflow-hidden border-2 transition-all p-0.5 ${
                        imageUrl === preset.url
                          ? "border-zinc-950 ring-2 ring-zinc-950/20 scale-105"
                          : "border-zinc-200 hover:border-zinc-400"
                      }`}
                      title={preset.name}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="text-xs text-zinc-500 font-medium">Or enter a custom image URL:</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="mt-1 w-full px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Name & Email Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-xs font-mono uppercase tracking-wider text-zinc-700 font-semibold"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-xs font-mono uppercase tracking-wider text-zinc-700 font-semibold"
                >
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 transition-all"
                  />
                  <Mail className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. TRAVEL PREFERENCES */}
        <div className="rounded-3xl bg-white border border-zinc-200 shadow-xs overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-zinc-100 bg-zinc-50/50 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-white flex items-center justify-center shadow-xs">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-zinc-950">Travel & Currency Preferences</h2>
              <p className="text-xs text-zinc-500">Configure your default currencies and locale</p>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="currency"
                className="text-xs font-mono uppercase tracking-wider text-zinc-700 font-semibold flex items-center gap-2"
              >
                <Coins className="w-3.5 h-3.5 text-zinc-500" />
                <span>Primary Currency</span>
              </label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 transition-all font-mono"
              >
                {CURRENCIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.symbol} — {c.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-zinc-500">
                Used to compute estimated expedition costs and itinerary budgets.
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="language"
                className="text-xs font-mono uppercase tracking-wider text-zinc-700 font-semibold flex items-center gap-2"
              >
                <Globe2 className="w-3.5 h-3.5 text-zinc-500" />
                <span>Language & Region</span>
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 transition-all font-mono"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-zinc-500">
                Preferred language for interface and travel alerts.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 bg-zinc-50/50 border-t border-zinc-100 flex items-center justify-end">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-950 text-white font-mono text-xs uppercase tracking-wider font-semibold hover:bg-zinc-800 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
            >
              {isSavingProfile ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* 3. SECURITY & PASSWORD MANAGEMENT */}
      <form onSubmit={handleUpdatePassword} className="rounded-3xl bg-white border border-zinc-200 shadow-xs overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-zinc-100 bg-zinc-50/50 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-zinc-950 text-white flex items-center justify-center shadow-xs">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">Security & Authentication</h2>
            <p className="text-xs text-zinc-500">Update your account credentials and password</p>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="currentPassword"
              className="text-xs font-mono uppercase tracking-wider text-zinc-700 font-semibold"
            >
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 transition-all font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="newPassword"
                className="text-xs font-mono uppercase tracking-wider text-zinc-700 font-semibold"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 transition-all font-mono"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-xs font-mono uppercase tracking-wider text-zinc-700 font-semibold"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-sm text-zinc-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 transition-all font-mono"
              />
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 bg-zinc-50/50 border-t border-zinc-100 flex items-center justify-end">
          <button
            type="submit"
            disabled={isUpdatingPassword || !currentPassword || !newPassword}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-950 text-white font-mono text-xs uppercase tracking-wider font-semibold hover:bg-zinc-800 transition-all shadow-sm hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40"
          >
            {isUpdatingPassword ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Updating Password...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Update Password</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* 4. DANGER ZONE */}
      <div className="rounded-3xl bg-rose-50/40 border border-rose-200 shadow-xs overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-rose-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-rose-950">Danger Zone</h2>
            <p className="text-xs text-rose-700">Permanent account and expedition data deletion</p>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          <p className="text-sm text-zinc-700 leading-relaxed">
            Deleting your account will permanently purge all your planned trips, multi-city itineraries,
            budget records, and saved bucket list destinations. This action cannot be reversed.
          </p>

          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-xs"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Account</span>
            </button>
          ) : (
            <div className="p-5 rounded-2xl bg-white border border-rose-300 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-rose-900">
                  Type <span className="underline decoration-rose-500">DELETE MY ACCOUNT</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE MY ACCOUNT"
                  className="w-full px-4 py-2 rounded-xl bg-rose-50/50 border border-rose-300 text-sm text-rose-950 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || deleteConfirmText !== "DELETE MY ACCOUNT"}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-xs disabled:opacity-40"
                >
                  {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Confirm Permanent Deletion</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setDeleteConfirmText("")
                  }}
                  className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-mono text-xs transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
