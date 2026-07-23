import { motion } from "framer-motion";
import { Construction, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface ComingSoonPageProps {
  title: string;
  description?: string;
}

export default function ComingSoonPage({ title, description }: ComingSoonPageProps) {
  return (
    <div className="mx-auto max-w-2xl py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10">
          <Construction className="h-10 w-10 text-amber-400" />
        </div>

        <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{title}</h1>
        <p className="text-[var(--text-secondary)] mb-2">This feature is currently under development.</p>
        {description && <p className="text-sm text-[var(--text-muted)] mb-8">{description}</p>}
        {!description && <p className="text-sm text-[var(--text-muted)] mb-8">Stay tuned for updates!</p>}

        <Link
          to="/profile"
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-500 active:scale-[0.98]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Link>
      </motion.div>
    </div>
  );
}
