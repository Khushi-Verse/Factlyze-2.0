import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import OpenAI from "openai";
import Tesseract from "tesseract.js";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // 🔥 GROQ CLIENT
  const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
  });

  // 🔥 ANALYZE ROUTE
  app.post("/api/analyze", async (req, res) => {
    try {
      const { text, url ,image } = req.body;

      


let articleContent = text || "";

if (!articleContent && image) {
  try {
    const base64Data = image.split(",")[1];
    const buffer = Buffer.from(base64Data, "base64");

    const { data } = await Tesseract.recognize(buffer, "eng");
    articleContent = data.text;
  } catch (err) {
    console.error("OCR failed:", err);
  }
}

if (!articleContent && url) {
  articleContent = `Source URL: ${url}`;
}

const prompt = `
You are an expert media bias analyst.

Strict Rules:
- Return ONLY valid JSON.
- Do NOT wrap in markdown.
- Do NOT explain outside JSON.
- Follow structure exactly.

Analyze the article for:
- Clickbait language
- Emotional manipulation
- Bias
- Loaded words
- Sensational framing

Return this exact JSON:

{
  "clickbait_score": number (0-100),
  "bias_balance": number (0-100 where 0 = factual, 100 = emotional),
  "emotions_detected": string[],
  "annotated_article": "HTML string where biased words are wrapped like:
     <span class='manipulated fear'>word</span>
     <span class='manipulated anger'>word</span>
     <span class='manipulated clickbait'>word</span>",
  "neutral_version": string,
  "key_takeaways": string[],
  "comparison_query": string
}

Article:
${articleContent}
`; 
const completion = await openai.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are a professional media analyst and fact-checker. Always return valid JSON only.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      });

      const output = completion.choices[0].message.content;

      const raw = completion.choices[0].message.content || "";

// Remove markdown code blocks like ```json ... ```
const cleaned = raw
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

try {
  const json = JSON.parse(cleaned);
  res.json(json);
} catch (err) {
  console.error("JSON parse failed. Raw output:");
  console.log(raw);

  res.status(500).json({
    error: "Model did not return valid JSON",
    raw: raw,
  });
}
    } catch (error: any) {
      console. error(error);
      res.status(500).json({ error: "Analysis failed" });
    }
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();