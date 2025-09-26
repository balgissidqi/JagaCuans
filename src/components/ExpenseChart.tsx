import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/integrations/supabase/client"

type Period = "daily" | "weekly" | "monthly"

interface ChartData {
  name: string
  amount: number
}

export function ExpenseChart() {
  const [period, setPeriod] = useState<Period>("weekly")
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExpenseData()
  }, [period])

  const fetchExpenseData = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) return

      const now = new Date()
      let startDate: Date
      let groupBy: string

      switch (period) {
        case "daily":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          groupBy = "day"
          break
        case "weekly":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          groupBy = "day"
          break
        case "monthly":
          startDate = new Date(now.getFullYear(), 0, 1)
          groupBy = "month"
          break
        default:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          groupBy = "day"
      }

      // First get user's budgets
      const { data: budgets } = await supabase
        .from('budgeting')
        .select('id')
        .eq('user_id', user.id)

      if (!budgets || budgets.length === 0) {
        setChartData([])
        return
      }

      const budgetIds = budgets.map(b => b.id)

      // Then get spending data from spending_tracker
      const { data: spendings } = await supabase
        .from('spending_tracker')
        .select('amount, created_at')
        .in('budget_id', budgetIds)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true })

      if (spendings) {
        const processedData = processTransactionData(spendings, period)
        setChartData(processedData)
      }
    } catch (error) {
      console.error('Error fetching expense data:', error)
    } finally {
      setLoading(false)
    }
  }

  const processTransactionData = (spendings: any[], period: Period): ChartData[] => {
    const dataMap = new Map<string, number>()

    spendings.forEach(spending => {
      const date = new Date(spending.created_at)
      let key: string

      switch (period) {
        case "daily":
          key = date.getDate().toString()
          break
        case "weekly":
          const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
          key = dayNames[date.getDay()]
          break
        case "monthly":
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
          key = monthNames[date.getMonth()]
          break
        default:
          key = date.getDate().toString()
      }

      dataMap.set(key, (dataMap.get(key) || 0) + Math.abs(spending.amount))
    })

    // Generate complete dataset with zero values for missing periods
    let result: ChartData[] = []
    
    if (period === "weekly") {
      const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      result = dayNames.map(day => ({
        name: day,
        amount: dataMap.get(day) || 0
      }))
    } else if (period === "monthly") {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      result = monthNames.map(month => ({
        name: month,
        amount: dataMap.get(month) || 0
      }))
    } else {
      // Daily - show last 30 days
      const now = new Date()
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
      for (let i = 1; i <= daysInMonth; i += 5) {
        result.push({
          name: i.toString(),
          amount: dataMap.get(i.toString()) || 0
        })
      }
    }

    return result
  }


  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium text-muted-foreground">Expense Trend</h4>
        <Select value={period} onValueChange={(value: Period) => setPeriod(value)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="h-48">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="name" 
              className="text-xs fill-muted-foreground"
            />
            <YAxis 
              className="text-xs fill-muted-foreground"
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip 
              formatter={(value) => [formatRupiah(value as number), "Amount"]}
              labelClassName="text-foreground"
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="hsl(var(--expense))" 
              strokeWidth={2}
              dot={{ fill: "hsl(var(--expense))", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: "hsl(var(--expense))", strokeWidth: 2 }}
            />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}