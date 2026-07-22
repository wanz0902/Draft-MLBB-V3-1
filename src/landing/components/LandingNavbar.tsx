import { useState, useEffect, useCallback } from "react";
import { enterApp } from "../integration";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "How it Works", id: "how-it-works" },
  { label: "Demo", id: "demo" },
  { label: "Features", id: "features" },
  { label: "Meta", id: "meta" },
  { label: "Roadmap", id: "roadmap" },
  { label: "Pricing", id: "pricing" },
];

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4 pointer-events-none" aria-label="Landing navigation">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full w-full max-w-[860px] pointer-events-auto"
        style={{
          background: scrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.6)",
          backdropFilter: "blur(24px) saturate(1.3)",
          border: "1px solid rgba(226,232,240,0.8)",
          boxShadow: scrolled
            ? "0 4px 24px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)"
            : "0 2px 12px rgba(0,0,0,0.03)",
          transition: "background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease",
        }}
      >
        <motion.div
          className="flex items-center gap-2 shrink-0 cursor-pointer"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            whileHover={{
              scale: 1.1,
              boxShadow: "0 0 16px rgba(37,99,235,0.4)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-black text-white"
            style={{ background: "linear-gradient(135deg, #7dd3fc, #2563eb)", fontFamily: "JetBrains Mono, monospace" }}
          >
            ML
          </motion.div>
          <span className="text-[13px] font-semibold text-slate-700 hidden sm:block">Draft Analyst</span>
        </motion.div>

        <div className="hidden md:flex items-center gap-1 ml-2 relative">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              onMouseEnter={() => setHoveredLink(link.id)}
              onMouseLeave={() => setHoveredLink(null)}
              className="relative px-3 py-1.5 text-[11px] rounded-full transition-colors duration-200 z-10"
              style={{ color: hoveredLink === link.id ? "#0f172a" : "#64748b" }}
            >
              {hoveredLink === link.id && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-slate-100"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <motion.button
          data-testid="cta-navbar-launch"
          onClick={() => enterApp("draft")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="group relative flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-bold text-white overflow-hidden shrink-0"
          style={{ background: "linear-gradient(135deg, #7dd3fc, #2563eb)" }}
        >
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "linear-gradient(135deg, #38bdf8, #1d4ed8)" }}
          />
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"
            style={{ background: "linear-gradient(135deg, #7dd3fc, #2563eb)" }}
          />
          <span className="relative z-10">Launch App</span>
          <ArrowRight className="relative z-10 h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
        </motion.button>

        <button
          className="md:hidden relative z-10 p-1.5 rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </motion.div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute top-[68px] left-4 right-4 max-w-[860px] mx-auto pointer-events-auto overflow-hidden rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-lg"
          >
            <div className="flex flex-col p-3 gap-1">
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.2 }}
                  onClick={() => scrollTo(link.id)}
                  className="text-left px-3 py-2.5 text-[13px] text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  {link.label}
                </motion.button>
              ))}
              <motion.button
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.05, duration: 0.2 }}
                onClick={() => { enterApp("draft"); setMobileOpen(false); }}
                className="mt-1 px-3 py-2.5 text-[13px] font-bold text-white rounded-xl text-left"
                style={{ background: "linear-gradient(135deg, #7dd3fc, #2563eb)" }}
              >
                Launch App
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
