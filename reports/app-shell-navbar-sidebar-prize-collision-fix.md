# App Shell Offset + Topbar Alignment + Sidebar Collision + Prize Panel Fix

**Task:** App Shell Layout Collision Fix  
**Date:** 2026-07-23 18:33 WIB  
**Model:** mimo-v2.5  
**Status:** PARTIAL — Code fixed, screenshot QA pending

---

## 1. Root Cause: Offset Mismatch

The previous implementation used separate `data-sidebar-compact` and `data-mobile` attributes on `.app-main`, with independent `margin-left` overrides. This created:
- Inconsistent offset between sidebar and main content
- Hamburger button visible on desktop (should only be on mobile)
- Topbar not aligned with sidebar edge

**Fix:** Introduced a single CSS variable `--app-current-sidebar-width` controlled by `data-sidebar-mode` on `.app-shell`. Both `.app-main` and the sidebar use this variable, guaranteeing synchronization.

## 2. Width Tokens (Final)

```css
--app-sidebar-expanded-width: 248px;
--app-sidebar-compact-width: 124px;
--app-topbar-height: 56px;
--app-current-sidebar-width: var(--app-sidebar-expanded-width);
```

Backward compat aliases kept: `--sidebar-width`, `--sidebar-compact-width`, `--topbar-height`.

## 3. Topbar Alignment

**Before:** Topbar was full-width with `padding: 0 1.25rem`, misaligned with sidebar edge.

**After:** Topbar has inner container:
```css
.app-topbar-inner {
  width: 100%;
  max-width: 1640px;
  margin-inline: auto;
  padding-inline: 24px;
}
```

Left side shows page title (derived from route). Right side shows Online/Users badges with proper gap (8px).

## 4. Desktop Hamburger Fix

**Before:** Hamburger button visible on desktop, used to toggle compact mode.

**After:** Hamburger hidden on desktop via CSS:
```css
@media (min-width: 1280px) {
  .app-topbar-menu { display: none; }
}
```

Expand/collapse lives in sidebar header (PanelLeftClose/PanelLeftOpen). Hamburger only visible on mobile/tablet for opening drawer.

## 5. Sidebar Footer Fix

**Expanded footer:** Added `padding-bottom: max(16px, env(safe-area-inset-bottom))`, increased gap to 2.5, added `pt-2` for breathing room.

**Compact footer:** Added `padding-bottom: max(12px, env(safe-area-inset-bottom))`, increased gap to 3, trophy/avatar targets 40×40px.

## 6. Nav Scroll Fix

Navigation area uses `flex: 1; min-height: 0; overflow-y: auto; overscroll-behavior: contain`. Footer is `flex-shrink: 0` and never enters scroll area.

## 7. Prize Panel Grid Fix

**Before:** `grid-cols-[1fr_280px]` — podium could overflow on narrow viewports.

**After:** `grid-cols-[minmax(0,1fr)_minmax(300px,380px)]` — podium has safe minimum width, metrics get remaining space.

## 8. Podium Safe Area

- Podium wrapper: `py-4 px-5` (increased from px-4)
- Podium bars: gap `3 sm:4`, bars `86px/104px/86px`
- Outer panel: `overflow-hidden` only on decorative glow layer, NOT on content
- Coming Soon badge: `flex-shrink-0 whitespace-nowrap`, no absolute positioning

## 9. CSS Rules Removed

- `.app-main[data-sidebar-compact]` — replaced by `data-sidebar-mode`
- `.app-main[data-mobile]` — replaced by `data-sidebar-mode="mobile"`
- Old `--sidebar-width: 248px` — aliased to new token
- Old `--sidebar-compact-width: 116px` — changed to 124px, aliased
- Duplicate media query blocks for mobile drawer hiding — consolidated

## 10. Skill Usage

| Source | Application |
|--------|-------------|
| UI/UX Pro Max | Spacing rhythm, safe content margins, component hierarchy |
| Context7 | CSS Grid minmax, responsive navigation, accessible sidebar |
| Framer Motion | Width/content offset sync via CSS variables (no JS animation needed) |

## 11. Files Changed

| File | Change |
|------|--------|
| `src/index.css` | New token system, synchronized offset, hamburger hidden desktop, topbar inner container |
| `src/components/AppShell.tsx` | `data-sidebar-mode`, page title from route, hamburger only mobile |
| `src/components/navigation/AppSidebar.tsx` | Compact width 124px, footer spacing, token references |
| `src/pages/app/AppDashboard.tsx` | Prize panel grid minmax, podium safe area, header full-width, overflow fix |

## 12. Verification

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | **PASS** |
| `npm run build` | **PASS** (14.88s) |

## 13. Screenshot QA (Pending)

| Viewport | Status |
|----------|--------|
| 1920×1080 expanded | PENDING |
| 1920×1080 compact | PENDING |
| 1366×768 expanded | PENDING |
| 1366×768 compact | PENDING |
| 1024×768 | PENDING |
| 390×844 | PENDING |
| Prize Fund 1920 | PENDING |
| Prize Fund 1366 | PENDING |
| Prize Fund mobile | PENDING |

**Status: PARTIAL** — Code fixes verified. Screenshot QA not yet performed.

## 14. Remaining Limitations

1. Screenshot QA not done
2. Focus trap for mobile drawer not fully implemented
3. `isMobile` state may flash on initial load
4. Community Cup progress hardcoded to 0%
5. Old localStorage key `mvp-sidebar-collapsed` not migrated to `mvp-sidebar-compact`
