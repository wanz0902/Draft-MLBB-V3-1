# Sidebar Responsive Runtime Bug Fix — Report

**Task:** Sidebar Runtime Bug Fix Only  
**Date:** 2026-07-23 17:18 WIB  
**Model:** mimo-v2.5  
**Status:** PARTIAL — Code fixed, screenshot QA pending

---

## 1. Root Cause Analysis

### Bug 1: Desktop shows mobile drawer, page blur, X button, backdrop

**Root cause:** In `AppSidebar.tsx` line 340-349, the `mobileDrawer` JSX variable was **always rendered** in the DOM regardless of viewport:

```tsx
return (
  <>
    <aside className="app-sidebar-desktop">...</aside>
    {mobileDrawer}  {/* ALWAYS rendered — even on desktop! */}
  </>
);
```

The `mobileDrawer` contained:
- `.sidebar-mobile-overlay` — fixed fullscreen div with `backdrop-filter: blur(4px)`, `z-index: 100`
- `.sidebar-mobile-drawer` — fixed left panel with `z-index: 110`, X close button

These elements had **no CSS media query** hiding them on desktop. They were always visible and covering the page.

**Why it happened:** The mobile drawer was designed as a separate code path but was unconditionally included in the render output. No conditional rendering or CSS hiding existed for desktop viewports.

### Bug 2: Nav items stacked vertically

**Root cause:** The `.sidebar-nav-item` class had `display: flex` and `align-items: center`, but the `NavLink` component (rendered as an `<a>` tag) did not have `width: 100%`. Without explicit width, the anchor element only took the width of its content, causing the icon and text to stack vertically when the parent container had flex-direction: column.

**Fix:** Added `width: 100%`, `flex-direction: row`, and `box-sizing: border-box` to `.sidebar-nav-item`.

### Bug 3: Progress bar shows 2% when members=0

**Root cause:** Hardcoded `style={{ width: "2%" }}` in AppSidebar.tsx line 170.

**Fix:** Changed to `"0%"`.

### Bug 4: Body scroll lock not managed

**Root cause:** No `document.body.style.overflow` management existed for the mobile drawer.

**Fix:** Added useEffect in AppShell.tsx that sets `overflow: hidden` when `mobileOpen` is true and restores it when false or on unmount.

## 2. Fixes Applied

### AppSidebar.tsx

| Change | Detail |
|--------|--------|
| Conditional mobile render | `{mobileOpen && (<>...</>)}` — mobile drawer only renders when state is true |
| Close button accessible name | Changed from "Close menu" to "Close navigation" |
| Close button type | Added `type="button"` |
| Progress bar | Changed from `"2%"` to `"0%"` |
| Unused imports removed | ChevronLeft, TargetIcon removed |

### AppShell.tsx

| Change | Detail |
|--------|--------|
| Body scroll lock | useEffect sets/restores `document.body.style.overflow` based on `mobileOpen` |

### index.css

| Change | Detail |
|--------|--------|
| Nav item width | Added `width: 100%`, `flex-direction: row`, `box-sizing: border-box` to `.sidebar-nav-item` |
| Desktop defense | Added `@media (min-width: 1280px)` rule to hide `.sidebar-mobile-overlay` and `.sidebar-mobile-drawer` with `display: none !important` |

## 3. Breakpoint Behavior (Final)

| Viewport | Sidebar | Mobile Drawer | Backdrop | Body Lock |
|----------|---------|---------------|----------|-----------|
| ≥1280px | Permanent, expanded/collapsed | Not rendered | None | No |
| 768-1279px | CSS hidden (display:none) | Renders when open | Active when open | Yes when open |
| <768px | CSS hidden (display:none) | Renders when open | Active when open | Yes when open |

## 4. Z-Index Scale (Final)

| z-index | Element |
|---------|---------|
| z-0 | Page content |
| z-30 | Desktop sidebar |
| z-40 | Topbar |
| z-50 | Desktop sidebar (defense) |
| z-100 | Mobile backdrop overlay |
| z-110 | Mobile drawer panel |

## 5. Files Changed

| File | Change |
|------|--------|
| `src/components/navigation/AppSidebar.tsx` | Conditional mobile render, progress fix, a11y fixes |
| `src/components/AppShell.tsx` | Body scroll lock |
| `src/index.css` | Nav item width fix, desktop media query defense |

## 6. Verification

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | **PASS** |
| `npm run build` | **PASS** (17.20s) |

## 7. Screenshot QA

| Viewport | Status |
|----------|--------|
| 1920×1080 desktop expanded | PENDING |
| 1920×1080 desktop collapsed | PENDING |
| Mobile drawer open | PENDING |
| Mobile drawer closed | PENDING |

**Status: PARTIAL** — Code fixes verified via typecheck/build. Manual screenshot QA not yet performed.

## 8. Remaining Limitations

1. Screenshot QA not yet done — needs manual browser testing
2. Focus trap for mobile drawer not fully implemented (only Escape key)
3. `isMobile` state in AppShell uses `window.innerWidth < 1280` check on resize — may have brief flash on initial load before JS runs
4. Community Cup progress hardcoded to 0% (no backend data)
