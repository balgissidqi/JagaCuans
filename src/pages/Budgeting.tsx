import { useState, useEffect, useCallback } from "react"
import { Plus, Wallet, History } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/lib/supabaseClient"
import { formatRupiah } from "@/utils/currency"
import { toast } from "sonner"
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js"

interface Budget {
  id: string
  category: string
  amount: number
  spent: number
  user_id: string
  notes?: string
  period?: "Weekly" | "Monthly" | "Yearly"
}

interface BudgetHistory {
  history_id: string
  budget_id: string
  user_id: string
  amount_changed: number
  previous_spent: number
  new_spent: number
  notes: string | null
  created_at: string
}

const categoryColors: Record<string, string> = {
  "Food & Drinks": "bg-orange-500",
  "Transportation": "bg-blue-500",
  "Shopping": "bg-pink-500",
  "Health & Fitness": "bg-green-500",
  "Entertainment": "bg-purple-500",
  "Bills": "bg-yellow-500",
  "Other": "bg-gray-500"
}

export default function Budgeting() {
  const navigate = useNavigate()
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [editForm, setEditForm] = useState({
    amount: "",
    period: "Monthly" as "Weekly" | "Monthly" | "Yearly",
    notes: ""
  })
  const [userId, setUserId] = useState<string | null>(null)
  const [viewingHistory, setViewingHistory] = useState<string | null>(null)
  const [budgetHistory, setBudgetHistory] = useState<BudgetHistory[]>([])

  // Fetch user
  useEffect(() => {
    (async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        navigate("/login")
        return
      }
      setUserId(user.id)
    })()
  }, [navigate])

  // Fetch budgets function
  const fetchBudgets = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from("budgeting")
        .select("*")
        .eq("user_id", userId)
        .gt("amount", 0)
        .order("created_at", { ascending: false })
      if (error) throw error
      setBudgets(data || [])
    } catch (error) {
      console.error("Error fetching budgets:", error)
      toast.error("Failed to load budgets")
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Fetch history for a budget
  const fetchBudgetHistory = useCallback(async (budgetId: string) => {
    try {
      const { data, error } = await supabase
        .from("budgeting_history")
        .select("*")
        .eq("budget_id", budgetId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setBudgetHistory(data || [])
    } catch (error) {
      console.error("Error fetching budget history:", error)
      toast.error("Failed to load history")
    }
  }, [])

  // Initial fetch + realtime subscription for budgets
  useEffect(() => {
    if (!userId) return
    fetchBudgets()

    const channel = supabase
      .channel("budgeting-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "budgeting", filter: `user_id=eq.${userId}` },
        (payload: RealtimePostgresChangesPayload<Budget>) => {
          const newBudget = payload.new as Budget | null
          if (!newBudget) return

          setBudgets(prev => {
            const exists = prev.find(b => b.id === newBudget.id)
            if (exists) {
              return prev.map(b => (b.id === newBudget.id ? newBudget : b))
            } else {
              return [newBudget, ...prev]
            }
          })
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [userId, fetchBudgets])

  // Realtime subscription for budgeting_history
  useEffect(() => {
    if (!userId) return
    const historyChannel = supabase
      .channel("budgeting-history-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "budgeting_history", filter: `user_id=eq.${userId}` },
        (payload: RealtimePostgresChangesPayload<BudgetHistory>) => {
          const newHistory = payload.new as BudgetHistory | null
          if (!newHistory) return

          setBudgetHistory(prev => {
            if (newHistory.budget_id === viewingHistory) {
              return [newHistory, ...prev]
            }
            return prev
          })
        }
      )
      .subscribe()

    return () => supabase.removeChannel(historyChannel)
  }, [userId, viewingHistory])

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget)
    setEditForm({
      amount: budget.amount.toString(),
      period: budget.period || "Monthly",
      notes: budget.notes || ""
    })
  }

  const handleUpdateBudget = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingBudget || !userId) return

    try {
      const newAmount = parseFloat(editForm.amount)

      // Update budgeting table
      const { error: updateError } = await supabase
        .from("budgeting")
        .update({
          amount: newAmount,
          period: editForm.period,
          notes: editForm.notes || null,
          updated_at: new Date().toISOString()
        })
        .eq("id", editingBudget.id)

      if (updateError) throw updateError

      // Insert into history
      const { error: historyError } = await supabase.from("budgeting_history").insert({
        budget_id: editingBudget.id,
        user_id: userId,
        amount_changed: newAmount - editingBudget.amount, 
        previous_spent: editingBudget.spent,             
        new_spent: editingBudget.spent,      
        notes: editForm.notes || null,
        created_at: new Date().toISOString()
      })


      if (historyError) throw historyError

      toast.success("Budget berhasil diperbarui")
      setEditingBudget(null)
      fetchBudgets()
      if (viewingHistory === editingBudget.id) {
        fetchBudgetHistory(editingBudget.id)
      }
    } catch (error) {
      console.error("Error updating budget:", error)
      toast.error("Failed to update budget")
    }
  }

  const handleDeleteBudget = async (budgetId: string) => {
    if (!confirm("Are you sure you want to delete this budget?")) return

    try {
      const { error } = await supabase.from("budgeting").delete().eq("id", budgetId)
      if (error) throw error
      toast.success("Budget berhasil dihapus")
      fetchBudgets()
    } catch (error) {
      console.error("Error deleting budget:", error)
      toast.error("Failed to delete budget")
    }
  }

  const handleViewHistory = async (budgetId: string) => {
    setViewingHistory(budgetId)
    fetchBudgetHistory(budgetId)
  }

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const remaining = totalBudget - totalSpent

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Budget Overview</h1>
          <p className="text-muted-foreground mt-1">Manage your spending categories</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => navigate("/dashboard/budgeting/add")}>
          <Plus className="h-4 w-4" /> Add Budget
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-2xl shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatRupiah(totalBudget)}</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatRupiah(totalSpent)}</div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${remaining >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatRupiah(remaining)}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-soft">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0} className="w-full" />
            <p className="text-xs text-muted-foreground mt-2">
              {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% of budget used
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Budget List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map(budget => {
          const progress = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0
          const isOver = budget.spent > budget.amount
          const colorClass = categoryColors[budget.category] || categoryColors.Other

          return (
            <Card key={budget.id} className="rounded-2xl shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">{budget.category}</span>
                    {budget.notes && <span className="text-sm text-muted-foreground">({budget.notes})</span>}
                  </div>
                  <div className={`w-4 h-4 rounded-full ${colorClass}`}></div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Spent</span>
                  <span className={isOver ? "text-red-600 font-medium" : "text-foreground"}>
                    {formatRupiah(budget.spent)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="text-foreground">{formatRupiah(budget.amount)}</span>
                </div>
                <Progress value={Math.min(progress, 100)} className="w-full" />
                <div className="flex justify-between text-xs">
                  <span className={isOver ? "text-red-600" : "text-muted-foreground"}>{Math.round(progress)}%</span>
                  <span className={isOver ? "text-red-600 font-medium" : "text-green-600"}>
                    {isOver ? "Over Budget!" : formatRupiah(budget.amount - budget.spent) + " left"}
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditBudget(budget)}>
                    Update
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleViewHistory(budget.id)}>
                    <History className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" className="flex-1" onClick={() => handleDeleteBudget(budget.id)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {budgets.length === 0 && (
        <Card className="rounded-2xl shadow-soft p-12 text-center">
          <div className="text-muted-foreground">
            <Wallet className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Belum ada budget</h3>
            <p className="text-sm">Tambahkan budget pertama untuk mulai melacak pengeluaran Anda</p>
          </div>
        </Card>
      )}

      {/* Edit Modal */}
      <Dialog open={!!editingBudget} onOpenChange={() => setEditingBudget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Budget - {editingBudget?.category}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateBudget} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-amount">Budget Amount</Label>
              <Input
                id="edit-amount"
                type="number"
                value={editForm.amount}
                onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                placeholder="0"
                required
                min="0"
                step="1"
              />
            </div>

            <div className="space-y-2">
              <Label>Period</Label>
              <Select value={editForm.period} onValueChange={(value) => setEditForm({ ...editForm, period: value as "Weekly" | "Monthly" | "Yearly" })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={editForm.notes}
                onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                placeholder="Add notes..."
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setEditingBudget(null)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                Update Budget
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* History Modal */}
      <Dialog open={!!viewingHistory} onOpenChange={() => setViewingHistory(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Budget History</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {budgetHistory.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No history yet</p>
            ) : (
              budgetHistory.map((history) => (
                <Card key={history.history_id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {history.amount_changed >= 0 ? "+" : ""}{formatRupiah(history.amount_changed)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatRupiah(history.previous_spent)} → {formatRupiah(history.new_spent)}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(history.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                  {history.notes && (
                    <p className="text-xs text-muted-foreground border-t pt-2">{history.notes}</p>
                  )}
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
