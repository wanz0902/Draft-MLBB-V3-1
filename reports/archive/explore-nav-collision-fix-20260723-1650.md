# Explore Navigation Rail + Navbar Collision Fix — Final Report

**Date:** 2026-07-23 16:50 WIB  
**Model:** mimo-v2.5  
**Status:** COMPLETE

---

## 1. Root Cause of "More" Dropdown

The "More" dropdown was a generic floating dropdown positioned absolutely below the navbar. It covered page content, had no backdrop, no body scroll lock, no focus management, and felt disconnected from the dashboard's visual identity.

## 2. Why Dropdown Pattern Was Wrong

- Floating card with no structural relationship to dashboard
- 7 items in flat list, no visual categories
- No backdrop or safe overlay behavior
- No body scroll lock on mobile
- No focus trap for keyboard users
- z-index conflicts with user dropdown

## 3. Skills/Books Used

| Source | Application |
|--------|-------------|
| motionPresets.ts | `panelSlideLeft` pattern adapted for rail slide animation |
| UI/UX Pro Max | Section grouping, visual hierarchy, layered dark surfaces |
| Framer Motion | `AnimatePresence` for mount/unmount, spring transitions |

## 4. Explore Rail Structure

Created `src/components/navigation/ExploreRail.tsx` (8.6KB):

**Header:** ML Logo + "Explore Tools" + Close button

**Product Tools:** Counters, Macro, Teams, Meta (with descriptions)

**Community:** Community Hub, Community Cup, My Squad, Tournament History

**Services:** Scrim Services, Tournament Room, Account Valuation

**Compact Utility Card:** Community Cup prize fund + member count

## 5. Navbar Changes

| | Before | After |
|--|--------|-------|
| Primary links | 6 | 8 (added Community, Events) |
| Secondary menu | "More" dropdown | "Explore" rail (side panel) |
| More items | 7 flat list | 11 in 3 categorized groups |

## 6. Z-Index Scale

| z-index | Element |
|---------|---------|
| z-[40] | Navbar |
| z-[50] | User dropdown |
| z-[60] | Explore rail backdrop |
| z-[70] | Explore rail panel |

## 7. Mutual Exclusivity

- Opening Explore closes user dropdown
- Opening user dropdown closes Explore
- Route change closes all
- Escape closes active menu
- Outside click closes active menu

## 8. Accessibility

- `role="dialog"` + `aria-modal="true"` on rail
- `aria-expanded` + `aria-controls` on Explore button
- Focus trap: close button receives focus on open
- Body scroll lock when open
- Keyboard: Escape closes, Tab navigation

## 9. Files

- `src/components/navigation/ExploreRail.tsx` — NEW (8.6KB)
- `src/components/Navbar.tsx` — REWRITTEN (14KB)
- `reports/explore-navigation-rail-navbar-collision-fix.md` — NEW

## 10. Verification

- `npx tsc --noEmit`: **PASS**
- `npm run build`: **PASS** (~16s)

## 11. Known Limitations

1. Community rail on AppDashboard may overlap Explore Rail on very wide screens — acceptable for v1
2. Focus trap only focuses close button, not first menu item
3. Utility card shows static zero data — needs backend
