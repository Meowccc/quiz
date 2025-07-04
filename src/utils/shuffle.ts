import type { QuizOption } from '../types/quiz';

/**
 * Fisher-Yates 洗牌算法
 * 用於隨機排序陣列
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 隨機排序選項，但保持答案對應關係
 */
export function shuffleOptions(options: QuizOption[]): QuizOption[] {
  const optionEntries = options.map((option, index) => ({
    key: Object.keys(option)[0],
    value: Object.values(option)[0],
    originalIndex: index
  }));
  
  const shuffledEntries = shuffle(optionEntries);
  
  return shuffledEntries.map(entry => ({
    [entry.key]: entry.value
  }));
} 