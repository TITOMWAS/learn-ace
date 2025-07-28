export interface QuizEntry {
  id: string;
  date: string;
  score: number;
  weakAreas: string[];
  questionScores?: QuestionScore[];
  createdAt: string;
}

export interface QuestionScore {
  topic: string;
  scored: number;
  total: number;
  percentage: number;
}

export interface User {
  username: string;
  isLoggedIn: boolean;
}

export interface WeakAreaSummary {
  topic: string;
  frequency: number;
  averageScore: number;
}