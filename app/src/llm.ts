import axios from "axios";
import { DomainSignal } from "./domainCheck.js";
import { LLMResult } from "./types.js";

export class LLMError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 502) {
    super(message);
    this.name = "LLMError";
    this.statusCode = statusCode;
  }
}

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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function requestOpenRouter(article: string, domainSignal: DomainSignal, extractionQuality: "full" | "limited") {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: process.env.OPENROUTER_MODEL ?? "openai/gpt-oss-20b:free",
          temperature: 0,
          messages: [
            {
              role: "user",
              content: `
You are an advanced misinformation detection system.

Publisher reputation:
${domainSignal.reputation}

Publisher hostname:
${domainSignal.hostname}

Publisher name:
${domainSignal.sourceName ?? "Unknown"}

Publisher category:
${domainSignal.category}

Publisher guidance:
${domainSignal.guidance}

Content extraction quality:
${extractionQuality}

You MUST consider:
- Publisher history
- Writing tone
- Evidence and sourcing
- Emotional manipulation
- Satire signals

Scoring rules:
- Publisher reputation is contextual evidence, not a preset numeric score.
- Do NOT default to 50 or any other midpoint just because certainty is imperfect.
- Use the full 0-100 range when justified.
- Start from the article evidence, then adjust for publisher reputation.
- Known mainstream publishers such as NDTV, Aaj Tak, Times of India, Reuters, AP, BBC, and similar outlets should be treated as a positive trust signal, not automatic proof.
- Known satire or fake-news publishers such as The Onion should be treated as a strong negative trust signal unless the content is clearly labeled satire.
- If content extraction quality is limited, you are making a provisional judgment from publisher reputation plus the URL/headline-like signals in the extracted text.
- In limited-extraction cases, do NOT fall back to 50. A known mainstream publisher with no obvious red flags should lean above the midpoint, while satire and low-credibility publishers should lean well below it.
- If the article contains concrete sourcing, named actors, attributed quotes, verifiable events, and neutral tone, score above 65 unless there are strong red flags.
- If the article relies on sensational framing, unsupported allegations, vague sourcing, or manipulative language, score below 45.
- Use scores 46-64 only when the evidence is genuinely mixed or insufficient.
- Satire, fabricated claims, or propaganda should rarely score above 35.
- Strong factual reporting with specific evidence should often score between 75 and 95.

Required reasoning process:
- Identify whether claims are attributed to named people, institutions, or documents.
- Distinguish factual reporting from opinion, satire, propaganda, and mixed content.
- Penalize missing sources, anonymous claims, internal contradictions, and emotionally loaded wording.
- Reward specific, checkable details and balanced presentation.
- Do not give an average score merely because certainty is imperfect.
- If extraction quality is limited, explicitly mention that limitation in the summary and still make a directional judgment.

Return ONLY valid JSON:
{
  "score": number (0-100 credibility score),
  "content_type": "Satire | Opinion | Factual Reporting | Propaganda | Fabricated | Mixed",
  "indicators": ["3 to 5 short evidence-based signals from the article"],
  "summary": "2 to 4 sentences explaining why this score is not near the midpoint unless evidence is genuinely mixed"
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
          },
          timeout: 30000,
        }
      );
    } catch (error) {
      if (!axios.isAxiosError(error)) {
        throw error;
      }

      const status = error.response?.status;
      const retryable = status === 429 || error.code === "ECONNABORTED" || error.code === "ETIMEDOUT";

      if (!retryable || attempt === maxAttempts) {
        throw error;
      }

      await sleep(1000 * attempt);
    }
  }

  throw new LLMError("OpenRouter request failed after retries", 502);
}

export default async function analyzeWithLLM(
  article: string,
  domainSignal: DomainSignal,
  extractionQuality: "full" | "limited"
): Promise<LLMResult> {
  try {
    const response = await requestOpenRouter(article, domainSignal, extractionQuality);

    const content: string | undefined = response.data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new LLMError("LLM returned an empty response", 502);
    }

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new LLMError("Invalid JSON from LLM", 502);
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (typeof parsed.score !== "number" || Number.isNaN(parsed.score)) {
      throw new LLMError("LLM response is missing a numeric score", 502);
    }

    if (typeof parsed.summary !== "string" || !parsed.summary.trim()) {
      throw new LLMError("LLM response is missing a summary", 502);
    }

    const normalizedScore = Math.max(0, Math.min(100, Math.round(parsed.score)));

    return {
      score: normalizedScore,
      classification: classifyScore(normalizedScore),
      content_type: parsed.content_type,
      indicators: Array.isArray(parsed.indicators) ? parsed.indicators.slice(0, 5) : [],
      summary: parsed.summary.trim(),
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const upstreamMessage =
        error.response?.data && typeof error.response.data === "object"
          ? (error.response.data as { error?: { message?: string } }).error?.message
          : undefined;

      if (status === 429) {
        throw new LLMError(
          upstreamMessage ?? "The AI provider is rate limited right now. Please retry in a moment.",
          429
        );
      }

      if (status === 401 || status === 403) {
        throw new LLMError("OpenRouter API key is invalid or unauthorized", status);
      }

      if (status) {
        throw new LLMError(
          upstreamMessage ?? `OpenRouter request failed with HTTP ${status}`,
          502
        );
      }

      if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
        throw new LLMError("Timed out while contacting OpenRouter", 504);
      }

      throw new LLMError(
        `Could not reach OpenRouter${error.code ? ` (${error.code})` : ""}`,
        502
      );
    }

    if (error instanceof LLMError) {
      throw error;
    }

    if (error instanceof SyntaxError) {
      throw new LLMError("LLM returned malformed JSON", 502);
    }

    throw new LLMError("Unexpected error while analyzing article", 500);
  }
}
