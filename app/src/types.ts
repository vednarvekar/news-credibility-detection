export interface LLMResult {
  score: number;
  classification: string;
  content_type: 
    | "Satire"
    | "Opinion"
    | "Factual Reporting"
    | "Propaganda"
    | "Fabricated"
    | "Mixed";
  indicators: string[];
  summary: string;
}