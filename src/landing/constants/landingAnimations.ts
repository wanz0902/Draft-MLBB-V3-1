export const ANIMATION = {
  INTRO_TOTAL_MS: 2100,
  INTRO_STEP_DELAY_MS: 350,
  INTRO_FADE_OUT_MS: 300,
  SCROLL_THRESHOLD: 0.15,
  TYPING_CHAR_DELAY_MS: 28,
  TYPING_CYCLE_MS: 2500,
  DRAFT_SLOT_FILL_MS: 300,
  DRAFT_SLOT_DELAY_MS: 800,
  COUNTER_DURATION_MS: 1500,
  MARQUEE_SPEED_S: 30,
  HERO_ROTATE_MS: 850,
  PHASE_CYCLE_MS: 3500,
  TRANSITION_EXIT_MS: 300,
} as const;

export const INTRO_STEPS = [
  "Booting Draft Engine…",
  "Loading Hero Intelligence…",
  "Reading MPL data…",
  "Syncing Global Rank Meta…",
  "Building draft signals…",
  "AI Coach ready.",
] as const;

export const VIEWPORT = {
  once: true,
  margin: "0px 0px -50px 0px",
} as const;
