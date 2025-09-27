import { useState, useEffect } from "react"
import { Plus, Wallet, Edit2, Trash2 } from "lucide-react"
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

interface Budget {
  id: string
  category: string
  amount: number
  spent: number
  user_id: string
  notes?: string
  period?: string
}

const categoryColors = {
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
    period: "Monthly",
    notes: ""
  })

  // Get user from auth
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    getCurrentUser()
  }, [])

  useEffect(() => {
    if (userId) {
      fetchBudgets()
      
      // Setup realtime subscription
      const channel = supabase
        .channel('budgeting-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'budgeting' },
          () => fetchBudgets()
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [userId])

  const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
      navigate('/login')
      return
    }
    setUserId(user.id)
  }

  const fetchBudgets = async () => {
    if (!userId) return
    
    try {
      const { data, error } = await supabase
        .from('budgeting')
        .select('*')
        .eq('user_id', userId)
        .gt('amount', 0) // Only show actual budgets, not custom category placeholders
        .order('created_at', { ascending: false })

      if (error) throw error
      setBudgets(data || [])
    } catch (error) {
      console.error('Error fetching budgets:', error)
      toast.error('Failed to load budgets')
    } finally {
      setLoading(false)
    }
  }

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
    if (!editingBudget) return

    try {
      const { error } = await supabase
        .from('budgeting')
        .update({
          amount: parseFloat(editForm.amount),
          period: editForm.period,
          notes: editForm.notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingBudget.id)

      if (error) throw error
      
      toast.success('Budget berhasil diperbarui')
      setEditingBudget(null)
      fetchBudgets()
    } catch (error) {
      console.error('Error updating budget:', error)
      toast.error('Failed to update budget')
    }
  }

  const handleDeleteBudget = async (budgetId: string) => {
    if (!confirm('Are you sure you want to delete this budget?')) return

    try {
      const { error } = await supabase
        .from('budgeting')
        .delete()
        .eq('id', budgetId)

      if (error) throw error
      
      toast.success('Budget berhasil dihapus')
      fetchBudgets()
    } catch (error) {
      console.error('Error deleting budget:', error)
      toast.error('Failed to delete budget')
    }
  }

  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
  const remaining = totalBudget - totalSpent

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Budget Overview</h1>
          <p className="text-muted-foreground mt-1">Manage your spending categories</p>
        </div>
        
        <Button 
          className="flex items-center gap-2"
          onClick={() => navigate('/dashboard/budgeting/add')}
        >
          <Plus className="h-4 w-4" />
          Add Budget
        </Button>
      </div>

      {/* Summary Cards */}
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
            <div className={`text-2xl font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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

      {/* Budget Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => {
          const progressPercentage = budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0
          const isOverBudget = budget.spent > budget.amount
          const colorClass = categoryColors[budget.category as keyof typeof categoryColors] || categoryColors.Other

          return (
            <Card key={budget.id} className="rounded-2xl shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold">{budget.category}</span>
                    {budget.notes && (
                      <span className="text-sm text-muted-foreground">({budget.notes})</span>
                    )}
                  </div>
                  <div className={`w-4 h-4 rounded-full ${colorClass}`}></div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Spent</span>
                  <span className={isOverBudget ? 'text-red-600 font-medium' : 'text-foreground'}>
                    {formatRupiah(budget.spent)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Budget</span>
                  <span className="text-foreground">{formatRupiah(budget.amount)}</span>
                </div>
                <Progress 
                  value={Math.min(progressPercentage, 100)} 
                  className="w-full"
                />
                <div className="flex justify-between text-xs">
                  <span className={`${isOverBudget ? 'text-red-600' : 'text-muted-foreground'}`}>
                    {Math.round(progressPercentage)}%
                  </span>
                  <span className={`${isOverBudget ? 'text-red-600 font-medium' : 'text-green-600'}`}>
                    {isOverBudget ? 'Over Budget!' : formatRupiah(budget.amount - budget.spent) + ' left'}
                  </span>
                </div>
                
                {/* Update and Delete Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEditBudget(budget)}
                  >
                    Update
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleDeleteBudget(budget.id)}
                  >
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

      {/* Edit Budget Modal */}
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
                onChange={(e) => setEditForm({...editForm, amount: e.target.value})}
                placeholder="0"
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label>Period</Label>
              <Select value={editForm.period} onValueChange={(value) => setEditForm({...editForm, period: value})}>
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
                onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
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
    </div>
  )
}