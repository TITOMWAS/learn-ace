import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { QuizEntry } from '@/types/quiz';
import { parseQuestionScores, detectWeakAreas, normalizeWeakAreas } from '@/utils/quizAnalysis';
import { saveQuizEntry } from '@/utils/localStorage';
import { PlusCircle, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuizEntryFormProps {
  onEntryAdded: () => void;
}

export const QuizEntryForm = ({ onEntryAdded }: QuizEntryFormProps) => {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [score, setScore] = useState('');
  const [manualWeakAreas, setManualWeakAreas] = useState('');
  const [questionScoresInput, setQuestionScoresInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const scoreNum = parseFloat(score);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 100) {
      toast({
        title: "Invalid Score",
        description: "Please enter a score between 0 and 100",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Parse question scores if provided
      const questionScores = parseQuestionScores(questionScoresInput);
      
      // Determine weak areas
      let weakAreas: string[] = [];
      if (questionScores.length > 0) {
        // Auto-detect from question scores
        weakAreas = detectWeakAreas(questionScores);
      } else if (manualWeakAreas.trim()) {
        // Use manual input
        weakAreas = normalizeWeakAreas(manualWeakAreas.split(','));
      }

      const entry: QuizEntry = {
        id: `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        date,
        score: scoreNum,
        weakAreas,
        questionScores: questionScores.length > 0 ? questionScores : undefined,
        createdAt: new Date().toISOString()
      };

      saveQuizEntry(entry);
      onEntryAdded();

      // Reset form
      setScore('');
      setManualWeakAreas('');
      setQuestionScoresInput('');
      setDate(new Date().toISOString().split('T')[0]);

      toast({
        title: "Quiz Recorded!",
        description: `Score: ${scoreNum}% | Weak areas: ${weakAreas.length || 'None'}`,
        variant: "default"
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save quiz entry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-card animate-slide-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-primary" />
          Record New Quiz
        </CardTitle>
        <CardDescription>
          Track your performance and identify areas for improvement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quiz-date">Date</Label>
              <Input
                id="quiz-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="transition-all duration-300 focus:shadow-gentle"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quiz-score">Total Score (%)</Label>
              <div className="relative">
                <Input
                  id="quiz-score"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  placeholder="85.5"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="transition-all duration-300 focus:shadow-gentle pr-8"
                  required
                />
                <Calculator className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="question-scores">Question Scores (Optional)</Label>
            <Textarea
              id="question-scores"
              placeholder="Enter question scores in format: Topic|Scored/Total&#10;Example:&#10;Quadratic Functions|2/5&#10;Trigonometry|1/3&#10;Calculus|4/4"
              value={questionScoresInput}
              onChange={(e) => setQuestionScoresInput(e.target.value)}
              className="min-h-[100px] transition-all duration-300 focus:shadow-gentle"
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Format: "Topic|Scored/Total" (one per line). Scores below 50% will be auto-detected as weak areas.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="weak-areas">Manual Weak Areas (if no question scores)</Label>
            <Input
              id="weak-areas"
              placeholder="Quadratic Functions, Trigonometry, Financial Mathematics"
              value={manualWeakAreas}
              onChange={(e) => setManualWeakAreas(e.target.value)}
              className="transition-all duration-300 focus:shadow-gentle"
            />
            <p className="text-xs text-muted-foreground">
              Comma-separated list. Only used if question scores are not provided.
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-primary hover:bg-primary-hover transition-all duration-300 transform hover:scale-[1.02] shadow-gentle"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Recording Quiz...
              </div>
            ) : (
              'Record Quiz'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};