import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Plus, Trash2, Edit } from "lucide-react"

interface Challenge {
  id: string
  title: string
  description: string
  reward_points: number
  start_date: string
  end_date: string | null
}

export default function AdminChallenges() {
  const { t } = useTranslation()
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    reward_points: 0,
    start_date: "",
    end_date: ""
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchChallenges()
  }, [])

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from("default_challenges")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })

      if (error) throw error
      setChallenges(data || [])
    } catch (error) {
      console.error("Error fetching challenges:", error)
      toast.error(t("admin.challenges.fetchError"))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingId) {
        const { error } = await supabase
          .from("default_challenges")
          .update({
            title: formData.title,
            description: formData.description,
            reward_points: formData.reward_points,
            start_date: formData.start_date,
            end_date: formData.end_date || null
          })
          .eq("id", editingId)

        if (error) {
          if (error.message.includes('JWT')) {
            toast.error("Silakan login sebagai admin untuk mengedit challenge")
          } else {
            throw error
          }
          return
        }
        toast.success(t("admin.challenges.updateSuccess"))
      } else {
        const { error } = await supabase
          .from("default_challenges")
          .insert({
            title: formData.title,
            description: formData.description,
            reward_points: formData.reward_points,
            start_date: formData.start_date,
            end_date: formData.end_date || null
          })

        if (error) {
          if (error.message.includes('JWT') || error.message.includes('row-level security')) {
            toast.error("Silakan login sebagai admin untuk membuat challenge")
          } else {
            throw error
          }
          return
        }
        toast.success(t("admin.challenges.createSuccess"))
      }

      setFormData({
        title: "",
        description: "",
        reward_points: 0,
        start_date: "",
        end_date: ""
      })
      setEditingId(null)
      fetchChallenges()
    } catch (error) {
      console.error("Error saving challenge:", error)
      toast.error(t("admin.challenges.saveError"))
    }
  }

  const handleEdit = (challenge: Challenge) => {
    setFormData({
      title: challenge.title,
      description: challenge.description,
      reward_points: challenge.reward_points,
      start_date: challenge.start_date.split("T")[0],
      end_date: challenge.end_date ? challenge.end_date.split("T")[0] : ""
    })
    setEditingId(challenge.id)
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t("admin.challenges.deleteConfirm"))) return

    try {
      const { error } = await supabase
        .from("default_challenges")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id)

      if (error) {
        if (error.message.includes('JWT') || error.message.includes('row-level security')) {
          toast.error("Silakan login sebagai admin untuk menghapus challenge")
        } else {
          throw error
        }
        return
      }
      toast.success(t("admin.challenges.deleteSuccess"))
      fetchChallenges()
    } catch (error) {
      console.error("Error deleting challenge:", error)
      toast.error(t("admin.challenges.deleteError"))
    }
  }

  if (loading) {
    return <div className="p-6">{t("common.loading")}</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t("admin.challenges.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("admin.challenges.subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? t("admin.challenges.editChallenge") : t("admin.challenges.createChallenge")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">{t("admin.challenges.form.title")}</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">{t("admin.challenges.form.description")}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="reward_points">{t("admin.challenges.form.rewardPoints")}</Label>
              <Input
                id="reward_points"
                type="number"
                value={formData.reward_points}
                onChange={(e) => setFormData({ ...formData, reward_points: parseInt(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="start_date">{t("admin.challenges.form.startDate")}</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_date">{t("admin.challenges.form.endDate")}</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">
                <Plus className="w-4 h-4 mr-2" />
                {editingId ? t("admin.challenges.update") : t("admin.challenges.create")}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null)
                    setFormData({
                      title: "",
                      description: "",
                      reward_points: 0,
                      start_date: "",
                      end_date: ""
                    })
                  }}
                >
                  {t("common.cancel")}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">{t("admin.challenges.existingChallenges")}</h2>
        {challenges.map((challenge) => (
          <Card key={challenge.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">{challenge.title}</h3>
                  <p className="text-muted-foreground mt-1">{challenge.description}</p>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>{t("admin.challenges.rewardPoints")}: {challenge.reward_points}</p>
                    <p>{t("admin.challenges.startDate")}: {new Date(challenge.start_date).toLocaleDateString()}</p>
                    {challenge.end_date && (
                      <p>{t("admin.challenges.endDate")}: {new Date(challenge.end_date).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(challenge)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(challenge.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
