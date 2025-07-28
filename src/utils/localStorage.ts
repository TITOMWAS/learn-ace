import { QuizEntry, User } from '@/types/quiz';

const QUIZ_STORAGE_KEY = 'elearning_quiz_data';
const USER_STORAGE_KEY = 'elearning_user_data';

export const saveQuizEntry = (entry: QuizEntry): void => {
  const existingEntries = getQuizEntries();
  const updatedEntries = [...existingEntries, entry];
  localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(updatedEntries));
};

export const getQuizEntries = (): QuizEntry[] => {
  try {
    const stored = localStorage.getItem(QUIZ_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error parsing quiz entries:', error);
    return [];
  }
};

export const deleteQuizEntry = (id: string): void => {
  const entries = getQuizEntries();
  const filteredEntries = entries.filter(entry => entry.id !== id);
  localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(filteredEntries));
};

export const saveUser = (user: User): void => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

export const getUser = (): User | null => {
  try {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

export const logoutUser = (): void => {
  localStorage.removeItem(USER_STORAGE_KEY);
};

export const exportToCSV = (entries: QuizEntry[]): void => {
  const headers = ['Date', 'Score (%)', 'Weak Areas'];
  const rows = entries.map(entry => [
    entry.date,
    entry.score.toString(),
    entry.weakAreas.join('; ')
  ]);
  
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `quiz-tracker-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};