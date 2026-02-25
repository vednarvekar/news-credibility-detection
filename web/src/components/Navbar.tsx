import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const Navbar = ({ variant = "landing" }: { variant?: "landing" | "dashboard" }) => {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 backdrop-blur-xl bg-background/60"
    >
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-button flex items-center justify-center p-0">
            <Shield className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">TruthLens</span>
        </Link>

        {variant === "landing" ? (
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link to="/signup" className="gradient-button text-sm !px-5 !py-2">
              Get Started
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              History
            </Link>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Logout
            </Link>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
