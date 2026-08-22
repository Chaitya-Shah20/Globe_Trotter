"use client"

import { useState, useMemo } from "react"
import {
  Wallet,
  Plus,
  Trash2,
  AlertTriangle,
  Building,
  Plane,
  Compass,
  Utensils,
  CheckCircle2,
  PieChart as PieChartIcon,
  BarChart3,
  Calendar,
  Layers,
} from "lucide-react"
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { toast } from "sonner"

export interface ExpenseItem {
  id: string
  tripId?: string
  category: string // transport, stay, meals, activities, other
  amount: number
  currency?: string
  description: string
  date: string
}

interface BudgetDashboardProps {
  tripId: string
  targetBudget: number
  totalDays: number
  expenses: ExpenseItem[]
  onAddExpense?: (expense: ExpenseItem) => void
  onDeleteExpense?: (expenseId: string) => void
}

const CATEGORY_COLORS: Record<string, string> = {
  stay: "#18181b", // Deep Charcoal / Black
  transport: "#3f3f46", // Dark Gray
  activities: "#71717a", // Neutral Zinc
  meals: "#a1a1aa", // Light Zinc
  other: "#d4d4d8", // Pale Gray
}

export function BudgetDashboard({
  tripId,
  targetBudget,
  totalDays,
  expenses,
  onAddExpense,
  onDeleteExpense,
}: BudgetDashboardProps) {
  const [localExpenses, setLocalExpenses] = useState<ExpenseItem[]>(expenses)
  const [isAddingExpense, setIsAddingExpense] = useState(false)
  const [newCategory, setNewCategory] = useState("activities")
  const [newAmount, setNewAmount] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0])



  // Calculations
  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {
      stay: 0,
      transport: 0,
      activities: 0,
      meals: 0,
      other: 0,
    }

    localExpenses.forEach((exp) => {
      const cat = exp.category.toLowerCase()
      if (totals[cat] !== undefined) {
        totals[cat] += Number(exp.amount) || 0
      } else {
        totals.other += Number(exp.amount) || 0
      }
    })

    return totals
  }, [localExpenses])

  const totalSpent = useMemo(() => {
    return Object.values(categoryTotals).reduce((sum, val) => sum + val, 0)
  }, [categoryTotals])

  const remainingBudget = targetBudget - totalSpent
  const isOverBudget = totalSpent > targetBudget && targetBudget > 0
  const avgCostPerDay = totalDays > 0 ? Math.round(totalSpent / totalDays) : Math.round(totalSpent / 1)

  // Chart data
  const pieData = useMemo(() => {
    return [
      { name: "Stay", value: categoryTotals.stay, key: "stay" },
      { name: "Transport", value: categoryTotals.transport, key: "transport" },
      { name: "Activities", value: categoryTotals.activities, key: "activities" },
      { name: "Meals", value: categoryTotals.meals, key: "meals" },
      { name: "Other", value: categoryTotals.other, key: "other" },
    ].filter((item) => item.value > 0)
  }, [categoryTotals])

  const barData = useMemo(() => {
    return [
      { name: "Stay", amount: categoryTotals.stay },
      { name: "Transport", amount: categoryTotals.transport },
      { name: "Activities", amount: categoryTotals.activities },
      { name: "Meals", amount: categoryTotals.meals },
      { name: "Other", amount: categoryTotals.other },
    ]
  }, [categoryTotals])

  // Add Expense Submit Handler
  async function handleAddExpenseSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!newAmount || Number(newAmount) <= 0) {
      toast.error("Please enter a valid amount.")
      return
    }

    if (!newDescription.trim()) {
      toast.error("Please enter an expense description.")
      return
    }

    const newExp: ExpenseItem = {
      id: `exp-${Date.now()}`,
      tripId,
      category: newCategory,
      amount: Number(newAmount),
      description: newDescription.trim(),
      date: newDate,
    }

    // Call API if available
    try {
      await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExp),
      })
    } catch (err) {
      // fallback to local
    }

    setLocalExpenses((prev) => [newExp, ...prev])
    if (onAddExpense) onAddExpense(newExp)

    // Reset Form
    setNewAmount("")
    setNewDescription("")
    setIsAddingExpense(false)
    toast.success(`Logged $${newExp.amount} for ${newExp.description}`)
  }

  // Delete Expense Handler
  async function handleDeleteExpense(expenseId: string) {
    try {
      await fetch(`/api/expenses/${expenseId}`, {
        method: "DELETE",
      })
    } catch (err) {
      // fallback
    }

    setLocalExpenses((prev) => prev.filter((e) => e.id !== expenseId))
    if (onDeleteExpense) onDeleteExpense(expenseId)
    toast.success("Expense removed")
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-[0.2em] text-zinc-500 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 inline-block" />
            <span>Financial Telemetry</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950 mt-1">
            Budget Planner & Analytics
          </h2>
          <p className="text-xs text-zinc-500 font-mono">
            Track allocations, daily expense averages, and category distribution.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddingExpense(true)}
          className="px-5 py-2.5 rounded-xl bg-zinc-950 text-white font-mono text-xs uppercase tracking-wider font-semibold shadow-xs hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Expense</span>
        </button>
      </div>

      {/* 2. Over-Budget Alert Banner */}
      {isOverBudget && (
        <div className="rounded-2xl border border-zinc-900 bg-zinc-950 text-white p-5 flex items-start gap-3 shadow-md animate-in fade-in">
          <AlertTriangle className="w-5 h-5 text-zinc-300 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-white">
              Over-Budget Alert
            </h4>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              Total expenditure (${totalSpent.toLocaleString("en-US")}) has exceeded your target budget (${targetBudget.toLocaleString("en-US")}) by ${(totalSpent - targetBudget).toLocaleString("en-US")}. Consider adjusting allocations.
            </p>
          </div>
        </div>
      )}

      {/* 3. Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
        <div className="p-5 rounded-2xl border border-zinc-200 bg-white shadow-xs space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">Target Budget</span>
          <span className="text-2xl font-bold text-zinc-950">
            ${targetBudget.toLocaleString("en-US")}
          </span>
          <span className="text-[10px] text-zinc-500 block">Total allowance</span>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-200 bg-white shadow-xs space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">Total Recorded</span>
          <span className="text-2xl font-bold text-zinc-950">
            ${totalSpent.toLocaleString("en-US")}
          </span>
          <span className="text-[10px] text-zinc-500 block">
            {targetBudget > 0 ? `${Math.round((totalSpent / targetBudget) * 100)}% of target` : "Recorded"}
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-200 bg-white shadow-xs space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">Remaining Budget</span>
          <span className={`text-2xl font-bold ${remainingBudget < 0 ? "text-zinc-900 line-through" : "text-zinc-950"}`}>
            ${Math.max(0, remainingBudget).toLocaleString("en-US")}
          </span>
          <span className="text-[10px] text-zinc-500 block">
            {remainingBudget < 0 ? `-$${Math.abs(remainingBudget)} deficit` : "Available headroom"}
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-zinc-200 bg-white shadow-xs space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">Avg Cost / Day</span>
          <span className="text-2xl font-bold text-zinc-950">
            ${avgCostPerDay.toLocaleString("en-US")}
          </span>
          <span className="text-[10px] text-zinc-500 block">across {totalDays} expedition days</span>
        </div>
      </div>

      {/* 4. Category Breakdown Progress Bar */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-mono uppercase tracking-wider font-bold text-zinc-900">
            Category Allocation Split
          </h3>
          <span className="text-xs font-mono text-zinc-500">
            {localExpenses.length} entries recorded
          </span>
        </div>

        {/* Multi-segment Monochrome Bar */}
        <div className="h-3 w-full bg-zinc-100 rounded-full overflow-hidden flex">
          {totalSpent > 0 && (
            <>
              <div
                style={{ width: `${(categoryTotals.stay / totalSpent) * 100}%` }}
                className="bg-zinc-950 h-full border-r border-white"
                title="Stay"
              />
              <div
                style={{ width: `${(categoryTotals.transport / totalSpent) * 100}%` }}
                className="bg-zinc-700 h-full border-r border-white"
                title="Transport"
              />
              <div
                style={{ width: `${(categoryTotals.activities / totalSpent) * 100}%` }}
                className="bg-zinc-500 h-full border-r border-white"
                title="Activities"
              />
              <div
                style={{ width: `${(categoryTotals.meals / totalSpent) * 100}%` }}
                className="bg-zinc-400 h-full border-r border-white"
                title="Meals"
              />
              <div
                style={{ width: `${(categoryTotals.other / totalSpent) * 100}%` }}
                className="bg-zinc-300 h-full"
                title="Other"
              />
            </>
          )}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-zinc-950 shrink-0" />
            <div>
              <span className="text-zinc-500 text-[10px] block">Stay</span>
              <span className="font-bold text-zinc-950">${categoryTotals.stay.toLocaleString("en-US")}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-zinc-700 shrink-0" />
            <div>
              <span className="text-zinc-500 text-[10px] block">Transport</span>
              <span className="font-bold text-zinc-950">${categoryTotals.transport.toLocaleString("en-US")}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-zinc-500 shrink-0" />
            <div>
              <span className="text-zinc-500 text-[10px] block">Activities</span>
              <span className="font-bold text-zinc-950">${categoryTotals.activities.toLocaleString("en-US")}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-zinc-400 shrink-0" />
            <div>
              <span className="text-zinc-500 text-[10px] block">Meals</span>
              <span className="font-bold text-zinc-950">${categoryTotals.meals.toLocaleString("en-US")}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-md bg-zinc-300 shrink-0" />
            <div>
              <span className="text-zinc-500 text-[10px] block">Other</span>
              <span className="font-bold text-zinc-950">${categoryTotals.other.toLocaleString("en-US")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Monochrome Charts Grid (Recharts Pie & Bar Chart) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pie Chart Card */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-zinc-700" />
              <h3 className="text-sm font-mono uppercase tracking-wider font-bold text-zinc-900">
                Expenditure Distribution
              </h3>
            </div>
          </div>

          <div className="h-64 w-full">
            {pieData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs font-mono text-zinc-400">
                No recorded expense data to render chart
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CATEGORY_COLORS[entry.key] || "#71717a"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`$${Number(value).toLocaleString("en-US")}`, "Amount"]}
                    contentStyle={{
                      backgroundColor: "#09090b",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                      fontFamily: "monospace",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Bar Chart Card */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-zinc-700" />
              <h3 className="text-sm font-mono uppercase tracking-wider font-bold text-zinc-900">
                Category Comparison (USD)
              </h3>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#71717a" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#71717a" }} />
                <Tooltip
                  formatter={(val: any) => [`$${Number(val).toLocaleString("en-US")}`, "Total"]}
                  contentStyle={{
                    backgroundColor: "#09090b",
                    borderRadius: "12px",
                    border: "none",
                    color: "#fff",
                    fontSize: "12px",
                    fontFamily: "monospace",
                  }}
                />
                <Bar dataKey="amount" fill="#18181b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 6. Add Expense Inline Form (When Toggled) */}
      {isAddingExpense && (
        <form
          onSubmit={handleAddExpenseSubmit}
          className="rounded-3xl border-2 border-dashed border-zinc-300 bg-zinc-50/80 p-6 sm:p-7 space-y-5 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider font-bold text-zinc-950">
              <Plus className="w-4 h-4" />
              <span>Log New Expense Entry</span>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingExpense(false)}
              className="text-xs font-mono uppercase text-zinc-500 hover:text-zinc-950"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-600 block">
                Description *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Louvre Museum Guided Entry, Eurostar Train Ticket"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-zinc-300 bg-white text-xs text-zinc-950 focus:outline-hidden focus:ring-2 focus:ring-zinc-950 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-600 block">
                Amount (USD $) *
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                required
                placeholder="45.00"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-zinc-300 bg-white text-xs font-mono text-zinc-950 focus:outline-hidden focus:ring-2 focus:ring-zinc-950"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-600 block">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-zinc-300 bg-white text-xs font-mono text-zinc-950 focus:outline-hidden focus:ring-2 focus:ring-zinc-950"
              >
                <option value="activities">Activities & Sightseeing</option>
                <option value="stay">Stay & Accommodation</option>
                <option value="transport">Transport & Transit</option>
                <option value="meals">Meals & Dining</option>
                <option value="other">Other Incidentals</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-zinc-600 block">
                Expense Date
              </label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl border border-zinc-300 bg-white text-xs font-mono text-zinc-950 focus:outline-hidden focus:ring-2 focus:ring-zinc-950"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingExpense(false)}
              className="px-4 py-2 rounded-xl text-xs font-mono uppercase text-zinc-600 hover:bg-zinc-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-zinc-950 text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-xs hover:bg-zinc-800 transition-all"
            >
              Save Expense
            </button>
          </div>
        </form>
      )}

      {/* 7. Detailed Recorded Expenses Ledger */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-7 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
          <h3 className="text-base font-bold text-zinc-950 tracking-tight">
            Recorded Ledger Entries
          </h3>
          <span className="text-xs font-mono text-zinc-500">
            Total: ${totalSpent.toLocaleString("en-US")}
          </span>
        </div>

        {localExpenses.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-zinc-400">
            No expenses logged yet. Click "+ Add Expense" to record an item.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {localExpenses.map((exp) => (
              <div
                key={exp.id}
                className="py-3.5 flex items-center justify-between gap-4 text-xs font-sans group hover:bg-zinc-50/60 rounded-xl px-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] uppercase font-bold px-2 py-1 rounded-md bg-zinc-100 text-zinc-700">
                    {exp.category}
                  </span>
                  <div>
                    <p className="font-semibold text-zinc-950">{exp.description}</p>
                    <span className="text-[11px] font-mono text-zinc-400">
                      {new Date(exp.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-mono text-sm font-bold text-zinc-950">
                    ${Number(exp.amount).toLocaleString("en-US")}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteExpense(exp.id)}
                    aria-label="Delete expense"
                    className="text-zinc-400 hover:text-red-600 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
