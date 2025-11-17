import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { Trophy, PlusCircle, CalendarDays } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

type DefaultChallenge = {
  id: string
  title: string
  description: string
  reward: string
  start_date: string
  end_date: string
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
  const [weeklyChallenges, setWeeklyChallenges] = useState<DefaultChallenge[]>([])
  const [userChallenges, setUserChallenges] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // fetch default challenges
        const { data: defaultData, error: defaultError } = await supabase
          .from("default_challenges")
          .select("*")
          .gte("end_date", new Date().toISOString().split("T")[0]) // hanya yang masih aktif
          .order("start_date", { ascending: false })

        if (defaultError) throw defaultError
        setWeeklyChallenges(defaultData || [])

        // fetch user challenges
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: userData, error: userError } = await supabase
          .from("game")
          .select("game_id, game_name, score, created_at")
          .eq("user_id", user.id)
          .is("deleted_at", null)
          .order("created_at", { ascending: false })

        if (userError) throw userError
        setUserChallenges(userData || [])
      } catch (err) {
        console.error("Error fetching challenges:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="p-6 space-y-10">
      {/* Weekly Challenges Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{t('challenge.weekly')}</h2>
        </div>

        {weeklyChallenges.length === 0 ? (
          <Card className="rounded-2xl shadow-soft p-8 text-center">
            <p className="text-muted-foreground">{t('challenge.noActiveChallenges')}</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {weeklyChallenges.map((challenge) => (
              <Card key={challenge.id} className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {challenge.title}
                    <CalendarDays className="h-5 w-5 text-blue-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{challenge.description}</p>
                  <p className="text-sm font-medium">{t('challenge.reward')}: {challenge.reward}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(challenge.start_date).toLocaleDateString()} -{" "}
                    {new Date(challenge.end_date).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* User Challenges Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{t('challenge.userChallenges')}</h2>
          <Button
            onClick={() => navigate("/dashboard/challenge/new")}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            {t('challenge.newChallenge')}
          </Button>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : userChallenges.length === 0 ? (
          <Card className="rounded-2xl shadow-soft p-8 text-center">
            <p className="text-muted-foreground">You haven’t created any custom challenges yet.</p>
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
                    {t('challenge.created')}: {new Date(challenge.created_at).toLocaleDateString()}
                  </p>
                  <p className="font-semibold">{t('challenge.score')}: {challenge.score}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
