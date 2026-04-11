import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Trophy, PlusCircle, CalendarDays, CheckCircle2, XCircle, Play, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

type DefaultChallenge = {
  id: string
  title: string
  description: string
  reward_points: number | null
  start_date: string
  end_date: string
}

type Participation = {
  id: string
  challenge_id: string
  status: string
  progress: number
  target_days: number
  last_update_date: string | null
}

type Game = {
  game_id: string
  game_name: string
  score: number
  created_at: string
}

export default function Challenge() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [weeklyChallenges, setWeeklyChallenges] = useState<DefaultChallenge[]>([])
  const [participations, setParticipations] = useState<Map<string, Participation>>(new Map())
  const [userChallenges, setUserChallenges] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const { data: defaultData } = await supabase
        .from("default_challenges")
        .select("*")
        .is("deleted_at", null)
        .order("start_date", { ascending: false })

      setWeeklyChallenges(defaultData || [])

      if (!user) { setLoading(false); return }

      // Fetch participations
      const { data: partData } = await supabase
        .from("challenge_participants")
        .select("*")
        .eq("user_id", user.id)

      const partMap = new Map<string, Participation>()
      ;(partData || []).forEach((p: any) => partMap.set(p.challenge_id, p))
      setParticipations(partMap)

      // Fetch user custom challenges
      const { data: userData } = await supabase
        .from("game")
        .select("game_id, game_name, score, created_at")
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })

      setUserChallenges(userData || [])
    } catch (err) {
      console.error("Error fetching challenges:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user])

  const handleJoinChallenge = async (challengeId: string) => {
    if (!user) return
    setActionLoading(challengeId)
    try {
      const { error } = await supabase.from("challenge_participants").insert({
        challenge_id: challengeId,
        user_id: user.id,
        status: "ongoing",
        progress: 0,
        target_days: 7,
      })
      if (error) throw error
      toast.success(t("challenge.joinSuccess"))
      await fetchData()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to join")
    } finally {
      setActionLoading(null)
    }
  }

  const handleUpdateProgress = async (participation: Participation, challenge: DefaultChallenge) => {
    if (!user) return
    setActionLoading(participation.id)

    const today = new Date().toISOString().split("T")[0]
    if (participation.last_update_date === today) {
      toast.info(t("challenge.alreadyUpdatedToday"))
      setActionLoading(null)
      return
    }

    const newProgress = participation.progress + 1
    const isCompleted = newProgress >= participation.target_days

    try {
      const updateData: any = {
        progress: newProgress,
        last_update_date: today,
      }

      if (isCompleted) {
        updateData.status = "completed"
        updateData.completed_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from("challenge_participants")
        .update(updateData)
        .eq("id", participation.id)

      if (error) throw error

      // If completed, add points to leaderboard
      if (isCompleted && challenge.reward_points) {
        await supabase.rpc("add_leaderboard_points", {
          _user_id: user.id,
          _points: challenge.reward_points,
        })
        toast.success(`🎉 ${t("challenge.completed")}! +${challenge.reward_points} ${t("leaderboard.points")}`)
      } else {
        toast.success(`${t("challenge.progressUpdated")} (${newProgress}/${participation.target_days})`)
      }

      await fetchData()
    } catch (err) {
      console.error(err)
      toast.error("Failed to update progress")
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === "completed") return <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">✅ {t("challenge.statusCompleted")}</span>
    if (status === "failed") return <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">❌ {t("challenge.statusFailed")}</span>
    return <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">🔥 {t("challenge.statusOngoing")}</span>
  }

  const isChallengeExpired = (endDate: string) => {
    return new Date(endDate) < new Date()
  }

  return (
    <div className="p-6 space-y-10">
      {/* Weekly Challenges Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{t("challenge.weekly")}</h2>
        </div>

        {loading ? (
          <p className="text-muted-foreground">{t("common.loading")}</p>
        ) : weeklyChallenges.length === 0 ? (
          <Card className="rounded-2xl shadow-soft p-8 text-center">
            <p className="text-muted-foreground">{t("challenge.noActiveChallenges")}</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {weeklyChallenges.map((challenge) => {
              const participation = participations.get(challenge.id)
              const expired = isChallengeExpired(challenge.end_date)

              return (
                <Card key={challenge.id} className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-base">
                      <span className="truncate">{challenge.title}</span>
                      <CalendarDays className="h-5 w-5 text-primary flex-shrink-0" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-primary">🏆 {challenge.reward_points || 0} {t("leaderboard.points")}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(challenge.start_date).toLocaleDateString()} - {new Date(challenge.end_date).toLocaleDateString()}
                      </span>
                    </div>

                    {participation ? (
                      <div className="space-y-2 pt-2 border-t">
                        <div className="flex items-center justify-between">
                          {getStatusBadge(participation.status)}
                          <span className="text-sm font-bold">{participation.progress}/{participation.target_days} {t("challenge.days")}</span>
                        </div>
                        <Progress value={(participation.progress / participation.target_days) * 100} className="h-2" />

                        {participation.status === "ongoing" && !expired && (
                          <Button
                            size="sm"
                            className="w-full mt-2"
                            onClick={() => handleUpdateProgress(participation, challenge)}
                            disabled={actionLoading === participation.id || participation.last_update_date === new Date().toISOString().split("T")[0]}
                          >
                            {actionLoading === participation.id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                            )}
                            {participation.last_update_date === new Date().toISOString().split("T")[0]
                              ? t("challenge.alreadyUpdatedToday")
                              : t("challenge.updateProgress")}
                          </Button>
                        )}

                        {participation.status === "ongoing" && expired && (
                          <p className="text-xs text-destructive font-medium text-center pt-1">
                            {t("challenge.challengeExpired")}
                          </p>
                        )}
                      </div>
                    ) : (
                      !expired && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full mt-2"
                          onClick={() => handleJoinChallenge(challenge.id)}
                          disabled={actionLoading === challenge.id}
                        >
                          {actionLoading === challenge.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Play className="h-4 w-4 mr-2" />
                          )}
                          {t("challenge.joinChallenge")}
                        </Button>
                      )
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </section>

      {/* User Challenges Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{t("challenge.userChallenges")}</h2>
          <Button
            onClick={() => navigate("/dashboard/challenge/new")}
            className="rounded-xl"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            {t("challenge.newChallenge")}
          </Button>
        </div>

        {loading ? (
          <p className="text-muted-foreground">{t("common.loading")}</p>
        ) : userChallenges.length === 0 ? (
          <Card className="rounded-2xl shadow-soft p-8 text-center">
            <p className="text-muted-foreground">{t("challenge.noUserChallenges")}</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userChallenges.map((challenge) => (
              <Card key={challenge.game_id} className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {challenge.game_name}
                    <Trophy className="h-5 w-5 text-yellow-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t("challenge.created")}: {new Date(challenge.created_at).toLocaleDateString()}
                  </p>
                  <p className="font-semibold">{t("challenge.score")}: {challenge.score}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
