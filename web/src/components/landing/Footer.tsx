import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border/30 py-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg gradient-button flex items-center justify-center !p-0">
            <Shield className="w-3.5 h-3.5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">TruthLens</span>
        </div>
        <div className="flex items-center gap-8 text-sm text-muted-foreground">
          <span className="hover:text-foreground transition-colors cursor-pointer">About</span>
          <span className="hover:text-foreground transition-colors cursor-pointer">Privacy</span>
          <span className="hover:text-foreground transition-colors cursor-pointer">Contact</span>
        </div>
        <p className="text-xs text-muted-foreground">© 2026 TruthLens. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
