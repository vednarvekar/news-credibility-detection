import { motion } from "framer-motion";

const SkeletonLoading = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-3xl mx-auto"
    >
      {/* Score meter skeleton */}
      <div className="glass-card p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-32 rounded-lg bg-muted shimmer" />
          <div className="h-8 w-20 rounded-full bg-muted shimmer" />
        </div>
        <div className="h-4 w-full rounded-full bg-muted shimmer" />
      </div>

      {/* Content type badge skeleton */}
      <div className="flex gap-3">
        <div className="h-8 w-28 rounded-full bg-muted shimmer" />
        <div className="h-8 w-36 rounded-full bg-muted shimmer" />
      </div>

      {/* Summary skeleton */}
      <div className="glass-card p-8 space-y-3">
        <div className="h-5 w-40 rounded-lg bg-muted shimmer" />
        <div className="h-3 w-full rounded bg-muted shimmer" />
        <div className="h-3 w-4/5 rounded bg-muted shimmer" />
        <div className="h-3 w-3/5 rounded bg-muted shimmer" />
      </div>

      {/* Indicators skeleton */}
      <div className="glass-card p-8 space-y-4">
        <div className="h-5 w-36 rounded-lg bg-muted shimmer" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-muted shimmer flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-3/4 rounded bg-muted shimmer" />
              <div className="h-3 w-1/2 rounded bg-muted shimmer" />
            </div>
          </div>
        ))}
      </div>

      {/* Domain reputation skeleton */}
      <div className="glass-card p-8 space-y-3">
        <div className="h-5 w-44 rounded-lg bg-muted shimmer" />
        <div className="h-3 w-full rounded bg-muted shimmer" />
        <div className="h-3 w-2/3 rounded bg-muted shimmer" />
      </div>
    </motion.div>
  );
};

export default SkeletonLoading;
