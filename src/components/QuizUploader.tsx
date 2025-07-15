import { useCallback, useState, useEffect } from 'react';
import type { QuizQuestion } from '../types/quiz';
import './QuizUploader.css';

interface QuizUploaderProps {
  onQuestionsLoaded: (fileName: string, questions: QuizQuestion[]) => void;
}

export function QuizUploader({ onQuestionsLoaded }: QuizUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  // 掃描 localStorage 取得所有已上傳的題庫檔案
  useEffect(() => {
    const files: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('quiz-')) {
        files.push(key.replace('quiz-', ''));
      }
    }
    setUploadedFiles(files);
  }, []);

  // 點選清單直接載入題庫
  const handleSelectFile = (fileName: string) => {
    const data = localStorage.getItem(`quiz-${fileName}`);
    if (!data) return;
    try {
      const questions: QuizQuestion[] = JSON.parse(data);
      onQuestionsLoaded(fileName, questions);
    } catch (err) {
      setError('載入本地檔案失敗');
    }
  };

  // 刪除已上傳題庫
  const handleDeleteFile = (fileName: string) => {
    localStorage.removeItem(`quiz-${fileName}`);
    setUploadedFiles(files => files.filter(f => f !== fileName));
  };

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const text = await file.text();
      const questions: QuizQuestion[] = JSON.parse(text);

      // 驗證 JSON 格式
      if (!Array.isArray(questions)) {
        throw new Error('JSON 必須是陣列格式');
      }

      if (questions.length === 0) {
        throw new Error('題目不能為空');
      }

      // 只檢查基本格式，不檢查題目內容
      for (const question of questions) {
        if (!question.question_no) {
          console.log('error question: ', question);
          throw new Error('題目格式不正確，必須包含 question_no 欄位');
        }
      }

      // get file name
      const fileName = file.name;
      onQuestionsLoaded(fileName, questions);
    } catch (err) {
      setError(err instanceof Error ? err.message : '載入檔案失敗');
    } finally {
      setIsLoading(false);
    }
  }, [onQuestionsLoaded]);

  return (
    <div className="quiz-uploader">
      <div className="upload-container">
        <h2>上傳題目檔案</h2>
        <p>請選擇包含題目的 JSON 檔案</p>
        
        <div className="file-input-wrapper">
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            disabled={isLoading}
            id="quiz-file-input"
            className="file-input"
          />
          <label htmlFor="quiz-file-input" className="file-input-label">
            {isLoading ? '載入中...' : '選擇檔案'}
          </label>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="uploaded-files-list">
            <h4>已上傳題庫：</h4>
            <ul>
              {uploadedFiles.map(file => (
                <li key={file} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button className="uploaded-file-btn" type="button" onClick={() => handleSelectFile(file)}>
                    {file}
                  </button>
                  <button className="delete-file-btn" type="button" onClick={() => handleDeleteFile(file)} title="刪除題庫">🗑️</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="format-example">
          <h3>JSON 格式範例：</h3>
          <pre className="json-example">
{`[
  {
    "question_no": 194,
    "zh": {
      "question": "金融公司使用 AWS 來部署生成式 AI 模型...",
      "options": [
        {"A": "Amazon Macie"},
        {"B": "AWS Artifact"},
        {"C": "AWS Secrets Manager"},
        {"D": "AWS Config"}
      ],
      "answers": ["B"],
      "explanation": "AWS Artifact 提供隨選存取..."
    },
    "en": {
      "question": "A financial company uses AWS...",
      "options": [
        {"A": "Amazon Macie"},
        {"B": "AWS Artifact"},
        {"C": "AWS Secrets Manager"},
        {"D": "AWS Config"}
      ],
      "answers": ["B"],
      "explanation": "AWS Artifact provides on-demand access..."
    }
  }
]`}
          </pre>
        </div>
      </div>
    </div>
  );
} 