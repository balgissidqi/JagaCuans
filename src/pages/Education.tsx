import { GraduationCap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "react-i18next"

export default function Education() {
  const { t } = useTranslation()
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('education.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('education.subtitle')}</p>
        </div>
      </div>

      <Card className="rounded-2xl shadow-soft p-12 text-center">
        <div className="text-muted-foreground">
          <GraduationCap className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">{t('education.comingSoon')}</h3>
          <p className="text-sm">{t('education.comingSoonDesc')}</p>
        </div>
      </Card>
    </div>
  )
}