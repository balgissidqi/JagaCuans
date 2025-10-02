import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface SpendingFormProps {
  onSuccess: () => void
  onCancel: () => void
}

interface Category {
  category_id: string
  name: string
  notes?: string
}

export function SpendingForm({ onSuccess, onCancel }: SpendingFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    category_id: '',
    notes: '',
    date: new Date().toISOString().slice(0, 16)
  })
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error('User not authenticated')
        return
      }

      // Fetch existing budgets as categories (only show budgets with amount > 0)
      const { data, error } = await supabase
        .from('budgeting')
        .select('id, category, notes, amount')
        .eq('user_id', user.id)
        .gt('amount', 0)
        .order('category')
        .limit(50)


        // console.log("Fetched budgets:", data)

      if (error) throw error
      
      // Convert budgets to category format
      const budgetCategories = (data || []).map(budget => ({
        category_id: budget.id,
        name: budget.category,
        notes: budget.notes
      }))
      
      setCategories(budgetCategories)
    } catch (error) {
      console.error('Error fetching categories:', error)
      // Add default categories if none exist
      setCategories([
        { category_id: '', name: 'No categories available - Create a budget first' }
      ])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        toast.error('Please log in to add spending')
        return
      }

      // First, get or create a budget for this category
      let budgetId = formData.category_id
      
      if (!budgetId) {
        // Create a default budget if none selected
        const { data: budgetData, error: budgetError } = await supabase
          .from('budgeting')
          .insert({
            category: 'Other',
            amount: 1000000, // Default 1M budget
            user_id: user.id,
            period: 'monthly'
          })
          .select()
          .single()

        if (budgetError) throw budgetError
        budgetId = budgetData.id
      }

      // Insert into spending_tracker table
      const { error } = await supabase.from('spending_tracker').insert({
        budget_id: budgetId,
        description: formData.name,
        amount: parseFloat(formData.amount),
        user_id: user.id
      })

      if (error) throw error

      toast.success('Spending added successfully!')
      onSuccess()
    } catch (error) {
      console.error('Error adding spending:', error)
      toast.error('Failed to add spending')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Spending Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Lunch, Gas, Shopping"
          required
        />
      </div>

      <div>
        <Label htmlFor="amount">Amount (Rp)</Label>
        <Input
          id="amount"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
          placeholder="0"
          required
          min="0"
          step="0.01"
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category_id} onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-background z-50 max-h-[300px]">
            {categories.map((category) => (
              <SelectItem 
                key={category.category_id} 
                value={category.category_id}
                className="cursor-pointer"
              >
                <div className="flex flex-col gap-1 py-0.5 min-w-0">
                  <span className="font-medium text-sm">{category.name}</span>
                  {category.notes && (
                    <span className="text-xs text-muted-foreground/80 break-words whitespace-normal line-clamp-2">
                      Catatan: {category.notes}
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="date">Date & Time</Label>
        <Input
          id="date"
          type="datetime-local"
          value={formData.date}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Additional notes..."
          rows={3}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="flex-1 bg-expense hover:bg-expense/90">
          {loading ? 'Adding...' : 'Add Spending'}
        </Button>
      </div>
    </form>
  )
}