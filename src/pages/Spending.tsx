import { useState, useEffect } from "react"
import { FloatingActionButton } from "@/components/FloatingActionButton"
import { TransactionList } from "@/components/TransactionList"
import { TransactionModal } from "@/components/TransactionModal"
import { AddSpendingForm } from "@/components/AddSpendingForm"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"

export type TransactionType = 'income' | 'spending'
export type TransactionMethod = 'manual' | 'photo'

export interface TransactionData {
  name: string
  amount: number
  category_id?: string
  notes?: string
  date: Date
  type: TransactionType
  method: TransactionMethod
  photo_url?: string
}

const Spending = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [transactionType, setTransactionType] = useState<TransactionType>('spending')
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedMonth, setSelectedMonth] = useState<string>('all')
  const [availableYears, setAvailableYears] = useState<number[]>([])

  useEffect(() => {
    fetchAvailableYears()
  }, [])

  const fetchAvailableYears = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('date')
        .order('date', { ascending: false })

      if (error) throw error
      
      const years = Array.from(new Set((data || []).map(t => new Date(t.date).getFullYear())))
      setAvailableYears(years.sort((a, b) => b - a))
    } catch (error) {
      console.error('Error fetching years:', error)
    }
  }

  const months = [
    { value: '0', label: 'Januari' },
    { value: '1', label: 'Februari' },
    { value: '2', label: 'Maret' },
    { value: '3', label: 'April' },
    { value: '4', label: 'Mei' },
    { value: '5', label: 'Juni' },
    { value: '6', label: 'Juli' },
    { value: '7', label: 'Agustus' },
    { value: '8', label: 'September' },
    { value: '9', label: 'Oktober' },
    { value: '10', label: 'November' },
    { value: '11', label: 'Desember' }
  ]

  const handleFabClick = (type: TransactionType) => {
    setTransactionType(type)
    setShowAddForm(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleTransactionSuccess = () => {
    setRefreshTrigger(prev => prev + 1)
    setIsModalOpen(false)
    setShowAddForm(false)
  }

  const handleBackFromForm = () => {
    setShowAddForm(false)
  }

  if (showAddForm) {
    return (
      <AddSpendingForm 
        onSuccess={handleTransactionSuccess}
        onBack={handleBackFromForm}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Spending Tracker
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your income and expenses
            </p>
          </div>
          
          {/* Filter Section */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span className="text-sm font-medium">Filter:</span>
            </div>
            
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Tahun" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="all">Semua Tahun</SelectItem>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={selectedMonth} 
              onValueChange={setSelectedMonth}
              disabled={selectedYear === 'all'}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Bulan" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="all">Semua Bulan</SelectItem>
                {months.map(month => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Transaction List */}
        <TransactionList 
          key={refreshTrigger} 
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
        />

        {/* Floating Action Button */}
        <FloatingActionButton onAddIncome={() => handleFabClick('income')} onAddSpending={() => handleFabClick('spending')} />

        {/* Transaction Modal */}
        <TransactionModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          transactionType={transactionType}
          onSuccess={handleTransactionSuccess}
        />
      </div>
    </div>
  )
}

export default Spending