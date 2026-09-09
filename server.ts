import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { analyzeDocumentPayload } from "./src/server/forensicService";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    hasGeminiKey: !!(process.env.GEMINI_API_KEY || "AQ.Ab8RN6KOOuSiwm5Dytku2VCongZ84E5ltgJ7NpdDd8MVTcaaxw"),
    timestamp: new Date().toISOString()
  });
});

// 2. Multimodal AI Document Forensic Screening API
app.post("/api/analyze-document", async (req, res) => {
  try {
    const result = await analyzeDocumentPayload(req.body || {});
    res.json(result);
  } catch (err: any) {
    console.error("Error in /api/analyze-document:", err);
    res.status(err?.message?.includes("Missing docImage") ? 400 : 500).json({ 
      error: err?.message || "Internal server error" 
    });
  }
});

// Vite Middleware / Static Asset Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DocShield full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

export default app;
