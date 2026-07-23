import { motion } from "framer-motion";
import { ScrollText, Trophy, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { fadeUp } from "../../lib/motionPresets";

const MOCK_HEADERS = ["Tournament", "Date", "Placement", "Prize", "Status"];

export default function TournamentHistory() {
  return (
    <motion.div
      {...fadeUp}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-bg)]">
          <ScrollText className="h-5 w-5 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-[var(--text-primary)]">
            Tournament History
          </h1>
          <span className="inline-block rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400">
            UI Preview
          </span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-12 text-center"
      >
        <div className="relative mx-auto mb-6 inline-flex">
          <div className="absolute inset-0 rounded-full bg-yellow-400/10 blur-xl scale-150" />
          <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500/20 to-amber-600/20 border border-yellow-500/20">
            <Trophy className="h-10 w-10 text-yellow-400" />
          </div>
        </div>
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">
          No Tournament History Yet
        </h2>
        <p className="text-sm text-[var(--text-muted)] mb-8 max-w-md mx-auto">
          Participate in community tournaments to see your history here
        </p>

        <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-[var(--border)] opacity-40">
          <div className="grid grid-cols-5 gap-px bg-[var(--border)]">
            {MOCK_HEADERS.map((header) => (
              <div
                key={header}
                className="bg-[var(--bg-card)] px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]"
              >
                {header}
              </div>
            ))}
          </div>
          {[1, 2, 3].map((row) => (
            <div key={row} className="grid grid-cols-5 gap-px bg-[var(--border)]">
              {MOCK_HEADERS.map((_, colIdx) => (
                <div
                  key={colIdx}
                  className="bg-[var(--bg-card)] px-4 py-4"
                >
                  <div className="h-3 w-3/4 rounded bg-white/[0.06]" />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            to="/events/community-cup"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-500 active:scale-[0.98]"
          >
            <ExternalLink className="h-4 w-4" />
            View Community Cup
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
