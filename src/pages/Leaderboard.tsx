import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { Trophy, Medal, Award, Crown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "react-i18next"

interface LeaderboardEntry {
  leaderboard_id: string
  user_id: string
  score: number
  rank: number
  profiles: { name: string | null; photo_url: string | null } | null
}

export default function Leaderboard() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLeaderboard = async () => {
    setLoading(true)
    // Fetch leaderboard
    const { data: lbData, error: lbError } = await supabase
      .from("leaderboard")
      .select("leaderboard_id, user_id, score, rank")
      .is("deleted_at", null)
      .order("rank", { ascending: true })
      .limit(100)

    if (lbError || !lbData) { setLoading(false); return }

    // Fetch profiles for all user_ids
    const userIds = lbData.map(e => e.user_id)
    const { data: profilesData } = await supabase
      .from("profiles")
      .select("id, name, photo_url")
      .in("id", userIds)

    const profileMap = new Map((profilesData || []).map(p => [p.id, p]))

    setEntries(lbData.map(e => ({
      ...e,
      profiles: profileMap.get(e.user_id) || null
    })) as LeaderboardEntry[])
    setLoading(false)
  }

  useEffect(() => {
    fetchLeaderboard()

    // Realtime subscription
    const channel = supabase
      .channel("leaderboard-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "leaderboard" }, () => {
        fetchLeaderboard()
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />
    return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>
  }

  const getRankBg = (rank: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return "bg-primary/10 border-primary"
    if (rank === 1) return "bg-yellow-50 border-yellow-300 dark:bg-yellow-950/30 dark:border-yellow-700"
    if (rank === 2) return "bg-gray-50 border-gray-300 dark:bg-gray-900/30 dark:border-gray-600"
    if (rank === 3) return "bg-amber-50 border-amber-300 dark:bg-amber-950/30 dark:border-amber-700"
    return ""
  }

  const currentUserEntry = entries.find(e => e.user_id === user?.id)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Trophy className="h-8 w-8 text-yellow-500" />
        <div>
          <h1 className="text-2xl font-bold">{t("leaderboard.title")}</h1>
          <p className="text-muted-foreground text-sm">{t("leaderboard.subtitle")}</p>
        </div>
      </div>

      {/* Current user stats */}
      {currentUserEntry && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {getRankIcon(currentUserEntry.rank)}
              <div>
                <p className="font-semibold">{t("leaderboard.yourRank")}</p>
                <p className="text-sm text-muted-foreground">
                  {t("leaderboard.totalPoints")}: {currentUserEntry.score}
                </p>
              </div>
            </div>
            <div className="text-3xl font-bold text-primary">#{currentUserEntry.rank}</div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("leaderboard.rankings")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <p className="text-center text-muted-foreground py-8">{t("common.loading")}</p>
          ) : entries.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">{t("leaderboard.noEntries")}</p>
          ) : (
            entries.map((entry) => {
              const isCurrentUser = entry.user_id === user?.id
              const profileData = entry.profiles as { name: string | null; photo_url: string | null } | null
              return (
                <div
                  key={entry.leaderboard_id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${getRankBg(entry.rank, isCurrentUser)}`}
                >
                  <div className="flex items-center gap-3">
                    {getRankIcon(entry.rank)}
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                      {profileData?.photo_url ? (
                        <img src={profileData.photo_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-bold text-muted-foreground">
                          {(profileData?.name || "?")[0].toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${isCurrentUser ? "text-primary" : ""}`}>
                        {profileData?.name || t("leaderboard.anonymous")}
                        {isCurrentUser && <span className="ml-2 text-xs text-primary">({t("leaderboard.you")})</span>}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{entry.score}</p>
                    <p className="text-xs text-muted-foreground">{t("leaderboard.points")}</p>
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>
    </div>
  )
}
