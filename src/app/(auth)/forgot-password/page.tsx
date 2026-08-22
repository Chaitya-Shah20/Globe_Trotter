"use client"

import { useState } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Mail, ArrowRight, Loader2, CheckCircle2, ChevronLeft } from "lucide-react"
import { GlobeTrotterLogo } from "@/components/layout/globe-trotter-logo"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      toast.error("Please enter your registered email address.")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })

      if (res.ok) {
        setIsSubmitted(true)
        toast.success("Password reset instructions dispatched.")
      } else {
        throw new Error("Failed to process reset request")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to submit request.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#fafafa] flex items-center justify-center p-4 py-12 font-sans antialiased">
      <div className="w-full max-w-md bg-white rounded-3xl border border-zinc-200 p-8 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <GlobeTrotterLogo className="w-8 h-8" showSubtext={false} />
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
              Reset Password
            </h1>
            <p className="text-xs text-zinc-500 font-light">
              Enter your registered email address to receive password reset instructions.
            </p>
          </div>
        </div>

        {isSubmitted ? (
          <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 text-center space-y-3 animate-in fade-in">
            <CheckCircle2 className="w-8 h-8 text-zinc-950 mx-auto" />
            <h3 className="text-sm font-bold text-zinc-950 font-mono uppercase">Check Your Inbox</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              If an account with <strong className="text-zinc-950">{email}</strong> exists, you will receive an authentication link shortly.
            </p>
            <div className="pt-2">
              <Link href="/login">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl bg-zinc-950 text-white font-mono text-xs uppercase font-semibold"
                >
                  Return to Sign In
                </button>
              </Link>
            </div>
          </div>
        ) : (
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 rounded-xl bg-zinc-950 text-white font-mono text-xs uppercase tracking-wider font-semibold shadow-xs hover:bg-zinc-800 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              <span>{isLoading ? "Sending Link..." : "Send Reset Link"}</span>
            </button>
          </form>
        )}

        <div className="text-center pt-2 text-xs font-sans text-zinc-500 border-t border-zinc-100">
          <Link href="/login" className="inline-flex items-center gap-1 font-semibold text-zinc-950 hover:underline">
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
