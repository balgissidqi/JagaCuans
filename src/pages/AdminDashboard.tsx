import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { Trophy, GraduationCap, Users } from "lucide-react"
import { useTranslation } from "react-i18next"

export default function AdminDashboard() {
  const { t } = useTranslation()
  const [stats, setStats] = useState({
    totalChallenges: 0,
    totalEducation: 0,
    totalUsers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [challengesRes, educationRes] = await Promise.all([
          supabase.from("default_challenges").select("id", { count: "exact", head: true }).is("deleted_at", null),
          supabase.from("education").select("education_id", { count: "exact", head: true }).is("deleted_at", null),
        ])

        setStats({
          totalChallenges: challengesRes.count || 0,
          totalEducation: educationRes.count || 0,
          totalUsers: 0,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const cards = [
    {
      title: "Total Tantangan",
      value: stats.totalChallenges,
      icon: Trophy,
      description: "Tantangan aktif saat ini",
      color: "text-orange-500",
    },
    {
      title: "Total Edukasi",
      value: stats.totalEducation,
      icon: GraduationCap,
      description: "Konten edukasi tersedia",
      color: "text-blue-500",
    },
  ]

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Admin</h1>
        <p className="text-muted-foreground mt-1">Ringkasan konten dan statistik aplikasi</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
