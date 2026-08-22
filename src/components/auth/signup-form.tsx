"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, ArrowRight, Lock, Mail, User } from "lucide-react"

export function SignupForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Please enter your full name.")
      return
    }

    if (!email.trim() || !email.includes("@")) {
      toast.error("Please enter a valid email address.")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password,
          confirmPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create account")
      }

      // Automatically sign in with credentials
      const result = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Account created. Please sign in.")
        router.push("/login")
        return
      }

      toast.success("Account created successfully! Welcome to GlobeTrotter.")
      router.push("/dashboard")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-mono uppercase tracking-wider text-zinc-700 font-semibold block">
          Full Name *
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            required
            placeholder="Elena Rostova"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-300 bg-white text-xs text-zinc-950 focus:outline-hidden focus:ring-2 focus:ring-zinc-950 font-sans shadow-2xs"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-mono uppercase tracking-wider text-zinc-700 font-semibold block">
          Email Address *
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="email"
            required
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-300 bg-white text-xs text-zinc-950 focus:outline-hidden focus:ring-2 focus:ring-zinc-950 font-sans shadow-2xs"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-mono uppercase tracking-wider text-zinc-700 font-semibold block">
          Password *
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="password"
            required
            minLength={6}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-300 bg-white text-xs font-mono text-zinc-950 focus:outline-hidden focus:ring-2 focus:ring-zinc-950 shadow-2xs"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-mono uppercase tracking-wider text-zinc-700 font-semibold block">
          Confirm Password *
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="password"
            required
            minLength={6}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-300 bg-white text-xs font-mono text-zinc-950 focus:outline-hidden focus:ring-2 focus:ring-zinc-950 shadow-2xs"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 rounded-xl bg-zinc-950 text-white font-mono text-xs uppercase tracking-wider font-semibold shadow-xs hover:bg-zinc-800 active:scale-98 transition-all flex items-center justify-center gap-2 mt-2"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
        <span>{isLoading ? "Creating Account..." : "Create Account"}</span>
      </button>
    </form>
  )
}
