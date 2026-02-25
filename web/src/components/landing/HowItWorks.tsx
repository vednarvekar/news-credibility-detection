import { motion } from "framer-motion";
import { Link2, Cpu, BarChart3 } from "lucide-react";

const steps = [
  { icon: Link2, step: "01", title: "Paste URL", description: "Drop any news article URL into the analyzer." },
  { icon: Cpu, step: "02", title: "AI Analyzes Content", description: "Our AI engine processes language, sources, and publisher data." },
  { icon: BarChart3, step: "03", title: "View Credibility Breakdown", description: "Get a detailed report with scores, risks, and insights." },
];

const HowItWorks = () => {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg">Three simple steps to verified information.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl glass-card flex items-center justify-center mx-auto mb-5">
                <s.icon className="w-7 h-7 text-primary" />
              </div>
              <span className="text-xs font-semibold text-primary tracking-widest uppercase">{s.step}</span>
              <h3 className="text-xl font-semibold text-foreground mt-2 mb-3">{s.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
