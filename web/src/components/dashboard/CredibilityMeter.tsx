import { motion } from "framer-motion";
import { useMemo } from "react";

const CredibilityMeter = ({ score }: { score: number }) => {
  const { color, label } = useMemo(() => {
    if (score <= 30) return { color: "bg-score-red", label: "Low Credibility" };
    if (score <= 55) return { color: "bg-score-orange", label: "Suspicious" };
    if (score <= 75) return { color: "bg-score-yellow", label: "Unverified" };
    return { color: "bg-score-green", label: "Credible" };
  }, [score]);

  const gradientStyle = useMemo(() => {
    if (score <= 30) return "from-score-red to-score-orange";
    if (score <= 55) return "from-score-orange to-score-yellow";
    if (score <= 75) return "from-score-yellow to-score-green";
    return "from-score-green to-score-green";
  }, [score]);

  return (
    <div className="glass-card p-8">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-foreground">Credibility Score</h3>
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-foreground">{score}</span>
          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${color} text-background`}>
            {label}
          </span>
        </div>
      </div>
      <div className="w-full h-3 rounded-full bg-muted overflow-hidden mt-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${gradientStyle}`}
        />
      </div>
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>0</span>
        <span>100</span>
      </div>
    </div>
  );
};

export default CredibilityMeter;
