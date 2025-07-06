import { useState } from 'react'
import { QuizUploader } from './components/QuizUploader'
import { Quiz } from './components/Quiz'
import { useQuiz } from './hooks/useQuiz'
import type { QuizQuestion } from './types/quiz'
import './App.css'
import { SettingsModal } from './components/SettingsModal'

function App() {
  // const [initQuestions, setInitQuestions] = useState<QuizQuestion[]>([])
  const [isStarted, setIsStarted] = useState(false)

  const {
    questions,
    currentQuestion,
    currentQuestionContent,
    shuffledOptions,
    currentQuestionIndex,
    userAnswers,
    isCompleted,
    settings,
    stats,
    isCurrentQuestionValid,
    isValidQuestion,
    loadQuestions,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    updateSettings,
    restart,
    completeQuiz
  } = useQuiz()

  const handleQuestionsLoaded = (newQuestions: QuizQuestion[]) => {
    // setInitQuestions(newQuestions)
    loadQuestions(newQuestions)
    setIsStarted(true)
  }

  const handleRestart = () => {
    setIsStarted(false)
    // setInitQuestions([])
    restart()
  }

  const [isSettingsOpen, setIsSettingsOpen] = useState(true);

  if (!isStarted) {
    return (
      <div className="app">
        
        <QuizUploader onQuestionsLoaded={handleQuestionsLoaded} />
        <SettingsModal isOpen={isSettingsOpen} settings={settings} onSettingsChange={updateSettings} onClose={() => setIsSettingsOpen(false)} />
      </div>
    )
  }

  return (
    <div className="app">
      <div className="app-container">
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
          isCurrentQuestionValid={isCurrentQuestionValid}
          isValidQuestion={isValidQuestion}
          onAnswer={submitAnswer}
          onNextQuestion={nextQuestion}
          onPreviousQuestion={previousQuestion}
          onGoToQuestion={goToQuestion}
          onSettingsChange={updateSettings}
          onRestart={handleRestart}
          onComplete={completeQuiz}
        />
      </div>
    </div >
  )
}

export default App
