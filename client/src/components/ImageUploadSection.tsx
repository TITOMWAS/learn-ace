import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileImage, Loader2 } from 'lucide-react';
import { uploadFile } from '@/lib/queryClient';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploadSectionProps {
  onAnalysisComplete: (result: any) => void;
}

export const ImageUploadSection = ({ onAnalysisComplete }: ImageUploadSectionProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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

    setIsAnalyzing(true);
    
    try {
      // Analyze with Gemini AI through backend
      const result = await uploadFile('/api/analyze-exam', selectedFile);
      
      if (result.success) {
        toast({
          title: "Analysis Complete",
          description: `Found ${result.weakAreas.length} weak areas and ${result.questionScores.length} question scores.`,
        });
        onAnalysisComplete(result);
      } else {
        if (result.error?.includes('not enabled')) {
          toast({
            title: "API Setup Required",
            description: "Gemini API needs to be enabled. Using demo data for now.",
            variant: "default",
          });
          // Use demo data anyway
          onAnalysisComplete({
            success: true,
            questionScores: [
              { topic: 'Math', scored: 8, total: 10, percentage: 80 },
              { topic: 'Science', scored: 6, total: 10, percentage: 60 },
              { topic: 'English', scored: 4, total: 10, percentage: 40 }
            ],
            overallScore: 60,
            weakAreas: ['English'],
          });
        } else {
          toast({
            title: "Analysis Failed",
            description: result.error || "Failed to analyze the exam paper.",
            variant: "destructive",
          });
        }
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
          Upload your marked exam paper for automatic weak area detection using Gemini AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">


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
          data-testid="button-analyze-exam"
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
          Gemini AI will detect question scores and identify weak areas automatically
        </p>
      </CardContent>
    </Card>
  );
};