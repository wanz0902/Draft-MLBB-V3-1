# MLBB Premium Esports UI/UX Audit & Redesign Plan

**Tanggal:** Jumat, 20 Juni 2026, pukul 19:35 WIB

## Baca buku/referensi

- UI/UX Pro Max Skill search results: dashboard, analytics, gaming, cybersecurity, dark mode product styles
- Framer Motion docs (existing library in project): layoutId, AnimatePresence, spring physics, variants+stagger
- Existing project CSS: index.css (Inter/Manrope/JetBrains Mono/Rajdhani fonts, Tailwind, custom animations)

---

## 1. Files/Pages Inspected

| Component | Lines | Current State |
|---|---|---|
| DraftSimulator.tsx | 3071 | Largest file — draft picks, bans, AI recommendations, complex flow |
| LiquipediaDatabase.tsx | 1724 | Pro Database with player detail dossier, framer-motion tabs |
| HeroFullPage.tsx | 1556 | Hero intelligence full page |
| TeamAnalytics.tsx | 1250 | Team analytics with match history |
| HeroAttributeSystem.tsx | 652 | Hero attribute breakdown |
| ItemsCatalog.tsx | 657 | Item catalog grid |
| HeroDetailPanel.tsx | 829 | Hero detail modal/drawer |
| StatsDashboard.tsx | 871 | Hero stats with intelligence card |
| TeamDraftPlanner.tsx | 873 | Team draft planner |
| TierListPanel.tsx | 463 | Tier list panel |
| LandingPage.tsx | 470 | Homepage |
| LandingDemoCard.tsx | 450 | Demo cards |
| Navbar.tsx | 356 | Navigation bar |
| AdminTools.tsx | 315 | Admin panel |
| index.css | 348 | Global styles |

## 2. UI/UX Pro Max References Used

| Query | Source | Key Insights |
|---|---|---|
| "dark dashboard gaming" | products.csv | 3D + Retro-Futurism, Glassmorphism + OLED, data-dense + heat map |
| "data visualization" | products.csv | Cyberpunk UI, drill-down analytics, cool→hot gradients |
| "analytics" | products.csv | Data-Dense + Heat Map, dark OLED, drill-down comparative |
| "dashboard" | products.csv | Financial dashboard with dark bg + red/green alerts |

**Target style synthesis:** Dark Mode (OLED) + Data-Dense + Cyberpunk/MLBB accent overlay. Premium esports dashboard feel.

---

## 3. Current Problems

### A. Draft Simulator (3071 lines)
- **Monolithic**: One massive file with complex draft logic + UI mixed
- **Visual**: Generic dark card layout, no command-center feel
- **Mobile**: Dense, hard to use on small screens
- **Missing**: No visual timeline for pick/ban sequence, no team logo integration, no match score visualization
- **Data display**: Raw text-heavy, not chart/visual-driven

### B. Hero Stats / Intelligence Card
- **Right panel**: Was recently redesigned (Hero Intelligence Card) — acceptable but could be more premium
- **Left panel**: Meta Scout Board — compact and functional, acceptable
- **Gap**: No player performance history/timeline, no visual radar chart for hero stats

### C. Player Intelligence Dossier
- **Status**: Multiple redesign iterations applied
- **Remaining**: Still feels slightly "AI-generated" in some areas
- **Left poster**: Works well, team accent glow functional
- **Right panel**: Tab navigation works but content sections still somewhat generic
- **Achievements/Awards**: Better after iterations but could be more editorial

### D. Team Analytics (1250 lines)
- **Complex**: Data-heavy, multiple tabs
- **Visual**: Basic stat cards, could use more chart-like visualizations
- **Missing**: No team comparison view, no player roster visual

### E. Landing Page
- **Multiple versions**: LandingPage, ScrollStoryLanding, LandingDemoCard, StickyDraftShowcase
- **Fragmentation**: Too many landing components, potential inconsistency
- **Visual**: Has some motion but not as premium as desired

### F. Global CSS/Theme
- **Fonts loaded**: Inter, Manrope, JetBrains Mono, Rajdhani — good variety
- **Missing**: No design token system (CSS variables for colors, spacing, shadows)
- **Missing**: No component-level design system
- **Custom animations**: Basic fadeIn/fadeInUp, no shared animation library

---

## 4. Redesign Concept

### Direction: "MLBB Command Center"

**Visual identity:**
- Dark tactical UI (#0a0f1e base, slate-900 panels)
- Neon accent per role (gold=exp, blue=mid, green=jungler, red=fighter, etc.)
- Subtle grid/scanline overlay (very subtle, not distracting)
- Glassmorphism cards with role-colored glow on hover
- Data-first: charts and metrics over text descriptions

**Typography hierarchy:**
- Display: Rajdhani (hero names, big stats)
- Body: Inter (text, descriptions)
- Mono: JetBrains Mono (data labels, counts, codes)
- No overuse of uppercase — keep it readable

**Motion philosophy:**
- Smooth, not bouncy — spring physics with damping:25-30
- Staggered reveals on data load
- Tab transitions with subtle blur+slide
- Hover micro-interactions: scale, glow, border color shift
- No motion that blocks interaction

---

## 5. Component-Level Plan

### Phase 1: Design System Foundation (LOW RISK)
| Item | File | Change |
|---|---|---|
| Design tokens | `index.css` | Add CSS variables for role colors, spacing, shadows, radii |
| Shared animation variants | `index.css` or new `lib/animations.ts` | Stagger, reveal, hover, tab switch patterns |
| Glass card class | `index.css` | Unified `.glass-card` with role glow support |

### Phase 2: Hero Stats Intelligence Card (MEDIUM)
| Item | File | Change |
|---|---|---|
| Radar chart for hero attributes | `StatsDashboard.tsx` | SVG radar/spider chart for stat visualization |
| Performance timeline | `StatsDashboard.tsx` | Win rate over time if data available |
| Quick intel cards | `StatsDashboard.tsx` | More prominent stat cards with chart accents |

### Phase 3: Player Intelligence Dossier (HIGH IMPACT)
| Item | File | Change |
|---|---|---|
| Photo-first layout | `LiquipediaDatabase.tsx` | Already improved, fine-tune photo-to-info ratio |
| Achievement timeline cards | `LiquipediaDatabase.tsx` | Replace table with visual milestone cards |
| Earnings bar chart | `LiquipediaDatabase.tsx` | Animated horizontal bars per year |
| Team history timeline | `LiquipediaDatabase.tsx` | Visual timeline with team logos + connection dots |

### Phase 4: Team Analytics Upgrade (MEDIUM)
| Item | File | Change |
|---|---|---|
| Team roster visual grid | `TeamAnalytics.tsx` | Player card grid within team profile |
| Match timeline | `TeamAnalytics.tsx` | Visual match history with scores + results |
| Team comparison view | `TeamAnalytics.tsx` | Side-by-side team comparison |
| Win rate visualization | `TeamAnalytics.tsx` | Animated donut/bar charts |

### Phase 5: Draft War Room (HIGH RISK — BIG FILE)
| Item | File | Change |
|---|---|---|
| Visual pick/ban timeline | `DraftSimulator.tsx` | Animated timeline showing draft sequence |
| Team side visual identity | `DraftSimulator.tsx` | Blue/Red side strong visual treatment |
| Match score integration | `DraftSimulator.tsx` | Score display + result visualization |
| AI recommendation cards | `DraftSimulator.tsx` | Premium card layout for recommendations |
| **Note**: 3071 lines — must be careful, incremental changes only | | |

### Phase 6: Landing Page Consolidation (LOW)
| Item | File | Change |
|---|---|---|
| Consolidate landing components | Multiple | Merge into one clean landing page |
| Hero section motion | `LandingPage.tsx` | Parallax, stagger, scroll-triggered |
| Feature showcase | `LandingPage.tsx` | Interactive demo cards |

---

## 6. Priority Order

| Priority | Phase | Impact | Risk | Est. Effort |
|---|---|---|---|---|
| 1 | Design System Foundation | HIGH | LOW | 1-2 hours |
| 2 | Player Intelligence Dossier | HIGH | LOW | 3-4 hours |
| 3 | Hero Stats Intelligence | MEDIUM | LOW | 2-3 hours |
| 4 | Team Analytics Upgrade | MEDIUM | MEDIUM | 3-4 hours |
| 5 | Draft War Room | HIGH | HIGH | 5-8 hours |
| 6 | Landing Page | LOW | LOW | 2-3 hours |

---

## 7. Risks

| Risk | Mitigation |
|---|---|
| DraftSimulator.tsx too large (3071 lines) | Incremental visual-only changes, no refactor |
| Breaking existing data flow | Only CSS/animation/layout changes |
| Framer Motion bundle size | Already installed, no new dependency |
| Mobile responsiveness regression | Test each phase on mobile |
| Performance with more animations | Use `will-change`, `transform` only, avoid layout thrash |

---

## 8. Implementation Phases

**Phase 1 (Foundation):** Design tokens, shared animations, glass-card class
**Phase 2 (Pro Database):** Dossier tabs, achievements cards, earnings chart, team timeline
**Phase 3 (Hero Stats):** Radar chart, performance cards, quick intel
**Phase 4 (Team Analytics):** Roster grid, match timeline, comparison view
**Phase 5 (Draft War Room):** Pick/ban timeline, score visualization — DO LAST
**Phase 6 (Landing):** Consolidate + motion polish

Each phase: lint → build → manual check → report → commit

---

## 9. Exact Files Likely to Change

| Phase | Files |
|---|---|
| Foundation | `index.css`, `src/lib/animations.ts` (new) |
| Pro Database | `src/components/LiquipediaDatabase.tsx` |
| Hero Stats | `src/components/StatsDashboard.tsx` |
| Team Analytics | `src/components/TeamAnalytics.tsx` |
| Draft War Room | `src/components/DraftSimulator.tsx` |
| Landing | `src/components/LandingPage.tsx`, `ScrollStoryLanding.tsx`, `LandingDemoCard.tsx` |

---

## Report Path

`reports/mlbb-ui-ux-audit-plan.md`
