import { useState } from 'react';
import { entryQuestions } from '../config/entry-questions';
import { GenericButton } from './GenericButton';

// sha256 工具
async function sha256(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

const LOCALSTORAGE_KEY = 'entryQuizPassed';

interface EntryQuizPopupProps {
  isOpen: boolean;
  onPassed: () => void;
}

export function EntryQuizPopup({ isOpen, onPassed }: EntryQuizPopupProps) {
  const [answers, setAnswers] = useState<string[]>(Array(entryQuestions.length).fill(''));
  const [errorIndexes, setErrorIndexes] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (idx: number, value: string) => {
    setAnswers(prev => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const errors: number[] = [];
    for (let i = 0; i < entryQuestions.length; i++) {
      const q = entryQuestions[i];
      const userInput = answers[i]?.trim() || '';
      const hash = await sha256(userInput);
      if (hash !== q.answerHash) {
        errors.push(i);
      }
    }
    setErrorIndexes(errors);
    setSubmitting(false);
    if (errors.length === 0) {
      // get input value
      const inputValue = answers.map(answer => answer.trim()).join(',');
      console.log(inputValue);
      localStorage.setItem(LOCALSTORAGE_KEY, inputValue);
      onPassed();
    }
  };

  return (
    <div className="modal-backdrop entry-quiz-popup">
      <div className="modal entry-quiz-modal">
        <h2 style={{marginBottom: 16}}>請先完成下列問題才能進入</h2>
        <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          {entryQuestions.map((q, idx) => (
            <div key={idx} style={{marginBottom: 20}}>
              <div style={{fontWeight: 500, marginBottom: 8}}>{q.question}</div>
              {q.type === 'input' ? (
                <input
                  type="text"
                  value={answers[idx]}
                  onChange={e => handleChange(idx, e.target.value)}
                  className={errorIndexes.includes(idx) ? 'input-error' : ''}
                  style={{width: '100%', padding: 8, borderRadius: 4, border: errorIndexes.includes(idx) ? '1px solid red' : '1px solid #ccc'}}
                  disabled={submitting}
                />
              ) : q.type === 'select' && q.options ? (
                <select
                  value={answers[idx]}
                  onChange={e => handleChange(idx, e.target.value)}
                  className={errorIndexes.includes(idx) ? 'input-error' : ''}
                  style={{width: '100%', padding: 8, borderRadius: 4, border: errorIndexes.includes(idx) ? '1px solid red' : '1px solid #ccc'}}
                  disabled={submitting}
                >
                  <option value="">請選擇</option>
                  {q.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : null}
              {errorIndexes.includes(idx) && (
                <div style={{color: 'red', fontSize: 13, marginTop: 4}}>答案錯誤，請再試一次</div>
              )}
            </div>
          ))}

          <GenericButton onClick={handleSubmit} color='primary' text={submitting ? '驗證中...' : '提交'} />
          {/* <button
            type="submit"
            className="generic-btn"
            style={{width: '100%', background: '#4caf50', color: 'white', padding: 10, borderRadius: 4, fontSize: 16, marginTop: 8}}
            disabled={submitting}
          >
            {submitting ? '驗證中...' : '提交'}
          </button> */}
        </form>
      </div>
      {/* <style>{`
        .entry-quiz-popup {
          position: fixed; z-index: 9999; left: 0; top: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center;
        }
        .entry-quiz-modal {
          background: #fff; border-radius: 10px; padding: 32px 24px; min-width: 340px; box-shadow: 0 2px 16px rgba(0,0,0,0.18);
        }
        .input-error { border-color: red !important; }
      `}</style> */}
    </div>
  );
}

// 工具函數：檢查是否已通過
export function checkEntryQuizPassed(): boolean {
  console.log(localStorage.getItem(LOCALSTORAGE_KEY));
  return localStorage.getItem(LOCALSTORAGE_KEY) === entryQuestions.map(q => q.answerHash).join(',');
} 