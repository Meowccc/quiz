import { useState, useCallback, useMemo } from 'react';
import type { 
  QuizQuestion, 
  QuizSettings, 
  UserAnswer
} from '../types/quiz';
import { shuffle } from '../utils/shuffle';

const initialSettings: QuizSettings = {
  language: 'zh',
  randomOrder: true,
  showAnswerImmediately: true
};

export function useQuiz() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [isCompleted, setCompleted] = useState(false);
  const [settings, setSettings] = useState<QuizSettings>(initialSettings);
  const [startTime, setStartTime] = useState<number | null>(null);

  const isValidQuestion = useCallback((question: QuizQuestion) => {
    if (!question || !question.zh || !question.en) return false;
    
    const zhContent = question.zh;
    const enContent = question.en;
    
    return !!(zhContent.question && zhContent.options && zhContent.answers && 
              enContent.question && enContent.options && enContent.answers);
  }, []);

  // 載入題目並隨機排序
  const loadQuestions = useCallback((newQuestions: QuizQuestion[]) => {
    console.log('loadQuestions: ', newQuestions);

    // question no 減1為index, 如果下一個question No 為空則給予空物件
    const expectSize = newQuestions[newQuestions.length - 1].question_no;

    const processedQuestions = [];
    for (let i = 0; i < expectSize; i++) {
      processedQuestions[i] = {"question_no": i + 1};
    }

    newQuestions.forEach((question) => {
      processedQuestions[question.question_no - 1] = question;
    });

    // const processedQuestions = newQuestions.map((question, index) => {
    //   if (index === newQuestions.length - 1) {
    //     return { ...question, question_no: '' };
    //   }
    //   return question;
    // });

    // const processedQuestions = settings.randomOrder 
    //   ? shuffle(newQuestions)
    //   : newQuestions;
    
    console.log('processedQuestions: ', processedQuestions);
    setQuestions(processedQuestions as QuizQuestion[]);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setCompleted(false);
    setStartTime(Date.now());
  }, [settings.randomOrder]);

  // 取得當前題目
  const currentQuestion = useMemo(() => {
    if (questions.length === 0 || currentQuestionIndex >= questions.length) {
      return null;
    }
    return questions[currentQuestionIndex];
  }, [questions, currentQuestionIndex]);

  // 取得當前題目的內容（根據語言）
  const currentQuestionContent = useMemo(() => {
    if (!currentQuestion) return null;
    return currentQuestion[settings.language];
  }, [currentQuestion, settings.language]);

  // 檢查當前題目是否有效
  const isCurrentQuestionValid = useMemo(() => {
    if (!currentQuestion) return false;
    return isValidQuestion(currentQuestion);
  }, [currentQuestion, isValidQuestion]);

  // 隨機排序選項
  // TODO 隨機排序選項 暫時移除
  const shuffledOptions = useMemo(() => {
    if (!currentQuestionContent || !isCurrentQuestionValid) return [];
    return currentQuestionContent.options
    // return shuffleOptions
  }, [currentQuestionContent, isCurrentQuestionValid]);

  // 提交答案
  const submitAnswer = useCallback((selectedAnswers: string[]) => {
    if (!currentQuestion || !currentQuestionContent || !isCurrentQuestionValid) return;

    const isCorrect = selectedAnswers.length === currentQuestionContent.answers.length &&
      selectedAnswers.every(answer => currentQuestionContent.answers.includes(answer));

    const newAnswer: UserAnswer = {
      questionNo: currentQuestion.question_no,
      selectedAnswers,
      isCorrect,
      timeSpent: Date.now() - (startTime || Date.now())
    };

    setUserAnswers(prev => [...prev, newAnswer]);

    // 如果設定為立即顯示答案，則不自動跳轉
    if (!settings.showAnswerImmediately) {
      nextQuestion();
    }
  }, [currentQuestion, currentQuestionContent, isCurrentQuestionValid, startTime, settings.showAnswerImmediately]);

  // 下一題
  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setCompleted(true);
    }
  }, [currentQuestionIndex, questions.length]);

  // 完成題目
  const completeQuiz = useCallback(() => {
    setCompleted(true);
  }, []);

  // 上一題
  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  // 跳轉到指定題目
  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  }, [questions.length]);

  // 更新設定
  const updateSettings = useCallback((newSettings: Partial<QuizSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // 重新開始
  const restart = useCallback(() => {
    const processedQuestions = settings.randomOrder 
      ? shuffle(questions)
      : questions;
    
    setQuestions(processedQuestions);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setCompleted(false);
    setStartTime(Date.now());
  }, [questions, settings.randomOrder]);

  // 計算統計資料
  const stats = useMemo(() => {
    if (userAnswers.length === 0) return null;

    const correct = userAnswers.filter(answer => answer.isCorrect).length;
    const total = userAnswers.length;
    const accuracy = (correct / total) * 100;
    const totalTime = userAnswers.reduce((sum, answer) => sum + answer.timeSpent, 0);

    return {
      correct,
      total,
      accuracy,
      totalTime,
      averageTime: totalTime / total
    };
  }, [userAnswers]);

  return {
    // 狀態
    questions ,
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
    
    // 方法
    loadQuestions,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    updateSettings,
    restart,
    completeQuiz
  };
} 