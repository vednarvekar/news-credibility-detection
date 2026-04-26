import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import SkeletonLoading from "@/components/dashboard/SkeletonLoading";
import ResultsView, { type AnalysisResult } from "@/components/dashboard/ResultsView";
import { toast } from "@/hooks/use-toast";

const API_BASE = "http://localhost:5000";

type AnalysisState = "idle" | "loading" | "results";

const Dashboard = () => {
  const [state, setState] = useState<AnalysisState>("idle");
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/login";
    }
  }, []);

  const handleAnalyze = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;

    setState("loading");
    setResult(null);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ url: trimmed }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.error || `Server returned ${res.status}`);
      }

      const data: AnalysisResult = await res.json();

      if (typeof data.summary !== "string" || !data.summary.trim()) {
        throw new Error("The analysis response did not include an AI summary");
      }

      setResult(data);
      setState("results");
    } catch (err: any) {
      toast({ title: "Analysis failed", description: err.message || "Could not reach the server.", variant: "destructive" });
      setState("idle");
    }
  };

  return (
    <div className="min-h-screen bg-background animated-bg">
      <Navbar variant="dashboard" />

      <main className="container mx-auto px-6 pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Analyze Article</h1>
          <p className="text-muted-foreground mb-6">Paste a news article URL to check its credibility.</p>

          <div className="glass-card p-2 flex items-center gap-2">
            <div className="flex-1 flex items-center gap-3 px-4">
              <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste news article URL here..."
                className="w-full py-3 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              />
            </div>
            <button
              onClick={handleAnalyze}
              disabled={state === "loading"}
              className="gradient-button !py-3 !px-8 rounded-xl animate-pulse-glow disabled:opacity-60 disabled:cursor-not-allowed flex-shrink-0"
            >
              {state === "loading" ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </motion.div>

        {state === "loading" && <SkeletonLoading />}
        {state === "results" && result && <ResultsView data={result} />}
      </main>
    </div>
  );
};

export default Dashboard;
