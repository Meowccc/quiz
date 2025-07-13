export interface QuizOption {
  [key: string]: string;
}

export interface QuizContent {
  question: string;
  options: QuizOption[];
  answers: string[];
  explanation: string;
}

export interface QuizQuestion {
  question_no: number;
  zh: QuizContent;
  en: QuizContent;
  isControversial?: boolean; // 是否為爭議題目
}

export type Language = 'zh' | 'en' | 'cn';

export interface QuizSettings {
  language: Language;
  randomOrder: boolean;
  showAnswerImmediately: boolean;
}

export interface UserAnswer {
  questionNo: number;
  selectedAnswers: string[];
  isCorrect: boolean;
  timeSpent: number;
}

export interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  isCompleted: boolean;
  settings: QuizSettings;
  startTime: number | null;
} 