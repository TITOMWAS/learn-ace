import { QuizEntry, QuestionScore, WeakAreaSummary } from '@/types/quiz';

export const parseQuestionScores = (input: string): QuestionScore[] => {
  if (!input.trim()) return [];
  
  const lines = input.trim().split('\n');
  const scores: QuestionScore[] = [];
  
  for (const line of lines) {
    const match = line.trim().match(/^([^|]+)\|(\d+)\/(\d+)$/);
    if (match) {
      const [, topic, scored, total] = match;
      const scoredNum = parseInt(scored, 10);
      const totalNum = parseInt(total, 10);
      
      if (totalNum > 0) {
        scores.push({
          topic: topic.trim(),
          scored: scoredNum,
          total: totalNum,
          percentage: Math.round((scoredNum / totalNum) * 100)
        });
      }
    }
  }
  
  return scores;
};

export const detectWeakAreas = (questionScores: QuestionScore[]): string[] => {
  return questionScores
    .filter(score => score.percentage < 50)
    .map(score => score.topic);
};

export const normalizeWeakAreas = (areas: string[]): string[] => {
  const normalized = areas.map(area => 
    area.trim()
      .toLowerCase()
      .split(/[,;]/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
  ).flat();
  
  // Remove duplicates and capitalize
  const unique = [...new Set(normalized)];
  return unique.map(area => 
    area.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );
};

export const calculateWeakAreaSummary = (entries: QuizEntry[]): WeakAreaSummary[] => {
  const topicMap = new Map<string, { count: number; scores: number[] }>();
  
  entries.forEach(entry => {
    entry.weakAreas.forEach(area => {
      if (!topicMap.has(area)) {
        topicMap.set(area, { count: 0, scores: [] });
      }
      const data = topicMap.get(area)!;
      data.count++;
      
      // Find related question scores
      const relatedScore = entry.questionScores?.find(qs => 
        qs.topic.toLowerCase().includes(area.toLowerCase()) ||
        area.toLowerCase().includes(qs.topic.toLowerCase())
      );
      
      if (relatedScore) {
        data.scores.push(relatedScore.percentage);
      }
    });
  });
  
  return Array.from(topicMap.entries()).map(([topic, data]) => ({
    topic,
    frequency: data.count,
    averageScore: data.scores.length > 0 
      ? Math.round(data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length)
      : 0
  })).sort((a, b) => b.frequency - a.frequency);
};

export const getMotivationalQuotes = (): string[] => [
  "Keep learning! Every expert was once a beginner.",
  "Progress, not perfection. You're improving every day!",
  "Knowledge is the best investment you can make.",
  "Small steps lead to big achievements!",
  "Every mistake is a stepping stone to success.",
  "Learning never exhausts the mind - Leonardo da Vinci",
  "The more you learn, the more you grow!",
  "Excellence is a continuous process, not an accident."
];

export const getRandomQuote = (): string => {
  const quotes = getMotivationalQuotes();
  return quotes[Math.floor(Math.random() * quotes.length)];
};