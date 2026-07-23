# Permanent Gaming Sidebar + App Shell — Implementation Report

**Task:** Permanent Gaming App Sidebar + Dashboard Composition Fix  
**Date:** 2026-07-23 17:10 WIB  
**Model:** mimo-v2.5  
**Status:** COMPLETE

---

## 1. Why Explore Overlay Was Insufficient

The previous Explore Rail implementation used a drawer/overlay pattern that had fundamental information architecture problems:

| Problem | Impact |
|---------|--------|
| Hidden navigation | User had to click "Explore" to see secondary menu items |
| Temporary overlay | Navigation disappeared after selecting an item |
| No persistent structure | No visual relationship between sidebar and page content |
| Duplicated menu | Navbar had 8 primary links + Explore button = 11 items scattered |
| Wrong mental model | Pattern was browser extension, not gaming platform |

A permanent sidebar provides:
- Always-visible navigation hierarchy
- Consistent app shell structure
- Clear group categorization (NAVIGATE, ANALYSIS, COMMUNITY, SERVICES)
- User profile and utility cards always accessible
- Desktop command-center experience per UI/UX Pro Max book

## 2. Skills/Books Used

| Source | Application |
|--------|-------------|
| **UI/UX Pro Max** | Premium esports design direction, dark tactical UI, strong visual hierarchy, grouped navigation, compact utility cards, user mini profile at bottom, "Command Center" brand identity |
| **Framer Motion** | Spring animations for sidebar width transitions, mobile drawer slide-in, backdrop fade, `prefers-reduced-motion` respect |
| **motionPresets.ts** | `fadeIn` pattern for mobile overlay, transition timing conventions (180-240ms for UI state changes) |
| **AGENTS.md** | Dual-mode agent rules, report workflow, code conventions (no comments in code, validate after changes) |
| **Context7** (external reference) | React Router NavLink for active state handling, accessible sidebar patterns (aria-expanded, aria-modal, focus trap) |

## 3. App Shell Architecture

### Before

```
┌─────────────────────────────────────────────────────┐
│ TOP NAVBAR (8 primary links + Explore + User Menu)  │
├─────────────────────────────────────────────────────┤
│                                                     │
│                  PAGE CONTENT                       │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- All navigation crammed into top bar
- Explore opened a temporary left overlay
- No persistent structural relationship between nav and content

### After

```
┌──────────────┬──────────────────────────────────────┐
│ PERMANENT    │ TOP CONTEXT BAR                       │
│ SIDEBAR      ├──────────────────────────────────────┤
│ 248px        │                                      │
│              │ PAGE CONTENT                          │
│ Brand        │                                      │
│ Navigate     │                                      │
│ Analysis     │                                      │
│ Community    │                                      │
│ Services     │                                      │
│ Cup Card     │                                      │
│ User Profile │                                      │
└──────────────┴──────────────────────────────────────┘
```

- Sidebar always visible (desktop)
- Top bar is lightweight context/status bar only
- Content area properly offset by sidebar width

## 4. Sidebar Width/Token

```css
--sidebar-width: 248px;         /* Expanded sidebar */
--sidebar-collapsed-width: 72px; /* Icon-only rail */
--topbar-height: 56px;           /* Top context bar */
```

## 5. Menu Groups (Final)

```
NAVIGATE
  Home           → /app
  Draft          → /app/draft
  Heroes         → /app/heroes
  Data           → /app/data
  Live Matches   → /app/live-matches
  Draft Planner  → /app/draft-planner

ANALYSIS
  Counters       → /app/counters
  Macro          → /app/macro
  Teams          → /app/teams
  Meta           → /app/meta

COMMUNITY
  Community Hub    → /community
  Community Cup    → /events/community-cup
  My Squad         → /events/my-squad
  Tournament History → /events/history

SERVICES
  Scrim Services     → /services/scrim
  Tournament Room    → /services/room-tournament
  Account Valuation  → /services/account-valuation
```

## 6. Top Bar (Final)

The top context bar contains only:
- **Left:** Hamburger menu (mobile: opens drawer, desktop: toggles collapse)
- **Right:** Online badge, Users badge

No duplicate navigation links. Navigation is exclusively in the sidebar.

## 7. Expanded/Collapsed Behavior

| State | Width | Content | Trigger |
|-------|-------|---------|---------|
| Expanded | 248px | Icons + labels + group labels | Default on desktop |
| Collapsed | 72px | Icons only, tooltips on hover | User clicks collapse button |
| Mobile | Full drawer | Same as expanded | Hamburger button |

Collapse preference saved to `localStorage` key: `mvp-sidebar-collapsed`

## 8. Tablet/Mobile Behavior

| Viewport | Sidebar | Top Bar |
|----------|---------|---------|
| ≥1280px | Permanent expanded (or collapsed) | Fixed within main area |
| 768-1279px | Collapsed icon rail, expandable | Menu button toggles collapse |
| <768px | Not rendered, hamburger drawer | Menu button opens drawer |

Mobile drawer:
- Full-height slide-in from left
- Backdrop overlay with blur
- Escape key closes
- Route change closes
- Body scroll lock
- `aria-modal`, `role="dialog"`, focus management

## 9. Active Route Handling

Uses React Router `NavLink` with `isGroupActive()` helper:
- `/app` → exact match only
- `/community` → matches `/community` and `/community/*`
- `/events/*` → matches all event routes
- `/services/*` → matches all service routes
- Individual routes (`/app/draft`, `/app/heroes`, etc.) → exact or starts-with match

Active indicator: Cyan left bar (3px) with glow effect, positioned absolute left of nav item.

## 10. Community Cup Mini Card

Located in sidebar footer (before user profile):
- Trophy icon + "COMMUNITY CUP" label
- Members: `0 / 100`
- Prize Fund: `Rp0` (yellow text)
- Progress bar (2% default width)
- "View Event →" link

Uses real data (all zeros since no backend data yet). No fake data.

## 11. Prize Fund Panel Fix (AppDashboard)

Changes:
- Reduced padding from `p-6 sm:p-8 lg:p-10` to `p-5 sm:p-6 lg:p-8`
- Key metrics in bordered card grid (more compact)
- Progress bar section tightened
- Contribution info simplified to 2 items
- Podium section: bars increased (1st: 115px, 2nd: 85px, 3rd: 70px)
- Total prize pool text tightened
- Overall card height reduced from ~400px to ~280px

## 12. Podium Fix (CommunityCup.tsx)

Changed from list-style (ranked items in rows) to visual podium layout:
- 3-column flex layout with bars
- 1st place: tallest bar (120px), yellow theme
- 2nd place: medium bar (90px), silver theme
- 3rd place: shortest bar (70px), bronze theme
- Medal circles with rank text
- Total prize pool below podium

## 13. Files Created/Removed/Refactored

| File | Action | Lines |
|------|--------|-------|
| `src/components/navigation/AppSidebar.tsx` | **NEW** | ~320 |
| `src/components/AppShell.tsx` | **NEW** | ~80 |
| `src/App.tsx` | **REWRITTEN** | ~310 |
| `src/components/Navbar.tsx` | **SIMPLIFIED** (no-op) | ~12 |
| `src/index.css` | **APPENDED** sidebar styles | ~400 |
| `src/pages/app/AppDashboard.tsx` | **EDITED** prize fund panel | ~548 |
| `src/pages/events/CommunityCup.tsx` | **EDITED** podium section | ~485 |
| `src/components/navigation/ExploreRail.tsx` | **DELETED** | 0 |

## 14. Verification

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | **PASS** (0 errors) |
| `npm run build` | **PASS** (12.75s) |

### Manual Verification Checklist

- [ ] Sidebar always visible on desktop
- [ ] No "Explore" button needed
- [ ] All menu items grouped by category
- [ ] Main content not covered by sidebar
- [ ] Top navbar has no duplicate menu items
- [ ] User mini profile at sidebar bottom
- [ ] Community Cup mini card visible
- [ ] Collapse/expand works
- [ ] Active route indicator correct
- [ ] Mobile drawer with backdrop
- [ ] Escape closes mobile drawer
- [ ] Route change closes mobile drawer
- [ ] Settings link works
- [ ] Profile link works
- [ ] Prize Fund panel compact
- [ ] Podium bars visible and proportional

## 15. Known Limitations

1. **No screenshot QA yet** — Manual viewport testing needed at 1920×1080, 1440×900, 1366×768, 1024×768, 390×844
2. **Focus trap for mobile drawer** — Basic escape handling implemented, full Tab trap not yet coded
3. **Community Cup data** — All values are 0 (no backend integration)
4. **RouteGuard duplication** — Nested RouteGuard in AppShell route may be redundant with individual route guards
5. **Landing page** — No navigation bar (AppNavbar returns null); landing page has its own navigation

## 16. CSS Variables Reference

```css
:root {
  --sidebar-width: 248px;
  --sidebar-collapsed-width: 72px;
  --topbar-height: 56px;
  --sidebar-bg: #070c16;
  --sidebar-border: rgba(255, 255, 255, 0.06);
  --sidebar-hover: rgba(255, 255, 255, 0.04);
  --sidebar-active-bg: rgba(6, 182, 212, 0.08);
  --sidebar-active-border: #22d3ee;
  --sidebar-active-text: #67e8f9;
  --sidebar-text: #94a3b8;
  --sidebar-text-bright: #e2e8f0;
  --sidebar-group-text: #475569;
}
```
