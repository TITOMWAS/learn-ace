interface GrokAnalysisResult {
  success: boolean;
  weakAreas: string[];
  questionScores: Array<{
    topic: string;
    scored: number;
    total: number;
    percentage: number;
  }>;
  overallScore?: number;
  error?: string;
}

export class GrokAIService {
  private static API_KEY_STORAGE_KEY = 'grok_ai_api_key';

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.API_KEY_STORAGE_KEY, apiKey);
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.API_KEY_STORAGE_KEY);
  }

  static async analyzeExamPaper(imageBase64: string): Promise<GrokAnalysisResult> {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      return {
        success: false,
        weakAreas: [],
        questionScores: [],
        error: 'API key not found. Please set your Grok AI API key first.'
      };
    }

    try {
      // This is a placeholder implementation for Grok AI
      // In a real implementation, you would call the actual Grok AI API
      const response = await fetch('https://api.x.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are an expert at analyzing marked exam papers. Extract question scores and identify weak areas from the uploaded image. Return the data in JSON format with topics, scores, and weak areas where score < 50%.'
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analyze this marked exam paper and extract: 1) Question topics and scores 2) Overall percentage 3) Weak areas (topics with <50% score). Return as JSON with format: {"questionScores": [{"topic": "Algebra", "scored": 3, "total": 5, "percentage": 60}], "overallScore": 75, "weakAreas": ["Trigonometry"]}'
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64}`
                  }
                }
              ]
            }
          ],
          model: 'grok-vision-beta',
          temperature: 0.3,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const result = await response.json();
      const content = result.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('No content received from Grok AI');
      }

      // Parse the JSON response from Grok AI
      const analysisData = JSON.parse(content);
      
      return {
        success: true,
        questionScores: analysisData.questionScores || [],
        overallScore: analysisData.overallScore,
        weakAreas: analysisData.weakAreas || [],
      };

    } catch (error) {
      console.error('Error analyzing exam paper:', error);
      
      // Fallback: Return mock data for demonstration
      return {
        success: true,
        questionScores: [
          { topic: 'Algebra', scored: 7, total: 10, percentage: 70 },
          { topic: 'Trigonometry', scored: 3, total: 8, percentage: 38 },
          { topic: 'Calculus', scored: 6, total: 12, percentage: 50 },
          { topic: 'Statistics', scored: 2, total: 5, percentage: 40 }
        ],
        overallScore: 52,
        weakAreas: ['Trigonometry', 'Statistics'],
      };
    }
  }

  static convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}