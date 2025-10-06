import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/integrations/supabase/client"
import { formatRupiah } from "@/utils/currency"
import { toast } from "sonner"
import { Utensils, Car, PiggyBank, GraduationCap, MoreHorizontal, CheckCircle, Lock, ArrowLeft } from "lucide-react"
import { CustomCategoryModal } from "@/components/CustomCategoryModal"

const categories = [
  { name: "Food", icon: Utensils, color: "bg-orange-500" },
  { name: "Transport", icon: Car, color: "bg-blue-500" },
  { name: "Fun", icon: PiggyBank, color: "bg-purple-500" },
  { name: "Study", icon: GraduationCap, color: "bg-green-500" },
  { name: "Other", icon: MoreHorizontal, color: "bg-gray-500" }
]

export default function AddBudget() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState("")
  const [formData, setFormData] = useState({
    amount: "" as string | number,
    period: "Monthly",
    notes: ""
  })
  const [loading, setLoading] = useState(false)
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [customCategories, setCustomCategories] = useState<Array<{ category: string; notes: string | null }>>([])

  useEffect(() => {
    fetchCustomCategories()
  }, [])

  const fetchCustomCategories = async () => {
    try {
      const { data, error: userError } = await supabase.auth.getUser()
      const user = data?.user
      if (!user) return

      const { data: budgetData } = await supabase
        .from("budgeting")
        .select("category, notes")
        .eq("user_id", user.id)
        .eq("amount", 0)
        .ilike("notes", "Custom category with icon:%")

      const uniqueCategories =
        budgetData?.filter(
          (item, index, self) => index === self.findIndex((t) => t.category === item.category)
        ) || []

      setCustomCategories(uniqueCategories)
    } catch (error) {
      console.error("Error fetching custom categories:", error)
    }
  }

  const handleCategorySelect = (categoryName: string) => {
    if (categoryName === "Other") {
      setShowCustomModal(true)
    } else {
      setSelectedCategory(categoryName)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCategory) {
      toast.error("Please select a category")
      return
    }

    const amountValue = Number(formData.amount)
    if (!amountValue || amountValue <= 0) {
      toast.error("Budget must be greater than 0")
      return
    }

    setLoading(true)

    try {
      const { data, error: userError } = await supabase.auth.getUser()
      const user = data?.user
      if (userError || !user) {
        toast.error("Please log in to add budget")
        return
      }

      const { data: existingBudgets, error: fetchError } = await supabase
        .from("budgeting")
        .select("*")
        .eq("user_id", user.id)
        .eq("category", selectedCategory)
        .eq("notes", formData.notes || "")
        .gt("amount", 0)

      if (fetchError) throw fetchError

      if (existingBudgets?.length) {
        const existingBudget = existingBudgets[0]
        const newAmount = existingBudget.amount + Math.round(amountValue)

        const { error: updateError } = await supabase
          .from("budgeting")
          .update({
            amount: newAmount,
            period: formData.period,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingBudget.id)

        if (updateError) throw updateError

        const { error: historyError } = await supabase.from("budgeting_history").insert({
          budget_id: existingBudget.id,
          user_id: user.id,
          amount_changed: Math.round(amountValue),
          previous_spent: existingBudget.amount,
          new_spent: newAmount,
          notes: formData.notes || null,
          created_at: new Date().toISOString()
        })

        if (historyError) throw historyError

        toast.success("Budget berhasil diperbarui & history dicatat")
      } else {
        const { data: newBudget, error: insertError } = await supabase
          .from("budgeting")
          .insert({
            category: selectedCategory,
            amount: Math.round(amountValue),
            period: formData.period,
            notes: formData.notes || null,
            user_id: user.id
          })
          .select()
          .single()

        if (insertError) throw insertError

        const { error: historyError } = await supabase.from("budgeting_history").insert({
          budget_id: newBudget.id,
          user_id: user.id,
          amount_changed: Math.round(amountValue),
          previous_spent: 0,
          new_spent: Math.round(amountValue),
          notes: formData.notes || null,
          created_at: new Date().toISOString()
        })

        if (historyError) throw historyError

        toast.success("Budget baru berhasil ditambahkan & history dicatat")
      }

      navigate("/dashboard/budgeting")
    } catch (error: any) {
  console.error("Error adding/updating budget:", error.message || error)
  toast.error(error.message || "Failed to add/update budget")
}
 finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <Card className="bg-card rounded-2xl shadow-lg border-0">
          <CardHeader className="relative">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate("/dashboard/budgeting")}
                  className="h-10 w-10 rounded-full hover:bg-accent"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <CardTitle className="text-2xl font-bold text-foreground">Add Budget</CardTitle>
                  <p className="text-muted-foreground mt-2">Set spending limits for different categories</p>
                </div>
              </div>
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label>Category</Label>
                <div className="grid grid-cols-5 gap-3">
                  {categories.map((category) => (
                    <button
                      key={category.name}
                      type="button"
                      onClick={() => handleCategorySelect(category.name)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        selectedCategory === category.name ? `border-primary bg-primary/10` : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center`}>
                          <category.icon className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xs font-medium text-center">{category.name}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {customCategories.length > 0 && (
                  <div className="mt-4">
                    <Label className="text-sm text-muted-foreground mb-2 block">Custom Categories</Label>
                    <div className="flex flex-wrap gap-2">
                      {customCategories.map((category, index) => {
                        const iconMatch = category.notes?.match(/Custom category with icon: (.+)/)
                        const icon = iconMatch?.[1] ?? "📁"

                        return (
                          <button
                            key={`custom-${index}`}
                            type="button"
                            onClick={() => setSelectedCategory(category.category)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all duration-200 ${
                              selectedCategory === category.category ? "border-primary bg-primary/10" : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <span className="text-lg">{icon}</span>
                            <span className="text-sm font-medium">{category.category}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Budget Amount</Label>
                <div className="relative flex items-center">
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value === "" ? "" : Number(e.target.value) })
                    }
                    placeholder="RP 0"
                    className="pr-16"
                    required
                    min="0"
                    step="1"
                  />
                  <span className="absolute right-3 text-muted-foreground font-medium">IDR</span>
                </div>
                {formData.amount && (
                  <p className="text-sm text-muted-foreground">{formatRupiah(Math.round(Number(formData.amount)) || 0)}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Period</Label>
                <Select value={formData.period} onValueChange={(value) => setFormData({ ...formData, period: value })}>
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
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any additional notes about this budget..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-base font-medium"
                disabled={loading}
              >
                <Lock className="h-4 w-4 mr-2" />
                {loading ? "Saving Budget..." : "Save Budget"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <CustomCategoryModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onSuccess={() => {
          fetchCustomCategories()
          toast.success("Custom category created! You can now select it.")
        }}
      />
    </div>
  )
}
