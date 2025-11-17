import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, PlusCircle, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"

export default function NewChallenge() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [challengeType, setChallengeType] = useState<"saving" | "spending_cut">("saving")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    goalAmount: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.duration || !formData.goalAmount) {
      toast.error("Please fill in all fields")
      return
    }

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error("You must be logged in")
        return
      }

      const { error } = await supabase.from("game").insert({
        user_id: user.id,
        game_name: formData.title,
        score: 0,
      })

      if (error) throw error

      toast.success("Challenge created successfully!")
      navigate("/dashboard/challenge")
    } catch (error) {
      console.error("Error creating challenge:", error)
      toast.error("Failed to create challenge")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/dashboard/challenge")}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">{t('challenge.createChallenge')}</h1>
        </div>

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <PlusCircle className="h-8 w-8 text-primary" />
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">{t('challenge.createYourOwn')}</h2>
          <p className="text-sm text-muted-foreground">
            {t('challenge.subtitle')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Challenge Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Challenge Title
            </label>
            <Input
              placeholder="e.g., Save for New Phone"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Description
            </label>
            <Textarea
              placeholder="Describe your challenge and what you want to achieve..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full min-h-[100px] resize-none"
            />
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Duration
            </label>
            <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select duration..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1week">1 Week</SelectItem>
                <SelectItem value="2weeks">2 Weeks</SelectItem>
                <SelectItem value="1month">1 Month</SelectItem>
                <SelectItem value="3months">3 Months</SelectItem>
                <SelectItem value="6months">6 Months</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Goal Amount */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Goal Amount or Target
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                Rp
              </span>
              <Input
                type="number"
                placeholder="500,000"
                value={formData.goalAmount}
                onChange={(e) => setFormData({ ...formData, goalAmount: e.target.value })}
                className="w-full pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Or describe a behavioral target (e.g., "No coffee purchases")
            </p>
          </div>

          {/* Challenge Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Challenge Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setChallengeType("saving")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  challengeType === "saving"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Saving</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setChallengeType("spending_cut")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  challengeType === "spending_cut"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Spending Cut</span>
                </div>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-12 text-base font-medium"
          >
            {loading ? "Creating..." : "Save Challenge"}
          </Button>
        </form>

        {/* Pro Tips */}
        <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900 p-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <Lightbulb className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-orange-900 dark:text-orange-100">Pro Tips</h3>
              <ul className="text-xs text-orange-800 dark:text-orange-200 space-y-1 list-disc list-inside">
                <li>Set specific and achievable goals</li>
                <li>Start with shorter durations</li>
                <li>Track your progress daily</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
