"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Loader2, ArrowRight, Lock, Mail, Check } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const [email, setEmail] = useState("demo@globetrotter.app")
  const [password, setPassword] = useState("password123")
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!email.trim() || !password) {
      toast.error("Please enter email and password.")
      return
    }

    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Invalid email or password.")
        setIsLoading(false)
        return
      }

      toast.success("Welcome back to GlobeTrotter!")
      router.push(callbackUrl)
      router.refresh()
    } catch (error: any) {
      toast.error("An unexpected error occurred during login.")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-mono uppercase tracking-wider text-zinc-700 font-semibold block">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="email"
            required
            placeholder="demo@globetrotter.app"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-300 bg-white text-xs text-zinc-950 focus:outline-hidden focus:ring-2 focus:ring-zinc-950 font-sans shadow-2xs"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase tracking-wider text-zinc-700 font-semibold block">
            Password
          </label>
          <a
            href="/forgot-password"
            className="text-[11px] font-mono text-zinc-500 hover:text-zinc-950 hover:underline"
          >
            Forgot password?
          </a>
        </div>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-zinc-300 bg-white text-xs font-mono text-zinc-950 focus:outline-hidden focus:ring-2 focus:ring-zinc-950 shadow-2xs"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-950"
          />
          <span className="text-xs text-zinc-600 font-sans">Remember this device</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 rounded-xl bg-zinc-950 text-white font-mono text-xs uppercase tracking-wider font-semibold shadow-xs hover:bg-zinc-800 active:scale-98 transition-all flex items-center justify-center gap-2 mt-2"
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
        <span>{isLoading ? "Authenticating..." : "Sign In"}</span>
      </button>

      {/* Demo Credentials Callout */}
      <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-left font-mono text-[11px] text-zinc-600 space-y-1">
        <span className="font-bold text-zinc-900 block uppercase">Demo Credentials:</span>
        <div className="text-zinc-500">Email: <strong className="text-zinc-900">demo@globetrotter.app</strong></div>
        <div className="text-zinc-500">Password: <strong className="text-zinc-900">password123</strong></div>
      </div>
    </form>
  )
}
