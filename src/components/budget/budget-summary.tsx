"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts"
import { Wallet, TrendingUp, AlertTriangle } from "lucide-react"

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export function BudgetSummary({ trip }: { trip: any }) {
  // Aggregate expenses by category
  // In a real app, we would sum the expenses table. Here we approximate from the itinerary.
  
  let transport = 0
  let accommodation = 0
  let sightseeing = 0
  let meals = 0
  let other = 0

  trip.stops.forEach((stop: any) => {
    stop.days.forEach((day: any) => {
      day.activities.forEach((item: any) => {
        const cost = item.customCost ?? item.activity.defaultCost
        switch(item.activity.type) {
          case 'TRANSPORT': transport += cost; break;
          case 'ACCOMMODATION': accommodation += cost; break;
          case 'SIGHTSEEING': sightseeing += cost; break;
          case 'MEAL': meals += cost; break;
          default: other += cost; break;
        }
      })
    })
  })

  // Mocking extra expenses from the db relation if they exist
  trip.expenses?.forEach((exp: any) => {
    // If it's linked to an activity, we might double count if we aren't careful.
    // For baseline, we just use the calculated ones from itinerary above + unlinked expenses.
    if (!exp.itineraryActivityId) {
      switch(exp.category) {
        case 'transport': transport += exp.amount; break;
        case 'accommodation': accommodation += exp.amount; break;
        case 'activities': sightseeing += exp.amount; break;
        case 'meals': meals += exp.amount; break;
        default: other += exp.amount; break;
      }
    }
  })

  const totalCost = transport + accommodation + sightseeing + meals + other
  const daysCount = trip.stops.reduce((acc: number, stop: any) => acc + stop.days.length, 0)
  const averagePerDay = daysCount > 0 ? totalCost / daysCount : 0

  const data = [
    { name: 'Transport', value: transport },
    { name: 'Accommodation', value: accommodation },
    { name: 'Sightseeing', value: sightseeing },
    { name: 'Meals', value: meals },
    { name: 'Other', value: other },
  ].filter(d => d.value > 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Total</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Based on planned activities
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averagePerDay.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Across {daysCount} days
            </p>
          </CardContent>
        </Card>
        <Card className="bg-destructive/5 border-destructive/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-destructive">Budget Status</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">On Track</div>
            <p className="text-xs text-destructive/80">
              Set a total budget to track limits
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Visual summary of your planned expenses.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value: any) => `$${Number(value).toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  Add activities with costs to see the breakdown.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Detailed Costs</CardTitle>
            <CardDescription>Line item summary by category.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${item.value.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">{((item.value / totalCost) * 100).toFixed(1)}%</div>
                  </div>
                </div>
              ))}
              {data.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-8">
                  No costs recorded yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
