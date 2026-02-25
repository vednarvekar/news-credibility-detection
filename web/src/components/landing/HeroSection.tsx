import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden animated-bg">
      {/* Floating orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/5 blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/3 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

      <div className="container mx-auto px-6 pt-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/50 bg-card/40 backdrop-blur-sm text-sm text-muted-foreground mb-8">
            <span className="w-2 h-2 rounded-full bg-score-green animate-pulse" />
            AI-Powered Credibility Analysis
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight max-w-4xl mx-auto mb-6">
            Detect Misinformation{" "}
            <span className="gradient-text">in Seconds</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-powered credibility analysis for modern news consumption.
            Verify sources, detect bias, and make informed decisions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="gradient-button text-base px-10 py-4 rounded-xl">
              Get Started
            </Link>
            <Link
              to="/dashboard"
              className="px-10 py-4 rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm text-foreground font-semibold text-base hover:bg-card/50 transition-all duration-300"
            >
              Try Demo
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
