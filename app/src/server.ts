import dotenv from "dotenv";
dotenv.config();
import express, { type Request,type Response } from "express";
import cors from "cors";
import scrapeArticle from "./scraper.js";
import analyzeWithLLM from "./llm.js";
import { LLMResult } from "./types.js";
import { checkDomain } from "./domainCheck.js";
import { register, login, authMiddleware } from "./auth.js";


const app = express();
app.use(cors());
app.use(express.json());

app.post("/auth/register", register);
app.post("/auth/login", login);

app.post("/analyze", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { url } = req.body as { url: string };

    if (!url) {
      return res.status(400).json({ error: "URL is required" });
    }

    const article = await scrapeArticle(url);

    const domainSignal = checkDomain(url);

    const result: LLMResult = await analyzeWithLLM(
      article,
      domainSignal
    );

    res.json({
      ...result,
      domain_reputation: domainSignal.reputation
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Analysis failed" });
  }
});
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});