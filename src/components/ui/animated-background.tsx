import React from "react";

/**
 * Aurora animated background — full-screen ambient glow.
 * Renders behind content using fixed positioning.
 * Does NOT block pointer events.
 * All animation values are defined in index.css (aurora-*) keyframes.
 */
export default function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Primary aurora blob — blue/cyan */}
      <div
        className="aurora-blob aurora-blob-primary absolute rounded-full blur-[120px]"
        style={{ width: "60%", height: "50%", top: "-10%", left: "10%", opacity: 0.12 }}
      />
      {/* Secondary aurora blob — purple */}
      <div
        className="aurora-blob aurora-blob-secondary absolute rounded-full blur-[100px]"
        style={{ width: "50%", height: "45%", bottom: "-15%", right: "5%", opacity: 0.1 }}
      />
      {/* Accent glow — teal */}
      <div
        className="aurora-blob aurora-blob-accent absolute rounded-full blur-[80px]"
        style={{ width: "35%", height: "30%", top: "40%", left: "55%", opacity: 0.06 }}
      />
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }} />
    </div>
  );
}
