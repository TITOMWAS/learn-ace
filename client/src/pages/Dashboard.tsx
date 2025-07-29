import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { QuizEntryForm } from '@/components/QuizEntryForm';
import { QuizSummary } from '@/components/QuizSummary';
import { QuizTable } from '@/components/QuizTable';
import { BookAnimation } from '@/components/BookAnimation';
import { ImageUploadSection } from '@/components/ImageUploadSection';
import { getQuizEntries, getUser, logoutUser } from '@/utils/localStorage';
import { getRandomQuote } from '@/utils/quizAnalysis';
import { QuizEntry } from '@/types/quiz';
import { LogOut, BookOpen, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [entries, setEntries] = useState<QuizEntry[]>([]);
  const [user, setUser] = useState<string>('');
  const [quote] = useState(() => getRandomQuote());
  const navigate = useNavigate();

  const loadEntries = () => {
    setEntries(getQuizEntries());
  };

  useEffect(() => {
    const userData = getUser();
    if (!userData || !userData.isLoggedIn) {
      navigate('/');
      return;
    }
    
    setUser(userData.username);
    loadEntries();
  }, [navigate]);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  const handleAnalysisComplete = (result: any) => {
    // Auto-fill the quiz entry form with analysis results
    if (result.success && result.questionScores.length > 0) {
      const questionScoresText = result.questionScores
        .map(q => `${q.topic}|${q.scored}/${q.total}`)
        .join('\n');
      
      // Store the analysis data for the QuizEntryForm to pick up
      localStorage.setItem('analysisData', JSON.stringify({
        totalScore: result.overallScore || 0,
        weakAreas: result.weakAreas.join(', '),
        questionScores: questionScoresText
      }));
      
      // Trigger a reload of the QuizEntryForm
      window.dispatchEvent(new CustomEvent('analysisComplete'));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="bg-card shadow-gentle border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BookAnimation size="sm" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  Learn Ace
                </h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user}!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-sm text-muted-foreground italic">"{quote}"</p>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2 transition-all duration-300 hover:bg-destructive hover:text-destructive-foreground"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Overview */}
        <div className="text-center space-y-2 animate-fade-in">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <BarChart3 className="w-5 h-5" />
            <span>Your Learning Dashboard</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            Track your quiz performance, identify weak areas, and monitor your learning progress over time.
          </p>
        </div>

        {/* AI Exam Analysis */}
        <div className="animate-fade-in">
          <ImageUploadSection onAnalysisComplete={handleAnalysisComplete} />
        </div>

        {/* Quiz Entry Form */}
        <QuizEntryForm onEntryAdded={loadEntries} />

        {/* Summary Cards */}
        <QuizSummary entries={entries} />

        {/* Quiz History Table */}
        <QuizTable entries={entries} onEntriesChange={loadEntries} />

        {/* Footer */}
        <footer className="text-center py-8 border-t border-border/50">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">Keep learning, keep growing! 🌟</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;