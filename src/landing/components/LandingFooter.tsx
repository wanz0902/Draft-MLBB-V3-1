const LINKS = [
  { label: "How it Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Meta", href: "#meta" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Pricing", href: "#pricing" },
];

export default function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-slate-900 tracking-tight">DraftMLBB</span>
          <span className="text-[10px] text-slate-400">&copy; 2026</span>
        </div>
        <nav aria-label="Footer navigation" className="flex items-center gap-5">
          {LINKS.map((l) => (
            <a key={l.label} href={l.href} className="text-xs text-slate-400 hover:text-slate-700 transition-colors">{l.label}</a>
          ))}
        </nav>
        <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Built for MLBB draft analysis</span>
      </div>
    </footer>
  );
}
