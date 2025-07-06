
import { useState } from 'react';
import type { QuizContent, QuizOption } from '../types/quiz';
import './Option.css';

interface OptionProps {
    options: QuizOption[];
    showAnswer?: boolean;
    content: QuizContent;
    userAnswer: string[];
    selectedAnswers: string[];
    isOptionCorrect: (optionKey: string) => boolean;
    isOptionSelected: (optionKey: string) => boolean;
    handleOptionSelect: (optionKey: string) => void;
}


export function Option({
    options,
    showAnswer,
    content,
    userAnswer,
    selectedAnswers,
    handleOptionSelect,
}: OptionProps) {

    // 檢查選項是否正確
  const isOptionCorrect = (optionKey: string) => {
    return content.answers.includes(optionKey);
  };

  // 檢查選項是否被用戶選擇
  const isOptionSelected = (optionKey: string) => {
    console.log('isOptionSelected: ', optionKey, showAnswer, userAnswer, selectedAnswers);
    return selectedAnswers.includes(optionKey);
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

    return (
        <div className="options-container">
            {options.map((option) => {
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
    )
}