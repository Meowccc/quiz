import './QuestionMissing.css';

interface QuestionMissingProps {
  questionNo: number;
  language: 'zh' | 'en' | 'cn';
}

export function QuestionMissing({ questionNo, language }: QuestionMissingProps) {
  const messages = {
    cn:{
        title: '题目缺失',
        description: '此题目目前没有内容，请参考题库内容。',
        backButton: '返回题目列表'
    },
    zh: {
      title: '題目從缺',
      description: '此題目目前沒有內容，請參考題庫內容。',
      backButton: '返回題目列表'
    },
    en: {
      title: 'Question Missing',
      description: 'This question has no content. Please refer to the question bank.',
      backButton: 'Back to Questions'
    }
  };

  const message = messages[language];

  return (
    <div className="question-missing">
      <div className="missing-icon">❓</div>
      <h2 className="missing-title">{message.title}</h2>
      <p className="missing-description">
        題目 {questionNo} - {message.description}
      </p>
      <div className="missing-actions">
        <button className="missing-btn">
          {message.backButton}
        </button>
      </div>
    </div>
  );
} 