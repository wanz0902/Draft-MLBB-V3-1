# Sidebar Compact Label Alignment + Spacing Fix — Report

**Task:** Sidebar Nav Item Alignment + Compact Label Mode + Spacing Collision Fix  
**Date:** 2026-07-23 17:27 WIB  
**Model:** mimo-v2.5  
**Status:** PARTIAL — Code fixed, screenshot QA pending

---

## 1. Root Cause: Nav Items Vertical

**Root cause:** The CSS class `.sidebar-nav-item` had correct `display: flex; flex-direction: row;` properties, but the NavLink component (rendered as `<a>`) was being constrained by parent or Tailwind v4 CSS layer specificity. The custom CSS classes were placed after `@import "tailwindcss"` but Tailwind v4's layer system may have caused specificity issues.

**Fix:** Removed all `.sidebar-nav-item` CSS class definitions. Replaced with explicit Tailwind utility classes directly on every NavLink element:

```tsx
className="flex flex-row items-center w-full min-w-0 gap-2.5 px-3 py-2 rounded-[10px] text-[13px] font-medium no-underline cursor-pointer relative transition-all duration-150 ..."
```

This guarantees horizontal layout because Tailwind utilities have higher specificity than custom CSS in Tailwind v4.

## 2. Root Cause: Collapsed = Icon-Only

**Root cause:** The "collapsed" mode used a completely separate render path (`renderCollapsedIconNav`) that only showed icons with no labels. User wanted a compact mode with icon + short label.

**Fix:** Replaced "collapsed" mode with "compact" mode:
- New `--sidebar-compact-width: 116px` token
- Compact items show icon (16px) + short label (11px) in a row
- Short labels: Home, Draft, Heroes, Data, Live, Planner, Counter, Macro, Teams, Meta, Chat, Cup, Squad, History, Scrim, Room, Value
- Expanded mode keeps full labels: Live Matches, Draft Planner, Community Hub, etc.
- localStorage key changed from `mvp-sidebar-collapsed` to `mvp-sidebar-compact`

## 3. Expanded Mode Final

```
Width: 248px
Header: [ML Logo] MVP Draft / COMMAND CENTER  [PanelLeftClose]
Nav: Icon (18px) + Label (13px) per row
Group labels: 9px uppercase
Footer: Cup card + User profile with settings icon
```

## 4. Compact Mode Final

```
Width: 116px
Header: [ML Logo] / [PanelLeftOpen]
Nav: Icon (16px) + Short label (11px) per row
Dividers between groups (no group labels)
Footer: Trophy icon + Avatar only
```

## 5. Width Tokens

```css
--sidebar-width: 248px;           /* Expanded */
--sidebar-compact-width: 116px;   /* Compact */
--topbar-height: 56px;            /* Top context bar */
```

## 6. AppShell Offset

| State | margin-left |
|-------|-------------|
| Expanded | 248px |
| Compact | 116px |
| Mobile | 0 |

Data attribute: `data-sidebar-compact` on `.app-main`.

## 7. Scroll/Footer Structure

```
aside (fixed, 100dvh)
├── header (flex-shrink: 0)
├── nav scroll (flex: 1, min-h: 0, overflow-y: auto)
└── footer (flex-shrink: 0)
```

Scrollbar: 4px width, transparent track, subtle cyan thumb.

## 8. CSS Conflicts Removed

- Removed `.sidebar-nav-item` class (replaced by Tailwind utilities)
- Removed `.sidebar-nav-scroll`, `.sidebar-nav-scroll-collapsed` classes
- Removed `.sidebar-nav-section`, `.sidebar-nav-group` classes
- Removed `.sidebar-collapsed-icon` class
- Removed `.sidebar-brand`, `.sidebar-brand-link`, `.sidebar-brand-icon`, etc.
- Removed `.sidebar-collapse-btn`, `.sidebar-expand-btn`
- Removed `.sidebar-footer`, `.sidebar-footer-collapsed`
- Removed `.sidebar-cup-card`, `.sidebar-cup-header`, `.sidebar-cup-title`, etc.
- Removed `.sidebar-user`, `.sidebar-user-avatar`, `.sidebar-user-info`, etc.
- Removed `.sidebar-avatar-collapsed`, `.sidebar-user-collapsed`
- All these are now inline Tailwind classes in the JSX

## 9. Skill Usage

| Source | Application |
|--------|-------------|
| UI/UX Pro Max | Compact information architecture, density hierarchy, predictable navigation |
| Context7 | NavLink active states, accessible button patterns, CSS flexbox sizing |

## 10. Files Changed

| File | Change |
|------|--------|
| `src/components/navigation/AppSidebar.tsx` | Full rewrite: explicit Tailwind classes, compact mode with short labels, expanded with full labels |
| `src/components/AppShell.tsx` | Renamed collapsed→compact, localStorage key mvp-sidebar-compact, data-sidebar-compact |
| `src/index.css` | Removed ~400 lines of old sidebar CSS, added compact-width token, kept only structural styles |
| `src/pages/app/AppDashboard.tsx` | Podium spacing: wider bars, more padding, bigger total text |

## 11. Verification

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | **PASS** |
| `npm run build` | **PASS** (16.75s) |

## 12. Screenshot QA (Pending)

| Viewport | Status |
|----------|--------|
| 1920×1080 expanded | PENDING |
| 1920×1080 compact | PENDING |
| 1366×768 expanded | PENDING |
| 1366×768 compact | PENDING |
| 1024×768 | PENDING |
| 390×844 drawer open | PENDING |
| Prize Fund desktop | PENDING |
| Prize Fund mobile | PENDING |

**Status: PARTIAL** — Code fixes verified via typecheck/build. Manual screenshot QA not yet performed.

## 13. Remaining Limitations

1. Screenshot QA not yet done
2. Focus trap for mobile drawer not fully implemented
3. `isMobile` state may flash on initial load before JS runs
4. Community Cup progress hardcoded to 0%
5. Old localStorage key `mvp-sidebar-collapsed` not migrated to `mvp-sidebar-compact`
