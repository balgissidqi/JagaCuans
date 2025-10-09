import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from "@/integrations/supabase/client"
import { formatRupiah } from "@/utils/currency"
import { TrendingUp, TrendingDown, Camera, Edit3, Filter } from "lucide-react"
import { toast } from "sonner"

interface Transaction {
  transaction_id: string
  type: 'income' | 'spending'
  method: 'manual' | 'photo'
  name: string
  amount: number
  category_id?: string
  notes?: string
  date: string
  ai_processed: boolean
  created_at: string
  updated_at: string
  deleted_at?: string
  user_id: string
  photo_url?: string
}

export function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedMonth, setSelectedMonth] = useState<string>('all')
  const [availableYears, setAvailableYears] = useState<number[]>([])

  useEffect(() => {
    fetchAvailableYears()
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [selectedYear, selectedMonth])

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

  const fetchTransactions = async () => {
    try {
      let query = supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })

      // Apply year filter
      if (selectedYear !== 'all') {
        const year = parseInt(selectedYear)
        const startDate = new Date(year, 0, 1).toISOString()
        const endDate = new Date(year + 1, 0, 1).toISOString()
        query = query.gte('date', startDate).lt('date', endDate)
      }

      // Apply month filter
      if (selectedMonth !== 'all' && selectedYear !== 'all') {
        const year = parseInt(selectedYear)
        const month = parseInt(selectedMonth)
        const startDate = new Date(year, month, 1).toISOString()
        const endDate = new Date(year, month + 1, 1).toISOString()
        query = query.gte('date', startDate).lt('date', endDate)
      }

      const { data, error } = await query.limit(100)

      if (error) throw error
      setTransactions((data || []) as Transaction[])
    } catch (error) {
      console.error('Error fetching transactions:', error)
      toast.error('Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCategoryName = (categoryId?: string) => {
    const categories = {
      food: 'Makanan',
      transport: 'Transportasi',
      shopping: 'Belanja',
      entertainment: 'Hiburan',
      health: 'Kesehatan',
      other: 'Lainnya'
    }
    return categoryId ? categories[categoryId as keyof typeof categories] || categoryId : 'No Category'
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </Card>
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-muted-foreground">
          <p className="text-lg mb-2">No transactions yet</p>
          <p className="text-sm">Start by adding your first income or expense</p>
        </div>
      </Card>
    )
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

  return (
    <div className="space-y-3">
      {/* Filter Section */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filter:</span>
        </div>
        
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Pilih Tahun" />
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
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Pilih Bulan" />
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

      <h2 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h2>
      
      {transactions.map((transaction) => (
        <Card key={transaction.transaction_id} className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Icon */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                transaction.type === 'income' 
                  ? 'bg-income/10 text-income' 
                  : 'bg-expense/10 text-expense'
              }`}>
                {transaction.type === 'income' ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
              </div>

              {/* Details */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-foreground">{transaction.name}</h3>
                  <div className="flex gap-1">
                    {transaction.method === 'photo' && (
                      <Badge variant="outline" className="text-xs">
                        <Camera className="h-3 w-3 mr-1" />
                        Photo
                      </Badge>
                    )}
                    {transaction.method === 'manual' && (
                      <Badge variant="outline" className="text-xs">
                        <Edit3 className="h-3 w-3 mr-1" />
                        Manual
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>{formatDate(transaction.date)}</p>
                  {transaction.type === 'spending' && transaction.category_id && (
                    <p>{getCategoryName(transaction.category_id)}</p>
                  )}
                  {transaction.notes && (
                    <p className="italic">{transaction.notes}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className={`font-semibold text-lg ${
              transaction.type === 'income' ? 'text-income' : 'text-expense'
            }`}>
              {transaction.type === 'income' ? '+' : '-'}{formatRupiah(transaction.amount)}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}