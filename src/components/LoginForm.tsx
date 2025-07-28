import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookAnimation } from './BookAnimation';
import { ImageUploadSection } from './ImageUploadSection';
import { saveUser } from '@/utils/localStorage';
import { getRandomQuote } from '@/utils/quizAnalysis';
import { Eye, EyeOff, BookOpen } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface LoginFormProps {
  onLogin: (username: string, analysisData?: any) => void;
  onSwitchToSignup: () => void;
}

export const LoginForm = ({ onLogin, onSwitchToSignup }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quote] = useState(() => getRandomQuote());
  const [analysisData, setAnalysisData] = useState<any>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setIsLoading(true);
    
    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    saveUser({ username: username.trim(), isLoggedIn: true });
    onLogin(username.trim(), analysisData);
    
    setIsLoading(false);
  };

  const handleAnalysisComplete = (result: any) => {
    setAnalysisData(result);
    toast({
      title: "Analysis Complete",
      description: "Exam data will be pre-filled after login",
    });
  };

  const handleForgotPassword = () => {
    toast({
      title: "Password Reset",
      description: "Password reset functionality would be implemented here.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6 animate-fade-in">{/* Changed max-w-md to max-w-2xl */}
        <div className="text-center space-y-4">
          <BookAnimation size="lg" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Learn Ace
            </h1>
            <p className="text-muted-foreground mt-2 italic">"{quote}"</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-card border-0 animate-bounce-in">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="flex items-center justify-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Welcome Back
              </CardTitle>
              <CardDescription>
                Continue your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="transition-all duration-300 focus:shadow-gentle"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="transition-all duration-300 focus:shadow-gentle pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-primary hover:text-primary-hover transition-colors duration-200 underline-offset-4 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-primary hover:bg-primary-hover transition-all duration-300 transform hover:scale-105 shadow-gentle"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing In...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <button
                    onClick={onSwitchToSignup}
                    className="text-primary hover:text-primary-hover font-medium transition-colors duration-200"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="animate-bounce-in">
            <ImageUploadSection onAnalysisComplete={handleAnalysisComplete} />
          </div>
        </div>
      </div>
    </div>
  );
};