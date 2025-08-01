import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { GeminiAIService } from "./services/geminiAI";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Analysis endpoint for exam papers
  app.post("/api/analyze-exam", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      const imageBase64 = req.file.buffer.toString('base64');
      const result = await GeminiAIService.analyzeExamPaper(imageBase64);
      
      res.json(result);
    } catch (error) {
      console.error("Error in /api/analyze-exam:", error);
      res.status(500).json({ 
        success: false,
        error: "Internal server error during analysis" 
      });
    }
  });

  // User authentication routes
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      // For demo purposes, accept any login
      // In production, you'd verify against database
      res.json({ 
        success: true, 
        user: { username, isLoggedIn: true } 
      });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/signup", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      // For demo purposes, accept any signup
      // In production, you'd save to database
      res.json({ 
        success: true, 
        user: { username, isLoggedIn: true } 
      });
    } catch (error) {
      res.status(500).json({ error: "Signup failed" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
