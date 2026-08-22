import { Metadata } from "next"
import Link from "next/link"
import { SignupForm } from "@/components/auth/signup-form"
import { GlobeTrotterLogo } from "@/components/layout/globe-trotter-logo"

export const metadata: Metadata = {
  title: "Sign Up | GlobeTrotter",
  description: "Create your GlobeTrotter account to plan and save multi-city travel journeys",
}

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#fafafa] flex items-center justify-center p-4 py-12 font-sans antialiased">
      <div className="w-full max-w-md bg-white rounded-3xl border border-zinc-200 p-8 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-col items-center text-center space-y-3">
          <GlobeTrotterLogo className="w-8 h-8" showSubtext={false} />
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-950">
              Create Your Account
            </h1>
            <p className="text-xs text-zinc-500 font-light">
              Begin planning, structuring, and sharing multi-city expeditions.
            </p>
          </div>
        </div>

        <SignupForm />

        <div className="text-center pt-2 text-xs font-sans text-zinc-500 border-t border-zinc-100">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-zinc-950 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
