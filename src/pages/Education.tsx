import { useState, useEffect } from "react"
import { GraduationCap, Play, BookOpen, PiggyBank, TrendingUp, ShoppingCart, Wallet, Lightbulb } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "react-i18next"
import { supabase } from "@/integrations/supabase/client"

interface EducationContent {
  education_id: string
  title: string
  content: string
  video_url: string | null
  category: string | null
}

const CATEGORIES = [
  { key: "all", icon: BookOpen },
  { key: "saving", icon: PiggyBank },
  { key: "budgeting", icon: Wallet },
  { key: "investing", icon: TrendingUp },
  { key: "spending", icon: ShoppingCart },
  { key: "financial_literacy", icon: Lightbulb },
] as const

function getEmbedUrl(url: string): string | null {
  try {
    // YouTube
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`
    // Already an embed URL
    if (url.includes("/embed/")) return url
    return url
  } catch {
    return null
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case "saving": return "bg-[hsl(var(--income))] text-[hsl(var(--income-foreground))]"
    case "budgeting": return "bg-[hsl(var(--budgeting-color))] text-white"
    case "investing": return "bg-[hsl(var(--challenges-color))] text-white"
    case "spending": return "bg-[hsl(var(--spending-color))] text-[hsl(var(--expense-foreground))]"
    case "financial_literacy": return "bg-[hsl(var(--education-color))] text-white"
    default: return "bg-muted text-muted-foreground"
  }
}

export default function Education() {
  const { t } = useTranslation()
  const [educationList, setEducationList] = useState<EducationContent[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchEducation()
  }, [])

  const fetchEducation = async () => {
    try {
      const { data, error } = await supabase
        .from("education")
        .select("education_id, title, content, video_url, category")
        .is("deleted_at", null)
        .order("created_at", { ascending: false })

      if (error) throw error
      setEducationList(data || [])
    } catch (error) {
      console.error("Error fetching education:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredList = activeTab === "all"
    ? educationList
    : educationList.filter(e => e.category === activeTab)

  if (loading) {
    return <div className="p-6 text-muted-foreground">{t("common.loading")}</div>
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t("education.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("education.subtitle")}</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
          {CATEGORIES.map(({ key, icon: Icon }) => (
            <TabsTrigger
              key={key}
              value={key}
              className="flex items-center gap-1.5 text-xs md:text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Icon className="h-3.5 w-3.5" />
              {t(`education.categories.${key}`)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredList.length === 0 ? (
            <Card className="rounded-2xl shadow-sm p-12 text-center">
              <div className="text-muted-foreground">
                <GraduationCap className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">{t("education.noContent")}</h3>
                <p className="text-sm">{t("education.noContentDesc")}</p>
              </div>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredList.map((item) => {
                const embedUrl = item.video_url ? getEmbedUrl(item.video_url) : null
                return (
                  <Card key={item.education_id} className="rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    {embedUrl ? (
                      <AspectRatio ratio={16 / 9}>
                        <iframe
                          src={embedUrl}
                          title={item.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                      </AspectRatio>
                    ) : (
                      <div className="bg-muted flex items-center justify-center h-48">
                        <Play className="h-12 w-12 text-muted-foreground opacity-30" />
                      </div>
                    )}
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-semibold text-foreground leading-tight">{item.title}</h3>
                        {item.category && item.category !== "general" && (
                          <Badge className={`shrink-0 text-xs ${getCategoryColor(item.category)}`}>
                            {t(`education.categories.${item.category}`)}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {item.content}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
