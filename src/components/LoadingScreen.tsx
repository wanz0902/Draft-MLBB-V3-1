import React, { useEffect, useRef, useState } from "react";

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"enter" | "loading" | "done" | "exit">("enter");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    interface Particle { x: number; y: number; vx: number; vy: number; r: number; a: number; }
    const particles: Particle[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      a: Math.random() * 0.3 + 0.1,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34,211,238,${p.a})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(34,211,238,${0.05 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  // Progress animation
  useEffect(() => {
    const t1 = setTimeout(() => setPhase("loading"), 300);
    const start = performance.now();
    const duration = 2200;
    const tick = () => {
      const elapsed = performance.now() - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setProgress(Math.floor(eased * 100));
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        setPhase("done");
        setTimeout(() => setPhase("exit"), 800);
        setTimeout(onComplete, 1400);
      }
    };
    const t2 = setTimeout(() => requestAnimationFrame(tick), 400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  const statusText = progress < 25 ? "Connecting to MPL database..."
    : progress < 50 ? "Loading hero portraits & skill data..."
    : progress < 75 ? "Syncing match history & analytics..."
    : progress < 100 ? "Preparing draft engine..."
    : "Ready";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        opacity: phase === "exit" ? 0 : 1,
        transition: "opacity 0.6s cubic-bezier(.16,1,.3,1)",
      }}
    >
      {/* Particle canvas */}
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, opacity: phase === "loading" ? 0.6 : 0, transition: "opacity 0.8s" }}
      />

      {/* Background video */}
      <video
        src="/videos/heroes/zhuxin/video-2-0.mp4"
        autoPlay muted loop playsInline
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          minWidth: "100%", minHeight: "100%",
          width: "auto", height: "auto",
          transform: "translate(-50%,-50%)",
          objectFit: "cover",
          opacity: 0.12,
          filter: "blur(3px) saturate(0.6)",
        }}
      />

      {/* Radial vignette */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(0,0,0,0.05) 0%, #ffffff 75%)" }} />

      {/* Content */}
      <div
        style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 32,
          transform: phase === "enter" ? "translateY(24px) scale(0.96)" : "translateY(0) scale(1)",
          opacity: phase === "enter" ? 0 : 1,
          transition: "all 0.7s cubic-bezier(.16,1,.3,1)",
        }}
      >
        {/* Logo mark */}
        <div style={{ position: "relative" }}>
          {/* Outer ring */}
          <svg width="80" height="80" viewBox="0 0 80 80" style={{ position: "absolute", top: -16, left: -16, opacity: phase === "loading" ? 0.6 : 0, transition: "opacity 0.5s" }}>
            <circle
              cx="40" cy="40" r="36"
              fill="none"
              stroke="rgba(34,211,238,0.15)"
              strokeWidth="1"
              strokeDasharray={`${progress * 2.26} 226`}
              strokeLinecap="round"
              style={{ transform: "rotate(-90deg)", transformOrigin: "center", transition: "stroke-dasharray 0.15s linear" }}
            />
          </svg>
          {/* Logo */}
          <div
            style={{
              width: 48, height: 48, borderRadius: 14,
              background: "linear-gradient(135deg, #22d3ee, #2563eb)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 900,
              fontFamily: "JetBrains Mono, monospace",
              color: "#ffffff",
              boxShadow: "0 0 40px rgba(34,211,238,0.25), 0 0 80px rgba(34,211,238,0.1)",
              animation: "loadPulse 2.5s ease-in-out infinite",
            }}
          >
            ML
          </div>
        </div>

        {/* Brand text */}
        <div style={{ textAlign: "center" }}>
          <div
            className="font-display"
            style={{
              fontSize: 26, fontWeight: 900, color: "#fff",
              letterSpacing: "-0.8px", lineHeight: 1.1,
              opacity: phase === "loading" || phase === "done" ? 1 : 0,
              transform: phase === "loading" || phase === "done" ? "translateY(0)" : "translateY(8px)",
              transition: "all 0.6s cubic-bezier(.16,1,.3,1) 0.1s",
            }}
          >
            Draft Analyst
          </div>
          <div
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: 10, fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 3,
              color: "rgba(34,211,238,0.5)",
              marginTop: 6,
              opacity: phase === "loading" || phase === "done" ? 1 : 0,
              transition: "opacity 0.6s 0.2s",
            }}
          >
            MPL ID S17 Command Center
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ width: 220, opacity: phase === "loading" || phase === "done" ? 1 : 0, transition: "opacity 0.5s 0.3s" }}>
          <div style={{ height: 2, borderRadius: 1, background: "rgba(0,0,0,0.04)", overflow: "hidden" }}>
            <div
              style={{
                height: "100%", borderRadius: 1,
                width: `${progress}%`,
                background: "linear-gradient(90deg, #22d3ee, #3b82f6, #7b61ff)",
                transition: "width 0.12s linear",
                boxShadow: "0 0 16px rgba(34,211,238,0.4)",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, alignItems: "center" }}>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "rgba(148,163,184,0.35)", textTransform: "uppercase", letterSpacing: 1.5 }}>
              {statusText}
            </span>
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "rgba(34,211,238,0.6)", fontWeight: 800 }}>
              {progress}%
            </span>
          </div>
        </div>

        {/* Bottom decoration — hero portraits */}
        <div
          style={{
            display: "flex", gap: 8, marginTop: 16,
            opacity: phase === "loading" || phase === "done" ? 0.5 : 0,
            transition: "opacity 0.6s 0.4s",
          }}
        >
          {["Zhuxin", "Fanny", "Harith", "Fredrinn", "Mathilda"].map((h, i) => (
            <div
              key={h}
              style={{
                width: 36, height: 36, borderRadius: 8,
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.06)",
                opacity: progress > i * 20 ? 1 : 0.15,
                transform: progress > i * 20 ? "scale(1)" : "scale(0.7)",
                transition: "all 0.5s cubic-bezier(.16,1,.3,1)",
              }}
            >
              <video
                src={`/videos/heroes/${h.toLowerCase()}/video-0-0.mp4`}
                autoPlay muted loop playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes loadPulse {
          0%, 100% { box-shadow: 0 0 30px rgba(34,211,238,0.2), 0 0 60px rgba(34,211,238,0.08); }
          50% { box-shadow: 0 0 50px rgba(34,211,238,0.35), 0 0 100px rgba(34,211,238,0.12); }
        }
      `}</style>
    </div>
  );
}
