import { useState } from 'react';
import type { QuizContent, QuizOption } from '../types/quiz';
import './Question.css';
import { GenericButton } from './GenericButton';

interface QuestionProps {
  questionNo: number;
  content: QuizContent;
  shuffledOptions: QuizOption[];
  onAnswer: (selectedAnswers: string[]) => void;
  showAnswer?: boolean;
  userAnswer?: string[];
  isAnswered?: boolean;
  isControversial?: boolean;
  languageSwitcher?: any;
}

export function Question({
  questionNo,
  content,
  shuffledOptions,
  onAnswer,
  showAnswer = false,
  userAnswer = [],
  isAnswered = false,
  isControversial = false,
  languageSwitcher,
}: QuestionProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);

  // 檢查是否為多選題
  const isMultipleChoice = content.answers.length > 1;

  // 處理選項選擇
  const handleOptionSelect = (optionKey: string) => {
    if (isAnswered) return;

    if (isMultipleChoice) {
      setSelectedAnswers(prev => {
        if (prev.includes(optionKey)) {
          return prev.filter(key => key !== optionKey);
        } else {
          return [...prev, optionKey];
        }
      });
    } else {
      setSelectedAnswers([optionKey]);
    }
  };

  // 提交答案
  const handleSubmit = () => {
    if (selectedAnswers.length > 0) {
      onAnswer(selectedAnswers);
      handleControversialClick();
    }
  };

  // 檢查選項是否正確
  const isOptionCorrect = (optionKey: string) => {
    return content.answers.includes(optionKey);
  };

  // 檢查選項是否被用戶選擇
  const isOptionSelected = (optionKey: string) => {
    return showAnswer ? userAnswer.includes(optionKey) : selectedAnswers.includes(optionKey);
  };

  // 取得選項的樣式類別
  const getOptionClass = (optionKey: string) => {
    if (!showAnswer) {
      return isOptionSelected(optionKey) ? 'option selected' : 'option';
    }

    if (isOptionCorrect(optionKey)) {
      return 'option correct';
    } else if (isOptionSelected(optionKey)) {
      return 'option incorrect';
    } else {
      return 'option';
    }
  };

  // 處理爭議題目圖示點擊
  const handleControversialClick = () => {
    alert('此為爭議題(跟其他份題目的答案有所出入或是跟微信公眾號的答案有所出入), 請自行斟酌');
  };

  return (
    <div className="question-container">
      <div className="question-header">
        <div>
          <span className="question-number">題目 {questionNo}</span>
          {isControversial && (
              <span
                  className="controversial-icon"
                  title="爭議題目"
                  onClick={handleControversialClick}
              >
            ⚠️
          </span>
          )}
        </div>


        {languageSwitcher}
      </div>

      <div className="question-content">
        <h3 className="question-text">{content.question}</h3>
      </div>

      <div className="options-container">
        {shuffledOptions.map((option) => {
          const optionKey = Object.keys(option)[0];
          const optionValue = Object.values(option)[0];
          
          return (
            <div
              key={optionKey}
              className={getOptionClass(optionKey)}
              onClick={() => handleOptionSelect(optionKey)}
            >
              <div className="option-content">
                <span className="option-label">{optionKey}.</span>
                <span className="option-text">{optionValue}</span>
              </div>
              {showAnswer && isOptionCorrect(optionKey) && (
                <span className="correct-indicator">✓</span>
              )}
              {showAnswer && isOptionSelected(optionKey) && !isOptionCorrect(optionKey) && (
                <span className="incorrect-indicator">✗</span>
              )}
            </div>
          );
        })}
      </div>

      {isMultipleChoice && (
          <span className="multiple-choice-hint">（多選題）</span>
        )}
      {!isAnswered && (

        <GenericButton onClick={handleSubmit} text="確認答案" color="primary" />
      )}

      {showAnswer && content?.explanation && (
        <div className="answer-section">
          <div className="explanation">
            <h4>解釋：</h4>
            <p>{content.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
} 