"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Shield, ShieldAlert, Trash2 } from "lucide-react"

type AdminUser = {
  id: string
  name: string | null
  email: string | null
  role: string
  createdAt: Date
}

export function UserManagementTable({ initialUsers, currentUserId }: { initialUsers: AdminUser[], currentUserId: string }) {
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[]>(initialUsers)
  const [isLoading, setIsLoading] = useState<string | null>(null)

  async function handleDelete(userId: string, name: string | null) {
    if (!confirm(`Are you sure you want to permanently delete user ${name || userId}? All their trips will also be removed.`)) {
      return
    }

    setIsLoading(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete user")
      
      setUsers(users.filter(u => u.id !== userId))
      toast.success("User deleted successfully")
      router.refresh()
    } catch (error) {
      toast.error("Could not delete user")
    } finally {
      setIsLoading(null)
    }
  }

  async function handleToggleRole(userId: string, currentRole: string) {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN"
    setIsLoading(userId)
    
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole })
      })
      if (!res.ok) throw new Error("Failed to update role")
      
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
      toast.success(`User role updated to ${newRole}`)
      router.refresh()
    } catch (error) {
      toast.error("Could not update role")
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-600">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-xs font-mono uppercase tracking-wider text-zinc-500">
            <tr>
              <th className="px-6 py-4 font-medium">User Details</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Joined</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {users.map((user) => {
              const isSelf = user.id === currentUserId
              
              return (
                <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-zinc-950">{user.name || "Unknown Traveler"}</div>
                    <div className="text-xs text-zinc-500">{user.email || "No email"}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase font-bold ${
                      user.role === "ADMIN" ? "bg-amber-100 text-amber-800" : "bg-zinc-100 text-zinc-600"
                    }`}>
                      {user.role === "ADMIN" ? <ShieldAlert className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleRole(user.id, user.role)}
                        disabled={isSelf || isLoading === user.id}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-mono transition-all ${
                          isSelf 
                            ? "opacity-30 cursor-not-allowed border-transparent" 
                            : "border-zinc-200 hover:border-zinc-400 hover:bg-zinc-100"
                        }`}
                      >
                        {user.role === "ADMIN" ? "Demote" : "Promote"}
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, user.name)}
                        disabled={isSelf || isLoading === user.id}
                        className={`p-1.5 rounded-lg text-red-500 transition-all ${
                          isSelf 
                            ? "opacity-30 cursor-not-allowed" 
                            : "hover:bg-red-50"
                        }`}
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {users.length === 0 && (
        <div className="p-8 text-center text-sm text-zinc-500 font-mono">
          No users found.
        </div>
      )}
    </div>
  )
}
