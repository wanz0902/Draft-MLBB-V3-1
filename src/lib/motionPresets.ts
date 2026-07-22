/**
 * Reusable animation presets for MLBB Draft Simulator.
 * Import: import { fadeUp, staggerContainer, ... } from "../lib/motionPresets";
 *
 * All presets follow:
 * - duration: 0.18–0.55s
 * - easeOut / smooth curves
 * - mobile-safe (no aggressive transforms)
 * - no infinite animations
 */

import type { Variants } from "framer-motion";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Preset = Record<string, any>;

// ─── Simple presets ─────────────────────────────────────────────────────────

export const fadeIn: Preset = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3, ease: "easeOut" },
};

export const fadeUp: Preset = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
};

export const fadeDown: Preset = {
  initial: { opacity: 0, y: -16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" },
};

export const scaleIn: Preset = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
};

export const softPop: Preset = {
  initial: { opacity: 0, scale: 0.85 },
  animate: { opacity: 1, scale: 1 },
  transition: { type: "spring", stiffness: 350, damping: 22 },
};

// ─── Interaction presets ────────────────────────────────────────────────────

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.03, y: -4 },
};

export const buttonTap = {
  tap: { scale: 0.97 },
};

// ─── Stagger presets ────────────────────────────────────────────────────────

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

// ─── Page/panel presets ─────────────────────────────────────────────────────

export const pageTransition: Preset = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.25, ease: "easeOut" },
};

export const panelSlideLeft: Preset = {
  initial: { opacity: 0, x: -24 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
};

export const panelSlideRight: Preset = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
};

// ─── Modal presets ──────────────────────────────────────────────────────────

export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

export const modalContent: Preset = {
  initial: { opacity: 0, scale: 0.96, y: 16 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 16 },
  transition: { type: "spring", damping: 28, stiffness: 300 },
};

// ─── Launch transition ──────────────────────────────────────────────────────

export const launchAppTransition: Preset = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
};
