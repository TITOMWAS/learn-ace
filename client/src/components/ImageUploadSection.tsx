import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileImage, Loader2 } from 'lucide-react';
import { GrokAIService } from '@/services/grokAI';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploadSectionProps {
  onAnalysisComplete: (result: any) => void;
}

export const ImageUploadSection = ({ onAnalysisComplete }: ImageUploadSectionProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [apiKey, setApiKey] = useState(() => GrokAIService.getApiKey() || '');
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        setSelectedFile(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a JPG or PNG image.",
          variant: "destructive",
        });
      }
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an exam paper image first.",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Grok AI API key to analyze the image.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Save API key for future use
      GrokAIService.saveApiKey(apiKey.trim());
      
      // Convert image to base64
      const base64Image = await GrokAIService.convertFileToBase64(selectedFile);
      
      // Analyze with Grok AI
      const result = await GrokAIService.analyzeExamPaper(base64Image);
      
      if (result.success) {
        toast({
          title: "Analysis Complete",
          description: `Found ${result.weakAreas.length} weak areas and ${result.questionScores.length} question scores.`,
        });
        onAnalysisComplete(result);
      } else {
        toast({
          title: "Analysis Failed",
          description: result.error || "Failed to analyze the exam paper.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error during analysis:', error);
      toast({
        title: "Error",
        description: "An error occurred while analyzing the image.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="shadow-card border-0">
      <CardHeader className="text-center space-y-2">
        <CardTitle className="flex items-center justify-center gap-2">
          <FileImage className="w-5 h-5 text-primary" />
          AI Exam Analysis
        </CardTitle>
        <CardDescription>
          Upload your marked exam paper for automatic weak area detection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">Grok AI API Key</Label>
          <Input
            id="apiKey"
            type="password"
            placeholder="Enter your Grok AI API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="transition-all duration-300 focus:shadow-gentle"
          />
          <p className="text-xs text-muted-foreground">
            Get your API key from <a href="https://x.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">x.ai</a>
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="examImage">Upload Exam Paper (JPG/PNG)</Label>
          <div className="relative">
            <Input
              id="examImage"
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleFileSelect}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary-hover"
            />
            {selectedFile && (
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <FileImage className="w-4 h-4" />
                {selectedFile.name}
              </div>
            )}
          </div>
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={!selectedFile || isAnalyzing}
          className="w-full bg-gradient-primary hover:bg-primary-hover transition-all duration-300 transform hover:scale-105 shadow-gentle"
        >
          {isAnalyzing ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing Image...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Analyze Exam Paper
            </div>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          The AI will detect question scores and identify weak areas automatically
        </p>
      </CardContent>
    </Card>
  );
};