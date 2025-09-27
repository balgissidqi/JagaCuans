import { useState, useEffect } from "react"
import { User, Camera, Edit3, Trophy, Award, Target, BookOpen, TrendingUp, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

interface UserProfile {
  id: string
  name: string
  email: string
  avatar_url?: string
  bio?: string
}

interface Achievement {
  id: string
  title: string
  description: string
  type: 'gold' | 'silver' | 'bronze'
  unlocked: boolean
}

interface Activity {
  id: string
  title: string
  description: string
  points?: number
  date: string
  type: string
}

export default function Profile() {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [savingsProgress, setSavingsProgress] = useState({ current: 0, target: 0, completed: 0 })
  const [challengesCompleted, setChallengesCompleted] = useState(0)
  const [quizStats, setQuizStats] = useState({ average: 0, total: 0 })
  const [goalsAchieved, setGoalsAchieved] = useState(0)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        navigate('/login')
        return
      }

      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile({
          id: user.id,
          name: profileData.name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          avatar_url: undefined, // No avatar_url field in current schema
          bio: undefined // No bio field in current schema
        })
      }

      // Fetch savings goals data
      const { data: savingsData } = await supabase
        .from('saving_goals')
        .select('current_amount, target_amount')
        .eq('user_id', user.id)

      if (savingsData && savingsData.length > 0) {
        const totalCurrent = savingsData.reduce((sum, goal) => sum + (goal.current_amount || 0), 0)
        const totalTarget = savingsData.reduce((sum, goal) => sum + (goal.target_amount || 0), 0)
        const completedGoals = savingsData.filter(goal => 
          goal.current_amount >= goal.target_amount && goal.target_amount > 0
        ).length

        setSavingsProgress({ current: totalCurrent, target: totalTarget, completed: completedGoals })
        setGoalsAchieved(completedGoals)
      }

      // Mock data for other sections (you can replace with real data later)
      setChallengesCompleted(Math.floor(Math.random() * 10) + 1)
      setQuizStats({ average: 85, total: 12 })
      
      setAchievements([
        { id: '1', title: 'Goal Achiever', description: 'Reached your first savings goal', type: 'gold', unlocked: goalsAchieved > 0 },
        { id: '2', title: 'Consistent Saver', description: 'Saved money for 30 days straight', type: 'silver', unlocked: true },
        { id: '3', title: 'Quiz Master', description: 'Completed your first quiz', type: 'bronze', unlocked: true }
      ])

      setRecentActivity([
        { id: '1', title: 'Completed savings goal', description: 'Emergency Fund', points: 100, date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), type: 'goal' },
        { id: '2', title: 'Added expense', description: 'Groceries - Rp 150,000', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), type: 'expense' },
        { id: '3', title: 'Quiz completed', description: 'Financial Basics', points: 50, date: new Date().toISOString(), type: 'quiz' }
      ])

    } catch (error) {
      toast.error('Failed to load profile data')
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    return date.toLocaleDateString()
  }

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'gold': return <Trophy className="h-5 w-5 text-yellow-500" />
      case 'silver': return <Award className="h-5 w-5 text-gray-400" />
      case 'bronze': return <Target className="h-5 w-5 text-orange-600" />
      default: return <Trophy className="h-5 w-5" />
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'goal': return <Target className="h-4 w-4 text-green-500" />
      case 'quiz': return <BookOpen className="h-4 w-4 text-blue-500" />
      case 'expense': return <TrendingUp className="h-4 w-4 text-red-500" />
      default: return <Calendar className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-2"></div>
          <div className="h-4 bg-muted rounded w-64"></div>
        </div>
      </div>
    )
  }

  const savingsPercentage = savingsProgress.target > 0 ? (savingsProgress.current / savingsProgress.target) * 100 : 0

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account and track your progress</p>
        </div>
      </div>

      {/* Profile Header */}
      <Card className="rounded-2xl shadow-soft">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile?.avatar_url} alt={profile?.name} />
                <AvatarFallback className="text-2xl font-bold">
                  {profile?.name?.charAt(0)?.toUpperCase() || <User />}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="icon" 
                variant="secondary" 
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">{profile?.name}</h2>
              <p className="text-muted-foreground">{profile?.email}</p>
              {profile?.bio && <p className="text-sm text-muted-foreground mt-1">{profile.bio}</p>}
            </div>
            <Button variant="outline" className="gap-2">
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress & Performance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Savings Progress */}
        <Card className="rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Savings Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Progress value={savingsPercentage} className="h-2" />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Rp {savingsProgress.current.toLocaleString()}</span>
                <span className="font-medium">Rp {savingsProgress.target.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground">{Math.round(savingsPercentage)}% completed</p>
            </div>
          </CardContent>
        </Card>

        {/* Challenges Completed */}
        <Card className="rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Challenges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">{challengesCompleted}</div>
              <p className="text-xs text-muted-foreground">Challenges completed</p>
            </div>
          </CardContent>
        </Card>

        {/* Quiz Performance */}
        <Card className="rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Quiz Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">{quizStats.average}%</div>
              <p className="text-xs text-muted-foreground">{quizStats.total} quizzes taken</p>
            </div>
          </CardContent>
        </Card>

        {/* Goals Achieved */}
        <Card className="rounded-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Goals Achieved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-foreground">{goalsAchieved}</div>
              <p className="text-xs text-muted-foreground">Financial goals reached</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Achievements */}
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3">
                  {getAchievementIcon(achievement.type)}
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{achievement.title}</h4>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                  {achievement.unlocked && (
                    <Badge variant="secondary" className="text-xs">Unlocked</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm truncate">{activity.title}</h4>
                      {activity.points && (
                        <Badge variant="outline" className="text-xs">+{activity.points} pts</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{formatRelativeDate(activity.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}