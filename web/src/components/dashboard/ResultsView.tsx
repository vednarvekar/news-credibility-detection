import { motion } from "framer-motion";
import { AlertTriangle, MessageSquareWarning, Building2, ShieldAlert } from "lucide-react";
import CredibilityMeter from "./CredibilityMeter";

export interface AnalysisResult {
  score: number;
  classification: string;
  content_type: string;
  indicators: string[];
  summary: string;
  domain_reputation: string;
}

const contentTypeBg = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("satire") || t.includes("propaganda")) return "bg-score-red";
  if (t.includes("opinion") || t.includes("mixed")) return "bg-score-orange";
  if (t.includes("factual")) return "bg-score-green";
  return "bg-score-yellow";
};

const ResultsView = ({ data }: { data: AnalysisResult }) => {
  const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
  const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-3xl mx-auto">
      <motion.div variants={item}>
        <CredibilityMeter score={data.score} />
      </motion.div>

      <motion.div variants={item} className="flex gap-3 flex-wrap">
        <span className={`text-xs font-semibold px-4 py-1.5 rounded-full ${contentTypeBg(data.content_type)} text-background`}>
          {data.content_type}
        </span>
        <span className="text-xs font-semibold px-4 py-1.5 rounded-full bg-primary/20 text-primary">
          {data.classification}
        </span>
      </motion.div>

      <motion.div variants={item} className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Domain Reputation</h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{data.domain_reputation}</p>
      </motion.div>

      <motion.div variants={item} className="glass-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Risk Indicators</h3>
        </div>
        <div className="space-y-3">
          {data.indicators.map((indicator, i) => (
            <div key={i} className="flex items-start gap-4 p-3 rounded-xl bg-muted/30">
              <div className="w-10 h-10 rounded-xl bg-score-orange/10 flex items-center justify-center flex-shrink-0">
                <MessageSquareWarning className="w-5 h-5 text-score-orange" />
              </div>
              <p className="text-sm font-medium text-foreground pt-2">{indicator}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div variants={item} className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">AI Summary</h3>
        </div>
        <p className="text-muted-foreground leading-relaxed text-sm">{data.summary}</p>
      </motion.div>
    </motion.div>
  );
};

export default ResultsView;
