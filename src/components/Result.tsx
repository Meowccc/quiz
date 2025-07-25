import type { UserAnswer, QuizQuestion, Language } from '../types/quiz';
import './Result.css';
import { Option } from './Option';
import { useState } from 'react';
import { GenericButton } from './GenericButton';

interface ResultProps {
  userAnswers: UserAnswer[];
  questions: QuizQuestion[];
  language: Language;
  stats: {
    correct: number;
    total: number;
    accuracy: number;
    totalTime: number;
    averageTime: number;
  };
  onRestart: () => void;
  onGoToQuestion: (index: number) => void;
  isValidQuestion: (question: QuizQuestion) => boolean;
}

export function Result({
  userAnswers,
  questions,
  language,
  stats,
  onRestart,
  onGoToQuestion,
  isValidQuestion
}: ResultProps) {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}分${remainingSeconds}秒`;
    }
    return `${remainingSeconds}秒`;
  };
  const [showError, setShowError] = useState<Boolean>(false);

  const getQuestionContent = (question: QuizQuestion) => {
    return question[language];
  };

  return (
    <div className="result-container">
      <div className="result-header">
        <h2>答題結果</h2>
        <div className="stats-overview">
          <div className="stat-item">
            <span className="stat-label">正確題數</span>
            <span className="stat-value correct">{stats.correct}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">總題數</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">正確率</span>
            <span className="stat-value">{stats.accuracy.toFixed(1)}%</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">平均時間</span>
            <span className="stat-value">{formatTime(stats.averageTime)}</span>
          </div>
        </div>
      </div>

      <div className="result-actions">
        <button className="restart-btn" onClick={onRestart}>
          重新開始
        </button>
        <GenericButton
          color={showError ? 'success' : 'danger'}
          onClick={() => setShowError(e => !e)}
          text={showError ? '顯示全部' : '顯示錯誤'}
        />
      </div>

      <div className="questions-review">
        <h3>題目回顧</h3>
        <div className="questions-list">
          {questions.filter(isValidQuestion).map((question, index) => {
            const userAnswer = userAnswers.find(
              answer => answer.questionNo === question.question_no
            );
            const content = getQuestionContent(question);
            const isCorrect = userAnswer?.isCorrect ?? false;

            if (showError && isCorrect) {
              console.log('question: ', question.question_no);
              return <></>;
            } 

            return (
              <div
                key={question.question_no}
                className={`question-item ${isCorrect ? 'correct' : 'incorrect'}`}
                onClick={() => onGoToQuestion(index)}
              >
                <div className="question-item-header">
                  <span className="question-item-number">
                    題目 {question.question_no}
                  </span>
                  <span className={`question-item-status ${isCorrect ? 'correct' : 'incorrect'}`}>
                    {isCorrect ? '✓ 正確' : '✗ 錯誤'}
                  </span>
                </div>
                <div className="question-item-content">
                  <p className="question-item-text">
                    {content.question}
                    {/* {content.question.length > 100 
                      ? `${content.question.substring(0, 100)}...` 
                      : content.question
                    } */}
                  </p>
                  <div className="question-item-answers">

                    <Option
                      selectedAnswers={userAnswer?.selectedAnswers || []}
                      content={content}
                      userAnswer={content.answers}
                      options={content.options}
                      showAnswer={true} isOptionCorrect={() => false}
                      isOptionSelected={() => false}
                      handleOptionSelect={() => { }}
                    />

                    <div className="answer-item">
                      <div>
                        <span className="answer-label">你的答案：</span>
                        <span className="user-answer">
                          {userAnswer?.selectedAnswers.join(', ') || '未作答'}
                        </span>
                      </div>
                      <div>
                        <span className="answer-label">正確答案：</span>
                        <span className="correct-answer">
                          {content.answers.join(', ')}
                        </span>
                      </div>
                    </div>
                    
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 