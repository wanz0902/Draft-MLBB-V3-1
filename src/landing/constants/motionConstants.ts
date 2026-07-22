export const SPRING_SNAP = { stiffness: 600, damping: 35, mass: 0.8 } as const;
export const SPRING_MAGNETIC = { stiffness: 250, damping: 22, mass: 1 } as const;
export const SPRING_PRESS = { stiffness: 800, damping: 40, mass: 0.5 } as const;

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_BACK = [0.36, 0, 0.66, -0.56] as const;
export const EASE_SNAP = [0.34, 1.4, 0.64, 1] as const;

export const MAGNETIC_RADIUS = 80;
export const MAGNETIC_MAX_DISPLACEMENT = 8;
export const MAGNETIC_STRENGTH = 0.15;

export const CURSOR_LERP_NORMAL = 0.12;
export const CURSOR_LERP_INTERACTIVE = 0.25;

export const CONFIRM_DURATION = 150;
export const SHINE_DURATION = 350;
export const RIPPLE_DURATION = 400;
export const SCANLINE_DURATION = 80;
