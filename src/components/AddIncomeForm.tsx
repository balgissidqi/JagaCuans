// import { useState } from "react"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { supabase } from "@/integrations/supabase/client"
// import { toast } from "sonner"
// import { Database } from "@/types/database.types"

// type AddIncomeFormProps = {
//   isOpen: boolean
//   onClose: () => void
//   onSuccess: () => void
//   onBack: () => void 
// }

// type IncomeInsert = Database["public"]["Tables"]["income"]["Insert"]

// export function AddIncomeForm({ isOpen, onClose, onSuccess }: AddIncomeFormProps) {
//   const [formData, setFormData] = useState({
//     amount: "",
//     category: "",
//     notes: "",
//     date: new Date().toISOString().split("T")[0], // default hari ini
//   })
//   const [loading, setLoading] = useState(false)

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!formData.amount || parseFloat(formData.amount) <= 0) {
//       toast.error("Income must be greater than 0")
//       return
//     }

//     setLoading(true)
//     try {
//       const { data: { user } } = await supabase.auth.getUser()
//       if (!user) {
//         toast.error("Please log in")
//         return
//       }

//       const newIncome: IncomeInsert = {
//         user_id: user.id,
//         amount: parseFloat(formData.amount),
//         category: formData.category || "Other",
//         notes: formData.notes || null,
//         created_at: formData.date, // mapping ke created_at
//       }

//       const { error } = await supabase.from("income").insert(newIncome)
//       if (error) throw error

//       toast.success("Income berhasil ditambahkan")
//       onSuccess()
//       onClose()
//     } catch (error) {
//       console.error("Error adding income:", error)
//       toast.error("Gagal menambahkan income")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Add Income</DialogTitle>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Amount */}
//           <div className="space-y-2">
//             <Label htmlFor="amount">Amount</Label>
//             <Input
//               id="amount"
//               type="number"
//               value={formData.amount}
//               onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
//               placeholder="Rp 0"
//               required
//               min="0"
//               step="0.01"
//             />
//           </div>

//           {/* Category / Source */}
//           <div className="space-y-2">
//             <Label htmlFor="category">Source</Label>
//             <Input
//               id="category"
//               type="text"
//               value={formData.category}
//               onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//               placeholder="Salary, Freelance, Bonus..."
//             />
//           </div>

//           {/* Date */}
//           <div className="space-y-2">
//             <Label htmlFor="date">Date</Label>
//             <Input
//               id="date"
//               type="date"
//               value={formData.date}
//               onChange={(e) => setFormData({ ...formData, date: e.target.value })}
//               required
//             />
//           </div>

//           {/* Notes */}
//           <div className="space-y-2">
//             <Label htmlFor="notes">Notes</Label>
//             <Textarea
//               id="notes"
//               value={formData.notes}
//               onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
//               placeholder="Tambahkan catatan (opsional)..."
//             />
//           </div>

//           <DialogFooter>
//             <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
//             <Button type="submit" disabled={loading}>
//               {loading ? "Saving..." : "Save Income"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   )
// }
