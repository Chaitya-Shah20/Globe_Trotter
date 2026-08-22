import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { GlobeTrotterLogo } from "@/components/layout/globe-trotter-logo"

export const metadata: Metadata = {
  title: "Login | GlobeTrotter",
  description: "Sign in to your GlobeTrotter travel operating system",
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#fafafa] flex items-center justify-center p-4 py-12 font-sans antialiased">
      <div className="w-full max-w-md bg-white rounded-3xl border border-zinc-200 p-8 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <GlobeTrotterLogo className="w-8 h-8" showSubtext={false} />
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
              Welcome Back
            </h1>
            <p className="text-xs text-zinc-500 font-light">
              Sign in to manage and share your multi-city itineraries.
            </p>
          </div>
        </div>

        <Suspense fallback={<div className="text-xs font-mono text-center text-zinc-400 py-6">Loading form...</div>}>
          <LoginForm />
        </Suspense>

        <div className="text-center pt-2 text-xs font-sans text-zinc-500 border-t border-zinc-100">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-zinc-950 hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}
