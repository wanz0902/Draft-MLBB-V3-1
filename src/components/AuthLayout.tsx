import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  headline?: string;
  subheadline?: string;
  features?: string[];
}

export default function AuthLayout({ children, headline, subheadline, features }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex" style={{ background: "linear-gradient(135deg, #0a0e1a 0%, #0f1629 40%, #0a1425 100%)" }}>
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/30 via-purple-900/15 to-blue-900/30" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 40%, rgba(6,182,212,0.12), transparent 70%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 80%, rgba(139,92,246,0.08), transparent 60%)" }} />

        <div className="absolute top-20 left-10 h-32 w-32 rounded-full border border-cyan-500/10 bg-cyan-500/[0.03] blur-xl" />
        <div className="absolute bottom-32 right-16 h-40 w-40 rounded-full border border-purple-500/10 bg-purple-500/[0.03] blur-xl" />
        <div className="absolute top-1/3 right-10 h-24 w-24 rounded-full border border-blue-500/10 bg-blue-500/[0.03] blur-lg" />

        <div className="relative z-10 max-w-lg px-10 text-center">
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 font-mono text-3xl font-black text-slate-950 shadow-[0_24px_60px_-12px_rgba(56,189,248,0.5)]">
            ML
          </div>

          <h1 className="text-4xl font-black text-white tracking-tight mb-3" style={{ fontFamily: "var(--font-display, system-ui)" }}>
            {headline || "MVP Draft"}
          </h1>
          <p className="text-cyan-300/80 text-xs uppercase tracking-[0.3em] font-mono mb-6">
            {subheadline || "Command Center"}
          </p>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto mb-10">
            Professional MLBB draft analytics, hero intelligence, and team strategy platform built for competitive play.
          </p>

          {features && features.length > 0 && (
            <div className="space-y-3">
              {features.map((f) => (
                <div key={f} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-left">
                  <div className="h-2 w-2 shrink-0 rounded-full bg-cyan-400" />
                  <span className="text-sm text-slate-300">{f}</span>
                </div>
              ))}
            </div>
          )}

          {!features && (
            <div className="flex items-center justify-center gap-6 text-[10px] text-slate-500 uppercase tracking-widest">
              <span>Draft Analytics</span>
              <span className="h-1 w-1 rounded-full bg-cyan-600" />
              <span>Hero Intel</span>
              <span className="h-1 w-1 rounded-full bg-cyan-600" />
              <span>Team Strategy</span>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      </div>

      <div className="flex-1 flex items-center justify-center px-6 sm:px-8 lg:px-10">
        <div className="w-full max-w-[440px]">
          {children}
        </div>
      </div>
    </div>
  );
}
