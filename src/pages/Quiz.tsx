import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface QuizOption {
  id: string
  option_text: string
  is_correct: boolean
}

interface QuizQuestion {
  id: string
  question: string
  quiz_options: QuizOption[]
}

export default function QuizPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [showPoints, setShowPoints] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) fetchQuiz()
  }, [id])

  const fetchQuiz = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("quizzes")
      .select(`id, question, quiz_options ( id, option_text, is_correct )`)
      .eq("education_id", id)

    if (error) {
      console.log(error)
    } else {
      setQuiz((data as QuizQuestion[]) || [])
    }
    setLoading(false)
  }

  const currentQuestion = quiz[currentIndex]

  const handleAnswer = (optionText: string) => {
    if (showResult) return
    setAnswers({ ...answers, [currentQuestion.id]: optionText })
  }

  const handleNext = () => {
    if (currentIndex < quiz.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    let correct = 0
    quiz.forEach((q) => {
      const correctOption = q.quiz_options.find(opt => opt.is_correct)
      if (correctOption && answers[q.id] === correctOption.option_text) {
        correct++
      }
    })

    const finalScore = correct * 10
    setScore(finalScore)
    setShowResult(true)
    setShowPoints(true)
    setTimeout(() => setShowPoints(false), 1500)

    if (finalScore > 0) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.rpc("add_leaderboard_points", {
          _user_id: user.id,
          _points: finalScore,
        })
      }
    }
  }

  if (loading) {
    return <div className="p-6 text-muted-foreground">Memuat quiz...</div>
  }

  if (quiz.length === 0) {
    return (
      <div className="p-6 text-center space-y-4">
        <p className="text-muted-foreground">Belum ada quiz untuk materi ini.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Kembali
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Kembali ke Edukasi
      </Button>

      {/* QUESTION VIEW */}
      {!showResult && (
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">
                Soal {currentIndex + 1} / {quiz.length}
              </h2>
              <span className="text-sm text-muted-foreground">
                {Math.round(((currentIndex + 1) / quiz.length) * 100)}%
              </span>
            </div>

            <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / quiz.length) * 100}%` }}
              />
            </div>

            <p className="text-base font-medium text-foreground">{currentQuestion.question}</p>

            <div className="space-y-2">
              {currentQuestion?.quiz_options?.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleAnswer(opt.option_text)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    answers[currentQuestion.id] === opt.option_text
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card hover:bg-muted border-border"
                  }`}
                >
                  {opt.option_text}
                </button>
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion?.id]}
              className="w-full"
            >
              {currentIndex === quiz.length - 1 ? "Submit" : "Selanjutnya"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* RESULT VIEW */}
      {showResult && (
        <div className="space-y-6">
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 text-center space-y-3">
              <h2 className="text-2xl font-bold text-foreground">Hasil Quiz 🎉</h2>
              <p className="text-4xl font-bold text-primary">{score} Poin</p>
              <p className="text-muted-foreground">
                {quiz.filter(q => {
                  const correct = q.quiz_options.find(o => o.is_correct)
                  return correct && answers[q.id] === correct.option_text
                }).length} dari {quiz.length} jawaban benar
              </p>
            </CardContent>
          </Card>

          <h3 className="text-lg font-semibold text-foreground">Pembahasan</h3>
          {quiz.map((q, idx) => {
            const correctOption = q.quiz_options.find(o => o.is_correct)
            const userAnswer = answers[q.id]
            const isCorrect = correctOption && userAnswer === correctOption.option_text

            return (
              <Card key={q.id} className="rounded-2xl shadow-sm">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                    )}
                    <p className="font-medium text-foreground">
                      {idx + 1}. {q.question}
                    </p>
                  </div>

                  <div className="space-y-1.5 ml-7">
                    {q.quiz_options.map((opt) => {
                      let style = "bg-card border-border text-foreground"
                      if (opt.is_correct) {
                        style = "bg-green-50 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300"
                      } else if (userAnswer === opt.option_text && !opt.is_correct) {
                        style = "bg-red-50 border-red-300 text-red-800 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300"
                      }

                      return (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-lg border text-sm ${style}`}
                        >
                          {opt.option_text}
                          {opt.is_correct && (
                            <span className="ml-2 text-xs font-semibold">✓ Jawaban Benar</span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })}

          <Button className="w-full" onClick={() => navigate(-1)}>
            Kembali ke Edukasi
          </Button>
        </div>
      )}

      {/* FLOATING POINT ANIMATION */}
      {showPoints && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="text-4xl font-bold text-green-500 animate-bounce">
            +{score} Points ✨
          </div>
        </div>
      )}
    </div>
  )
}
