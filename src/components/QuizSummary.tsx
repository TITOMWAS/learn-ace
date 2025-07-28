import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QuizEntry } from '@/types/quiz';
import { calculateWeakAreaSummary } from '@/utils/quizAnalysis';
import { TrendingUp, Calendar, AlertTriangle, Target } from 'lucide-react';

interface QuizSummaryProps {
  entries: QuizEntry[];
}

export const QuizSummary = ({ entries }: QuizSummaryProps) => {
  if (entries.length === 0) {
    return (
      <Card className="shadow-card animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Learning Summary
          </CardTitle>
          <CardDescription>Your progress overview will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Record your first quiz to see your learning analytics!
          </p>
        </CardContent>
      </Card>
    );
  }

  const latestEntry = entries[entries.length - 1];
  const averageScore = entries.reduce((sum, entry) => sum + entry.score, 0) / entries.length;
  const weakAreaSummary = calculateWeakAreaSummary(entries);
  const topWeakAreas = weakAreaSummary.slice(0, 5);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-card animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Total Quizzes</span>
            <Badge variant="outline" className="font-bold">
              {entries.length}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Average Score</span>
            <Badge variant={getScoreBadgeVariant(averageScore)} className="font-bold">
              {averageScore.toFixed(1)}%
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Latest Score</span>
            <Badge variant={getScoreBadgeVariant(latestEntry.score)} className="font-bold">
              {latestEntry.score}%
            </Badge>
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Latest Quiz</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(latestEntry.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            Areas to Focus
          </CardTitle>
          <CardDescription>
            Your most frequent weak areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topWeakAreas.length > 0 ? (
            <div className="space-y-3">
              {topWeakAreas.map((area, index) => (
                <div key={area.topic} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{area.topic}</p>
                    <p className="text-xs text-muted-foreground">
                      Appears in {area.frequency} quiz{area.frequency !== 1 ? 's' : ''}
                      {area.averageScore > 0 && ` • Avg: ${area.averageScore}%`}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${
                      index === 0 ? 'border-destructive text-destructive' : 
                      index === 1 ? 'border-warning text-warning' : 
                      'border-muted-foreground'
                    }`}
                  >
                    {area.frequency}x
                  </Badge>
                </div>
              ))}
              
              {latestEntry.weakAreas.length > 0 && (
                <div className="pt-3 border-t">
                  <p className="text-sm font-medium mb-2">Latest Weak Areas:</p>
                  <div className="flex flex-wrap gap-1">
                    {latestEntry.weakAreas.map((area) => (
                      <Badge key={area} variant="secondary" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No weak areas identified yet. Keep recording your quizzes!
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};