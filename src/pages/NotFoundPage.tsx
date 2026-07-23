import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AlertTriangle, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-[var(--bg-primary)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center max-w-md"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
          <AlertTriangle className="h-10 w-10 text-amber-400" />
        </div>

        <h1 className="text-6xl font-black text-[var(--text-primary)] mb-2" style={{ fontFamily: "var(--font-display, system-ui)" }}>
          404
        </h1>
        <p className="text-lg font-semibold text-[var(--text-secondary)] mb-2">Page Not Found</p>
        <p className="text-sm text-[var(--text-muted)] mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/app"
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-500 active:scale-[0.98]"
        >
          <Home className="h-4 w-4" />
          Back to App
        </Link>
      </motion.div>
    </div>
  );
}
