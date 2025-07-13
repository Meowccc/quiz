import { useMemo, useState } from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SettingsButton } from './SettingsButton';
import { SettingsModal } from './SettingsModal';
import { Question } from './Question';
import { QuestionMissing } from './QuestionMissing';
import { Result } from './Result';
import type { QuizSettings as QuizSettingsType } from '../types/quiz';
import './Quiz.css';
import { ResetButton } from './ResetButton';
import { GenericButton } from './GenericButton';

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
  isCurrentQuestionValid: boolean;
  isValidQuestion: (question: any) => boolean;
  onAnswer: (selectedAnswers: string[]) => void;
  onNextQuestion: () => void;
  onPreviousQuestion: () => void;
  onGoToQuestion: (index: number) => void;
  onSettingsChange: (settings: Partial<QuizSettingsType>) => void;
  onRestart: () => void;
  onComplete: () => void;
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
  isCurrentQuestionValid,
  isValidQuestion,
  onAnswer,
  onNextQuestion,
  onPreviousQuestion,
  onGoToQuestion,
  onSettingsChange,
  onRestart,
  onComplete
}: QuizProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
    console.log('isCompleted: ', isCompleted, questions);
    return (
      <Result
        userAnswers={userAnswers}
        questions={questions}
        language={settings.language}
        stats={stats}
        onRestart={onRestart}
        onGoToQuestion={onGoToQuestion}
        isValidQuestion={isValidQuestion}
      />
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="quiz-info">
          <div className='quiz-info-header'>
            <h2 className='quiz-title'>Quiz App</h2>
            <div style={{ marginRight: 'auto' }}>
              <ResetButton onClick={onRestart} />
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <SettingsButton onClick={() => setIsSettingsOpen(true)} />
            </div>
          </div>
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
      </div>


      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onSettingsChange={onSettingsChange}
        onClose={() => setIsSettingsOpen(false)}
      />
      {/* <SettingsButton onClick={() => setIsSettingsOpen(true)} />
      <div className="quiz-controls">
        <LanguageSwitcher
          currentLanguage={settings.language}
          onLanguageChange={(language) => onSettingsChange({ language })}
        />
      </div> */}

      <div className="quiz-navigation">
        <button
          className="nav-btn prev-btn"
          onClick={onPreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          上一題
        </button>

        <button
          className="nav-btn next-btn"
          onClick={onNextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
        >
          下一題
        </button>
      </div>

      {currentQuestion && !isCurrentQuestionValid ? (
        <QuestionMissing
          questionNo={currentQuestion.question_no}
          language={settings.language}
        />
      ) : currentQuestion && currentQuestionContent && isCurrentQuestionValid ? (
        <Question
          questionNo={currentQuestion.question_no}
          content={currentQuestionContent}
          shuffledOptions={shuffledOptions}
          onAnswer={onAnswer}
          showAnswer={shouldShowAnswer}
          userAnswer={currentUserAnswer?.selectedAnswers || []}
          isAnswered={isCurrentQuestionAnswered}
          isControversial={currentQuestion?.isControversial}
          languageSwitcher={
            <LanguageSwitcher
              currentLanguage={settings.language}
              onLanguageChange={(language) => onSettingsChange({ language })}
            />
          }
        />
      ) : null}

      {/* 完成題目xxx */}
      <GenericButton onClick={onComplete} text="提交題目" color="success" />

      <div className="question-jump">
        {questions.map((question, index) => {
          const isQuestionValid = isValidQuestion(question);
          const isAnswered = userAnswers.find(answer => answer.questionNo === question.question_no);
          const isCorrect = isAnswered?.isCorrect;
          return (
            <button
              key={index}
              className={`jump-btn 
                ${index === currentQuestionIndex ? 'active' : ''}  
                ${!isQuestionValid ? 'invalid' : ''} 
                ${isAnswered && isCorrect ? 'correct' : ''} 
                ${isAnswered && !isCorrect ? 'incorrect' : ''}`
              }
              onClick={() => onGoToQuestion(index)}
              // ${isAnswered ? 'answered' : ''}
              title={!isQuestionValid ? '題目從缺' : ''}
            >
              {question.question_no}
            </button>
          );
        })}
      </div>


    </div>
  );
} 