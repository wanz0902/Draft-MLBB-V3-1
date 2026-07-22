# Framer Motion Skill Book — MLBB Draft Simulator

## What is Framer Motion used for

Framer Motion provides declarative React animation primitives for the MLBB Draft Simulator. It powers:
- Landing page entrance animations and scroll-triggered reveals
- Draft war room transitions
- Hero/player/team card hover and entrance effects
- Modal/dropdown enter/exit transitions
- Tab content switching
- Live Match Hub match card animations

## Install

```bash
npm install framer-motion
```

The project already has `framer-motion@12.40.0` installed via `motion@12.40.0`.

## Import

```tsx
import { motion, AnimatePresence } from "framer-motion";
```

Both `"framer-motion"` and `"motion/react"` imports work. The project standard is `"framer-motion"`.

## Reusable Presets

All presets live in `src/lib/motionPresets.ts`.

```tsx
import {
  fadeIn, fadeUp, fadeDown, scaleIn, softPop,
  cardHover, buttonTap,
  staggerContainer, staggerItem,
  pageTransition, panelSlideLeft, panelSlideRight,
  modalBackdrop, modalContent, launchAppTransition,
} from "../lib/motionPresets";
```

| Preset | Purpose | Duration |
|---|---|---|
| `fadeIn` | Simple opacity entrance | 0.3s easeOut |
| `fadeUp` | Slide up + fade (20px) | 0.4s smooth |
| `fadeDown` | Slide down + fade | 0.35s easeOut |
| `scaleIn` | Scale 0.92 → 1 + fade | 0.3s smooth |
| `softPop` | Spring pop effect | Spring 350/22 |
| `cardHover` | rest → hover: scale 1.03, y -4 | — |
| `buttonTap` | Tap: scale 0.97 | — |
| `staggerContainer` | Parent: staggerChildren 0.06 | — |
| `staggerItem` | Child: spring fade + slide | Spring 300/24 |
| `pageTransition` | Page/section enter/exit | 0.25s easeOut |
| `panelSlideLeft` | Slide from left | 0.35s smooth |
| `panelSlideRight` | Slide from right | 0.35s smooth |
| `modalBackdrop` | Backdrop fade | 0.2s |
| `modalContent` | Modal scale + fade | Spring 28/300 |
| `launchAppTransition` | Launch app entrance | 0.4s smooth |

## Usage Examples

### Hero card entrance with stagger
```tsx
<motion.div variants={staggerContainer} initial="hidden" animate="visible">
  {items.map((item, i) => (
    <motion.div key={i} variants={staggerItem}>
      <Card ... />
    </motion.div>
  ))}
</motion.div>
```

### Modal with AnimatePresence
```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div {...modalBackdrop}>
      <motion.div {...modalContent}>
        Content here
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

### Hover effects
```tsx
<motion.button whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.97 }}>
  Click me
</motion.button>
```

### Tab content switching
```tsx
<AnimatePresence mode="wait">
  <motion.div key={tab} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.25 }}>
    {tabContent}
  </motion.div>
</AnimatePresence>
```

### Dashboard panel entrance
```tsx
<motion.div {...panelSlideLeft}>
  <DashboardPanel />
</motion.div>
```

## Rules for Future Tasks

1. **Do not redesign layout** just because animation is added
2. **Use existing colors and spacing** from the design system
3. **Keep animation subtle** — smooth, not bouncy, not flashy
4. **Use presets first** before creating new variants
5. **Mobile lighter** than desktop — reduce delay/duration on small screens
6. **Avoid animating large mapped lists** unless stagger is minimal (0.06 or less)
7. **No infinite animation** except intentionally decorative small elements (aurora, glows)
8. **No layout thrash** — prefer `transform` and `opacity` over layout-affecting properties

## Future Prompt Examples

For future AI tasks, use prompts like:

- "Add fadeUp entrance animation to the hero section"
- "Animate the dashboard stat cards with staggerContainer"
- "Add smooth tab switching with AnimatePresence"
- "Add hover scale + glow to the CTA button"
- "Animate the player card list with stagger"
- "Add modal entrance with spring physics"

## Reference

- npm package page for `framer-motion` (Saya baca buku/referensi)
- Existing project usage in 19+ files via `import { motion } from "framer-motion"`
- Presets designed for: esports premium UI, dark command center dashboard, MLBB draft simulator
