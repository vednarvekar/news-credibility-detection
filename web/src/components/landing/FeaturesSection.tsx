import { motion } from "framer-motion";
import { Brain, Building2, AlertTriangle } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Credibility Scoring",
    description: "Advanced language models analyze article content, cross-reference claims, and produce a comprehensive credibility score.",
  },
  {
    icon: Building2,
    title: "Publisher Reputation Analysis",
    description: "Evaluate the track record and reliability of publishers using historical data and editorial standards.",
  },
  {
    icon: AlertTriangle,
    title: "Content Risk Indicators",
    description: "Identify emotional manipulation, missing sources, logical fallacies, and other red flags in real-time.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Powerful Analysis Tools
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Everything you need to verify the credibility of any news article.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={item} className="glass-card-hover p-8">
              <div className="w-12 h-12 rounded-xl gradient-button flex items-center justify-center mb-5 !p-0">
                <feature.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
