import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Plus, Trash2, Edit, Video } from "lucide-react"

interface EducationContent {
  education_id: string
  title: string
  content: string
  video_url: string | null
  category: string | null
}

const CATEGORY_OPTIONS = [
  "saving",
  "budgeting",
  "investing",
  "spending",
  "financial_literacy",
]

export default function AdminEducation() {
  const { t } = useTranslation()
  const [educationList, setEducationList] = useState<EducationContent[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    video_url: "",
    category: "saving",
  })
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    fetchEducation()
  }, [])

  const fetchEducation = async () => {
    try {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })

      if (error) throw error
      setEducationList(data || [])
    } catch (error) {
      console.error("Error fetching education:", error)
      toast.error(t("admin.education.fetchError"))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      title: formData.title,
      content: formData.content,
      video_url: formData.video_url || null,
      category: formData.category,
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from("education")
          .update(payload)
          .eq("education_id", editingId)

        if (error) {
          if (error.message.includes('JWT') || error.message.includes('row-level security')) {
            toast.error("Silakan login sebagai admin untuk mengedit konten")
          } else {
            throw error
          }
          return
        }
        toast.success(t("admin.education.updateSuccess"))
      } else {
        const { error } = await supabase
          .from("education")
          .insert(payload)

        if (error) {
          if (error.message.includes('JWT') || error.message.includes('row-level security')) {
            toast.error("Silakan login sebagai admin untuk membuat konten")
          } else {
            throw error
          }
          return
        }
        toast.success(t("admin.education.createSuccess"))
      }

      setFormData({ title: "", content: "", video_url: "", category: "saving" })
      setEditingId(null)
      fetchEducation()
    } catch (error) {
      console.error("Error saving education:", error)
      toast.error(t("admin.education.saveError"))
    }
  }

  const handleEdit = (education: EducationContent) => {
    setFormData({
      title: education.title,
      content: education.content,
      video_url: education.video_url || "",
      category: education.category || "saving",
    })
    setEditingId(education.education_id)
  }

  const handleDelete = async (id: string) => {
    if (!confirm(t("admin.education.deleteConfirm"))) return

    try {
      const { error } = await supabase
        .from("education")
        .update({ deleted_at: new Date().toISOString() })
        .eq("education_id", id)

      if (error) {
        if (error.message.includes('JWT') || error.message.includes('row-level security')) {
          toast.error("Silakan login sebagai admin untuk menghapus konten")
        } else {
          throw error
        }
        return
      }
      toast.success(t("admin.education.deleteSuccess"))
      fetchEducation()
    } catch (error) {
      console.error("Error deleting education:", error)
      toast.error(t("admin.education.deleteError"))
    }
  }

  if (loading) {
    return <div className="p-6">{t("common.loading")}</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t("admin.education.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("admin.education.subtitle")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{editingId ? t("admin.education.editContent") : t("admin.education.createContent")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">{t("admin.education.form.title")}</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">{t("admin.education.form.category")}</Label>
              <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {t(`education.categories.${cat}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="video_url">{t("admin.education.form.videoUrl")}</Label>
              <div className="flex items-center gap-2">
                <Video className="h-4 w-4 text-muted-foreground shrink-0" />
                <Input
                  id="video_url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
            </div>
            <div>
              <Label htmlFor="content">{t("admin.education.form.content")}</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                placeholder={t("admin.education.form.contentPlaceholder")}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">
                <Plus className="w-4 h-4 mr-2" />
                {editingId ? t("admin.education.update") : t("admin.education.create")}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null)
                    setFormData({ title: "", content: "", video_url: "", category: "saving" })
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
        <h2 className="text-2xl font-bold text-foreground">{t("admin.education.existingContent")}</h2>
        {educationList.map((education) => (
          <Card key={education.education_id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-semibold text-foreground">{education.title}</h3>
                    {education.category && (
                      <Badge variant="secondary" className="text-xs">
                        {t(`education.categories.${education.category}`)}
                      </Badge>
                    )}
                  </div>
                  {education.video_url && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Video className="h-3 w-3" /> {education.video_url}
                    </p>
                  )}
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap">{education.content}</p>
                </div>
                <div className="flex gap-2 ml-4 shrink-0">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(education)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="icon" onClick={() => handleDelete(education.education_id)}>
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
