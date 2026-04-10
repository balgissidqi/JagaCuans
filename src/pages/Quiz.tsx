import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"

export default function QuizPage() {
  const { id } = useParams()

  const [quiz, setQuiz] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)

  const [showPoints, setShowPoints] = useState(false)

  useEffect(() => {
    if (id) fetchQuiz()
  }, [id])

const fetchQuiz = async () => {
  const { data, error } = await supabase
    .from("quizzes")
    .select(`
      id,
      question,
      quiz_options (
        id,
        option_text,
        is_correct
      )
    `)
    .eq("education_id", id)

  console.log("ERROR:", error)
  console.log("DATA:", data)

  setQuiz(data || [])
}


  const currentQuestion = quiz[currentIndex]

  const handleAnswer = (option) => {
  setAnswers({
    ...answers,
    [currentQuestion.id]: option
  })
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
     if (!correctOption) return
    if (answers[q.id] === correctOption?.option_text) {
      correct++
    }
  })

  const finalScore = correct * 10
  setScore(finalScore)
  setShowResult(true)

  setShowPoints(true)
  setTimeout(() => setShowPoints(false), 1500)

  // Add points to leaderboard
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

  if (quiz.length === 0) {
    return <div className="p-6">Loading quiz...</div>
  }

  return (
    <div className="p-6 max-w-xl mx-auto">

      {/* 🎯 QUESTION */}
      {!showResult && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">
            Soal {currentIndex + 1} / {quiz.length}
          </h2>
          
          <div className="w-full bg-gray-200 h-2 rounded">
            <div
                className="bg-blue-500 h-2 rounded"
                style={{ width: `${((currentIndex + 1) / quiz.length) * 100}%` }}
            />
            </div>
          <p className="text-lg">{currentQuestion.question}</p>

          <div className="space-y-2">
            {currentQuestion?.quiz_options?.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt.option_text)}
                className={`w-full text-left p-3 rounded-lg border transition ${
                answers[currentQuestion.id] === opt.option_text
                    ? "bg-blue-500 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                {opt.option_text}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={!answers[currentQuestion?.id]}
            className="w-full bg-black text-white p-3 rounded-lg mt-4 disabled:opacity-50"
            >
            {currentIndex === quiz.length - 1 ? "Submit" : "Next"}
          </button>
        </div>
      )}

      {/* 🏆 RESULT */}
      {showResult && (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Hasil Quiz 🎉</h2>
          <p className="text-lg">Skor kamu: {score}</p>
        </div>
      )}

      {/* ✨ FLOATING POINT */}
      {showPoints && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-4xl font-bold text-green-500 animate-float">
            +{score} Points ✨
          </div>
        </div>
      )}
    </div>
  )

}