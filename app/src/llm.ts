import axios from "axios";
import { LLMResult } from "./types.js";

// function classifyScore(score: number): string {
//   if (score <= 20) return "Fake News";
//   if (score <= 30) return "High Likely Fake";
//   if (score <= 45) return "Likely Fake";
//   if (score <= 60) return "Suspicious / Uncertain";
//   if (score <= 75) return "Likely Real";
//   if (score <= 80) return "Real News";
//   return "High Likely Real";
// }

function classifyScore(score: number): string {
  if (score <= 25) return "Fabricated / Highly Unreliable";
  if (score <= 40) return "Likely Satire or Misleading";
  if (score <= 55) return "Suspicious / Unverified";
  if (score <= 70) return "Likely Real but Needs Verification";
  if (score <= 85) return "Credible Reporting";
  return "Highly Credible Reporting";
}

export default async function analyzeWithLLM(
  article: string,
  domainSignal: { reputation: string; reputationScore: number }
): Promise<LLMResult> {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-4o-mini",
      temperature: 0,
      messages: [
        {
          role: "user",
          content: `
You are an advanced misinformation detection system.

Publisher reputation:
${domainSignal.reputation}

Initial credibility baseline score: ${domainSignal.reputationScore}

You MUST consider:
- Publisher history
- Writing tone
- Evidence and sourcing
- Emotional manipulation
- Satire signals

Return ONLY valid JSON:
{
  "score": number (0-100 credibility score),
  "content_type": "Satire | Opinion | Factual Reporting | Propaganda | Fabricated | Mixed",
  "indicators": ["key signal 1", "key signal 2"],
  "summary": "short reasoning"
}

Article:
${article}
`
        }
      ]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      }
    }
  );

  const content: string = response.data.choices[0].message.content;

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Invalid JSON from LLM");

  const parsed = JSON.parse(jsonMatch[0]);

  return {
    score: parsed.score,
    classification: classifyScore(parsed.score),
    content_type: parsed.content_type,
    indicators: parsed.indicators,
    summary: parsed.summary,
    // classification: classifyScore(parsed.score),
  };
}