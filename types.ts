
export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswerIndex?: number;
}

export interface QuizState {
  currentQuestionIndex: number;
  userAnswers: Record<number, number>; // questionId -> optionIndex
  isFinished: boolean;

  // New State for Batch/Review
  answerHistory: Record<number, boolean>; // questionIndex -> wasCorrect
  isReviewing: boolean;
  reviewQueue: number[]; // Indices of questions to review
  mainProgressIndex: number; // The furthest index reached in normal flow

  // Exam Mode State
  startTime?: number;
  endTime?: number;
  score?: number;
  correctCount?: number;
}

export type AppMode = 'WELCOME' | 'QUIZ';
export type GameMode = 'PRACTICE' | 'EXAM';


export interface AIAnalysis {
  correctOptionIndex: number;
  explanation: string;
}



export type Subject = 'philosophy' | 'psychology';
