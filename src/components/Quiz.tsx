import { useMemo } from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { QuizSettings } from './QuizSettings';
import { Question } from './Question';
import { Result } from './Result';
import type { QuizSettings as QuizSettingsType } from '../types/quiz';
import './Quiz.css';

interface QuizProps {
  questions: any[];
  currentQuestion: any;
  currentQuestionContent: any;
  shuffledOptions: any[];
  currentQuestionIndex: number;
  userAnswers: any[];
  isCompleted: boolean;
  settings: QuizSettingsType;
  stats: any;
  onAnswer: (selectedAnswers: string[]) => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  onGoToQuestion: (index: number) => void;
  onSettingsChange: (settings: Partial<QuizSettingsType>) => void;
  onRestart: () => void;
}

export function Quiz({
  questions,
  currentQuestion,
  currentQuestionContent,
  shuffledOptions,
  currentQuestionIndex,
  userAnswers,
  isCompleted,
  settings,
  stats,
  onAnswer,
  onNextQuestion,
  onPreviousQuestion,
  onGoToQuestion,
  onSettingsChange,
  onRestart
}: QuizProps) {
  // 取得當前題目的用戶答案
  const currentUserAnswer = useMemo(() => {
    if (!currentQuestion) return null;
    return userAnswers.find(answer => answer.questionNo === currentQuestion.question_no);
  }, [currentQuestion, userAnswers]);

  // 檢查當前題目是否已作答
  const isCurrentQuestionAnswered = useMemo(() => {
    return currentUserAnswer !== undefined;
  }, [currentUserAnswer]);

  // 檢查是否應該顯示答案
  const shouldShowAnswer = useMemo(() => {
    return settings.showAnswerImmediately && isCurrentQuestionAnswered;
  }, [settings.showAnswerImmediately, isCurrentQuestionAnswered]);

  if (isCompleted) {
    return (
      <Result
        userAnswers={userAnswers}
        questions={questions}
        language={settings.language}
        stats={stats}
        onRestart={onRestart}
        onGoToQuestion={onGoToQuestion}
      />
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-info">
          <h2>答題系統</h2>
          <div className="progress-info">
            <span className="progress-text">
              第 {currentQuestionIndex + 1} 題 / 共 {questions.length} 題
            </span>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        <LanguageSwitcher
          currentLanguage={settings.language}
          onLanguageChange={(language) => onSettingsChange({ language })}
        />
      </div>

      <QuizSettings
        settings={settings}
        onSettingsChange={onSettingsChange}
      />

      {currentQuestion && currentQuestionContent && (
        <Question
          questionNo={currentQuestion.question_no}
          content={currentQuestionContent}
          shuffledOptions={shuffledOptions}
          onAnswer={onAnswer}
          showAnswer={shouldShowAnswer}
          userAnswer={currentUserAnswer?.selectedAnswers || []}
          isAnswered={isCurrentQuestionAnswered}
        />
      )}

      <div className="quiz-navigation">
        <button
          className="nav-btn prev-btn"
          onClick={onPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          上一題
        </button>
        
        <div className="question-jump">
          {questions.map((_, index) => (
            <button
              key={index}
              className={`jump-btn ${index === currentQuestionIndex ? 'active' : ''} ${
                userAnswers.find(answer => answer.questionNo === questions[index].question_no) 
                  ? 'answered' 
                  : ''
              }`}
              onClick={() => onGoToQuestion(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          className="nav-btn next-btn"
          onClick={onNextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          下一題
        </button>
      </div>

      {shouldShowAnswer && (
        <div className="answer-actions">
          <button
            className="continue-btn"
            onClick={onNextQuestion}
          >
            繼續下一題
          </button>
        </div>
      )}
    </div>
  );
} 