import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface GeminiAnalysisResult {
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

export class GeminiAIService {
  static async analyzeExamPaper(imageBase64: string): Promise<GeminiAnalysisResult> {
    try {
      if (!process.env.GEMINI_API_KEY) {
        return {
          success: false,
          weakAreas: [],
          questionScores: [],
          error: 'Gemini API key not configured'
        };
      }

      const prompt = `Analyze this marked exam paper and extract the following information:
1. Question topics and their scores (scored/total)
2. Overall percentage if visible
3. Weak areas (topics with less than 50% score)

Return the data in this exact JSON format:
{
  "questionScores": [
    {
      "topic": "Topic Name",
      "scored": number,
      "total": number,
      "percentage": number
    }
  ],
  "overallScore": number,
  "weakAreas": ["topic1", "topic2"]
}

Focus on extracting actual scores from the marked paper. Look for marks like "3/5", "7/10", etc.`;

      const imageBytes = Buffer.from(imageBase64, 'base64');

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              questionScores: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    topic: { type: "string" },
                    scored: { type: "number" },
                    total: { type: "number" },
                    percentage: { type: "number" }
                  },
                  required: ["topic", "scored", "total", "percentage"]
                }
              },
              overallScore: { type: "number" },
              weakAreas: {
                type: "array",
                items: { type: "string" }
              }
            },
            required: ["questionScores", "weakAreas"]
          }
        },
        contents: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: "image/jpeg",
            },
          },
          prompt
        ],
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('No response from Gemini AI');
      }

      const analysisData = JSON.parse(responseText);
      
      return {
        success: true,
        questionScores: analysisData.questionScores || [],
        overallScore: analysisData.overallScore,
        weakAreas: analysisData.weakAreas || [],
      };

    } catch (error) {
      console.error('Error analyzing exam paper with Gemini:', error);
      
      return {
        success: false,
        weakAreas: [],
        questionScores: [],
        error: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  static convertFileToBase64(file: Buffer): string {
    return file.toString('base64');
  }
}