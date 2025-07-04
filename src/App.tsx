import { useState } from 'react'
import { QuizUploader } from './components/QuizUploader'
import { Quiz } from './components/Quiz'
import { useQuiz } from './hooks/useQuiz'
import type { QuizQuestion } from './types/quiz'
import './App.css'

function App() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [isStarted, setIsStarted] = useState(false)
  
  const {
    currentQuestion,
    currentQuestionContent,
    shuffledOptions,
    currentQuestionIndex,
    userAnswers,
    isCompleted,
    settings,
    stats,
    loadQuestions,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    updateSettings,
    restart
  } = useQuiz()

  const handleQuestionsLoaded = (newQuestions: QuizQuestion[]) => {
    setQuestions(newQuestions)
    loadQuestions(newQuestions)
    setIsStarted(true)
  }

  const handleRestart = () => {
    setIsStarted(false)
    setQuestions([])
    restart()
  }

  if (!isStarted) {
    return (
      <div className="app">
        <QuizUploader onQuestionsLoaded={handleQuestionsLoaded} />
      </div>
    )
  }

  return (
    <div className="app">
      <Quiz
        questions={questions}
        currentQuestion={currentQuestion}
        currentQuestionContent={currentQuestionContent}
        shuffledOptions={shuffledOptions}
        currentQuestionIndex={currentQuestionIndex}
        userAnswers={userAnswers}
        isCompleted={isCompleted}
        settings={settings}
        stats={stats}
        onAnswer={submitAnswer}
        onNextQuestion={nextQuestion}
        onPreviousQuestion={previousQuestion}
        onGoToQuestion={goToQuestion}
        onSettingsChange={updateSettings}
        onRestart={handleRestart}
      />
    </div>
  )
}

export default App
