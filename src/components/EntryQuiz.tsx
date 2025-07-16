import { useState, useEffect } from 'react';
import { entryQuestions } from '../config/entry-questions';
import './EntryQuiz.css';
import { GenericButton } from './GenericButton';
import TextInput from './common/TextInput';

async function sha256(str: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

export function checkEntryQuizPassed(): boolean {
    console.log('checkEntryQuizPassed: ', localStorage.getItem(LOCALSTORAGE_KEY));
    return localStorage.getItem(LOCALSTORAGE_KEY) === entryQuestions.map(q => q.answerHash).join(',');
}

const LOCALSTORAGE_KEY = 'entryQuizPassed';

interface EntryQuizProps {
    isOpen: boolean;
    onPassed: () => void;
}

const EntryQuiz = ({ isOpen, onPassed }: EntryQuizProps) => {
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
            const hash = await sha256(userInput.toUpperCase());
            if (hash !== q.answerHash) {
                errors.push(i);
            }
        }
        setErrorIndexes(errors);
        setSubmitting(false);

        console.log('errors: ', errors);
        if (errors.length === 0) {
            const inputValue = answers.map(answer => answer.trim()).join(',');
            const encryptedValue = await sha256(inputValue.toUpperCase());
            localStorage.setItem(LOCALSTORAGE_KEY, encryptedValue);
            onPassed();
        }
    };

    useEffect(() => {
        if (checkEntryQuizPassed()) {
            onPassed();
        }
    }, [isOpen]);

    return (
        <div>
            <div className="modal-backdrop">
                <div className="modal-container">
                    <h2 className="modal-title modal-font">請先完成下列問題才能進入</h2>
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        {/* <TextInput/> */}
                        {entryQuestions.map((q, idx) => (
                            <div key={idx} >
                                <div className="form-group">
                                    <label className="question-label modal-font">{q.question} :</label>
                                    {q.type === 'input' ? (
                                        <TextInput value={answers[idx]} onChange={(value: string) => handleChange(idx, value)} disabled={submitting} />
                                        // <input
                                        //     type="text"
                                        //     value={answers[idx]}
                                        //     onChange={e => handleChange(idx, e.target.value)}
                                        //     className={`form-input ${errorIndexes.includes(idx) ? 'input-error' : ''}`}
                                        //     disabled={submitting}
                                        // />
                                    ) : q.type === 'select' && q.options ? (
                                        <select
                                            value={answers[idx]}
                                            onChange={e => handleChange(idx, e.target.value)}
                                            className={`form-select ${errorIndexes.includes(idx) ? 'input-error' : ''}`}
                                            disabled={submitting}
                                        >
                                            <option value="">請選擇</option>
                                            {q.options.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    ) : null}
                                </div>


                                {errorIndexes.includes(idx) && (
                                    <div className="error-text">答案錯誤，請再試一次</div>
                                )}
                            </div>
                        ))}

                        <GenericButton onClick={handleSubmit} color='primary' text={submitting ? '驗證中...' : '提交'} disabled={submitting} />
                        {/* <button
                            type="submit"
                            className="submit-button"
                            disabled={submitting}
                        >
                            {submitting ? '驗證中...' : '提交'}
                        </button> */}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EntryQuiz;