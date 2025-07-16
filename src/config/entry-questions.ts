
export interface EntryQuestion {
  id: number;
  question: string;
  type: 'input' | 'select';
  answerHash: string; // sha256("正確答案")
  options?: string[];
}

export const entryQuestions: EntryQuestion[] = [
  // 範例題目，請自行填寫
  {
    id: 1,
    question: "我領導是誰",
    type: "input",
    answerHash: "58dd8d36b5258fc559b2ab0cb0ad7097a4302dde3ddabfedd9aec0138111601e",
  }
];
