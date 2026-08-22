"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { Loader2, AlertTriangle } from "lucide-react"

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  if (!session?.user) {
    return null
  }

  async function handleDeleteAccount() {
    if (!confirm("Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently delete all your trips and data.")) {
      return
    }
    
    setIsDeleting(true)
    try {
      const res = await fetch("/api/user", { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete account")
      
      toast.success("Account deleted")
      signOut({ callbackUrl: "/" })
    } catch (error) {
      toast.error("Failed to delete account. Please try again.")
      setIsDeleting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and settings.</p>
      </div>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue={session.user.name || ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue={session.user.email || ""} disabled />
            <p className="text-xs text-muted-foreground">Your email address cannot be changed.</p>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button disabled={isLoading}>
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </CardFooter>
      </Card>

      <Card className="border-destructive/20 shadow-sm">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Danger Zone
          </CardTitle>
          <CardDescription>
            Permanently remove your account and all associated data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">
            <strong>Warning:</strong> Deleting your account will remove all your planned trips, itineraries, budget tracking, and saved destinations. This action is irreversible.
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button variant="destructive" onClick={handleDeleteAccount} disabled={isDeleting}>
            {isDeleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Delete Account
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
