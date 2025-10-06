import { useState, useEffect } from "react"
import { ArrowLeft, Check, ArrowDown, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface AddSpendingFormProps {
  onSuccess: () => void
  onBack: () => void
}

type TransactionType = 'spending' | 'income'

interface BudgetCategory {
  id: string
  category: string
  notes: string | null
  amount: number
}


const paymentMethods = [
  'Cash',
  'Transfer',
  'e-Wallet',
  'Credit Card',
  'Debit Card'
]

export function AddSpendingForm({ onSuccess, onBack }: AddSpendingFormProps) {
  const [transactionType, setTransactionType] = useState<TransactionType>('spending')
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    paymentMethod: '',
  })
  const [date, setDate] = useState<Date>(new Date())
  const [loading, setLoading] = useState(false)
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>([])

  useEffect(() => {
    fetchBudgetCategories()
  }, [])

  const fetchBudgetCategories = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('budgeting')
        .select('id, category, notes, amount')
        .eq('user_id', user.id)
        .order('category', { ascending: true })

      if (error) throw error
      setBudgetCategories(data || [])
    } catch (error) {
      console.error('Error fetching budget categories:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error('User not authenticated:', userError)
        toast.error('Please log in to add transactions')
        return
      }

      console.log('Adding transaction:', {
        type: transactionType,
        method: 'manual',
        name: formData.description,
        amount: parseFloat(formData.amount),
        category_id: formData.category || null,
        notes: `Payment: ${formData.paymentMethod}`,
        date: date.toISOString(),
        user_id: user.id
      })

      const { data, error } = await supabase.from('transactions').insert({
        type: transactionType,
        method: 'manual',
        name: formData.description,
        amount: parseFloat(formData.amount),
        category_id: formData.category || null,
        notes: `Payment: ${formData.paymentMethod}`,
        date: date.toISOString(),
        user_id: user.id
      })

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Transaction added successfully:', data)
      toast.success(`${transactionType === 'spending' ? 'Spending' : 'Income'} added successfully!`)
      onSuccess()
    } catch (error) {
      console.error('Error adding transaction:', error)
      toast.error('Failed to add transaction')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-card/50 backdrop-blur-sm">
        <Button variant="ghost" size="sm" onClick={onBack} className="rounded-full">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold text-foreground">Add Transaction</h1>
        <Button 
          type="submit" 
          form="spending-form"
          variant="ghost" 
          size="sm"
          disabled={loading}
          className="rounded-full bg-primary/10 text-primary hover:bg-primary/20"
        >
          <Check className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8 bg-gradient-to-b from-background to-muted/20">
        {/* Toggle */}
        <div className="bg-card rounded-2xl p-2 shadow-sm border">
          <div className="flex rounded-xl bg-muted/50 p-1">
            <button
              type="button"
              onClick={() => setTransactionType('spending')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-200",
                transactionType === 'spending' 
                  ? "bg-expense text-expense-foreground shadow-lg scale-105" 
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              )}
            >
              <ArrowDown className="h-4 w-4" />
              Spending
            </button>
            <button
              type="button"
              onClick={() => setTransactionType('income')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-200",
                transactionType === 'income' 
                  ? "bg-income text-income-foreground shadow-lg scale-105" 
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              )}
            >
              <ArrowUp className="h-4 w-4" />
              Income
            </button>
          </div>
        </div>

        <form id="spending-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Amount */}
          <div className="bg-card rounded-2xl p-6 shadow-sm border space-y-4">
            <Label htmlFor="amount" className="text-base font-semibold text-foreground">Amount</Label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                RP
              </span>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                placeholder="0"
                className="pl-16 h-16 text-2xl font-bold border-0 bg-muted/50 rounded-xl focus:ring-2 focus:ring-primary/20"
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Category */}
          <div className="bg-card rounded-2xl p-6 shadow-sm border space-y-4">
            <Label htmlFor="category-select" className="text-base font-semibold text-foreground">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger id="category-select" className="h-12 border-0 bg-muted/50 rounded-xl">
                <SelectValue placeholder="Select budget category" />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {budgetCategories.length === 0 ? (
                  <div className="p-4 text-sm text-muted-foreground text-center">
                    No budget categories yet. Create one first!
                  </div>
                ) : (
                  budgetCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex flex-col gap-1 py-1">
                        <span className="font-semibold">{category.category}</span>
                        {category.notes && (
                          <span className="text-xs text-muted-foreground">{category.notes}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="bg-card rounded-2xl p-6 shadow-sm border space-y-4">
            <Label htmlFor="description" className="text-base font-semibold text-foreground">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="e.g., Lunch at Canteen"
              className="h-12 border-0 bg-muted/50 rounded-xl text-base"
              required
            />
          </div>

          {/* Date */}
          <div className="bg-card rounded-2xl p-6 shadow-sm border space-y-4">
            <Label className="text-base font-semibold text-foreground">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal h-12 border-0 bg-muted/50 rounded-xl",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-3 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Payment Method */}
          <div className="bg-card rounded-2xl p-6 shadow-sm border space-y-4">
            <Label htmlFor="payment-method" className="text-base font-semibold text-foreground">Payment Method</Label>
            <Select value={formData.paymentMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}>
              <SelectTrigger className="h-12 border-0 bg-muted/50 rounded-xl">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Save Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-16 text-lg font-bold rounded-2xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
          >
            {loading ? 'Saving...' : 'Save Transaction'}
          </Button>
        </form>
      </div>
    </div>
  )
}