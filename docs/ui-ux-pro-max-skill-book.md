# UI/UX Pro Max Skill Book — MLBB Draft Simulator

## Purpose

This is the design/UI UX reference book for the MLBB Draft Simulator project. Future AI coding tasks should read this before making visual changes.

## Design Direction

**Premium esports command center dashboard**

- Dark tactical UI
- Bold readable typography
- Strong visual hierarchy
- Mobile lightweight layout
- Desktop command-center experience
- Not generic SaaS

## Design Rules

1. **Never redesign layout just because you are editing CSS.** Layout changes require explicit user approval.
2. **Use existing color system** unless user asks otherwise. Base palette: #0a0f1e (dark), cyan-400 (accent), role colors from index.css.
3. **Typography:** `var(--font-display)` (Rajdhani) for headers, `var(--font-sans)` (Inter) for body, `var(--font-mono)` (JetBrains Mono) for data labels.
4. **Spacing:** Use existing `--ui-gap-*` variables or Tailwind defaults.
5. **Cards:** Use `card-metric`, `card-command-center`, `glass-card` from Phase 1 CSS.
6. **Motion:** Use presets from `src/lib/motionPresets.ts` before creating custom animations.
7. **Mobile:** Lighter animations, simpler layouts. No oversized cards.
8. **No infinite animations** except decorative small elements (aurora blobs, glows).

## Current Implementation Status

### Phase 1: Design System Foundation — COMPLETE
- CSS classes: `card-metric`, `card-command-center`, `stat-bar`, `metric-value`, `metric-label`, `hover-glow-*`, `bg-command-center`, `bg-grid-pattern`, `bg-scanline`
- Animations: `animate-slide-up`, `animate-scale-in`, `animate-bar-grow`, `animate-counter-up`
- File: `src/index.css`

### Phase 2: Player Intelligence Dossier — PARTIAL
- PlayerPreviewCard: Premium portrait card with photo-first layout
- PlayerDetailDrawer: Full-screen dossier with tabbed navigation
- Achievements: Timeline cards with medal icons
- Awards: Grouped editorial cards
- Statistics: Bar charts with Phase 1 stat-bar classes
- Known gaps: Some sections still feel AI-generic

### Phase 3: Hero Stats — NOT STARTED
### Phase 4: Team Analytics — NOT STARTED
### Phase 5: Draft War Room — NOT STARTED
### Phase 6: Landing Page — NOT STARTED

## Existing CSS Classes (Phase 1 Foundation)

Use these classes in future tasks:
- `card-metric`, `card-metric-accent`, `card-command-center`
- `stat-bar`, `stat-bar-fill`, `stat-bar-fill-gradient/amber/emerald/rose`
- `metric-number`, `metric-label`, `metric-value`
- `hover-glow-blue`, `hover-glow-gold`, `hover-glow-role`
- `bg-command-center`, `bg-grid-pattern`, `bg-scanline`
- `timeline-row`, `timeline-dot`, `timeline-connector`
- `intel-row`, `intel-card`
- `empty-state-premium`

## Motion Presets

Use from `src/lib/motionPresets.ts`:
- `fadeUp`, `fadeIn`, `scaleIn`, `softPop`
- `staggerContainer`, `staggerItem`
- `cardHover`, `buttonTap`
- `pageTransition`, `panelSlideLeft/Right`
- `modalBackdrop`, `modalContent`

## Future Prompt Examples

- "Add staggered entrance to the dashboard stat cards"
- "Animate the achievement timeline rows with whileInView"
- "Apply glassmorphism to the team analytics cards"
- "Add role-color hover glow to the hero cards"
- "Improve mobile spacing for the draft planner"
