# App Dashboard Wide Layout Minor Revision Report

**Date:** 2026-07-23 16:15 WIB  
**Model:** mimo-v2.5  
**Status:** COMPLETE

---

## 1. Root Cause of Empty Space

- Container `max-w-7xl` (1280px) was too narrow for 1920px desktop
- All content stacked vertically in single column
- Right rail (My Squad, Updates, Membership) placed below main content instead of beside it
- No 12-column grid usage
- Prize Fund and Timeline took full width instead of sharing with utility cards

---

## 2. Container Width

| | Before | After |
|--|--------|-------|
| Container | `max-w-7xl` (1280px) | `max-w-[1560px]` |
| Padding | `px-4 sm:px-6 lg:px-8` | `px-4 md:px-6 xl:px-8` |
| Usage at 1920px | ~67% | ~81% |

---

## 3. Grid Composition

| Row | Before | After |
|-----|--------|-------|
| Row 1 | Hero full-width | Hero 8cols + Right Rail 4cols |
| Row 2 | Prize Fund full-width, Timeline full-width | Prize Fund 8cols + My Squad + Membership 4cols |
| Row 3 | Right column (Squad, Updates, Membership stacked) | Timeline 8cols + Latest Updates 4cols |
| Row 4 | Quick Actions 3-col | Quick Actions 6-col full width |

---

## 4. Hero Layout

- Width: 8/12 columns on desktop (vs full-width before)
- Height: min 300px (vs 280px before)
- Hero portrait decorations: 10 portraits at 6-7% opacity
- Gradient overlays: cyan + purple glow orbs
- Content: Welcome, name, membership, UID, member since, completion bar, CTA buttons

---

## 5. Right Rail

Two compact cards stacked beside hero:

**Account Snapshot:**
- Avatar, nickname, membership label
- MLBB Connected status
- Profile completion %
- Manage Profile link

**Community Snapshot:**
- Online users (0), Active scrims (0)
- Next Cup status
- Open Community link

---

## 6. Prize Fund Composition

- Horizontal 3-column metrics: Eligible Members, Prize Fund, Status
- Progress bar
- 2-column bottom: Prize Distribution (left) + How It Works (right)
- More horizontal, less vertically stacked

---

## 7. Tournament Timeline

- Horizontal 4-week layout with connector line
- Week circles with status badges
- Monthly Final highlighted with yellow glow
- Takes 8 columns alongside Latest Updates

---

## 8. Quick Actions

- Full-width row at bottom
- 6 cards in horizontal grid (6-col on desktop, 3 on tablet, 2 on mobile)
- Each: icon, label, short description
- Hover: scale + translate-y effect

---

## 9. MLBB Assets Used

- 10 hero portraits as subtle background decoration (6-7% opacity)
- Hero assets from `useSharedData().heroAssets`
- Positioned at right side of hero banner
- Gradient overlay ensures text readability

---

## 10. Verification

- `npx tsc --noEmit`: **PASS** (0 errors)
- `npm run build`: **PASS** (~11s)

---

## 11. Known Limitations

1. Hero portrait positions are hardcoded pixel values - may need adjustment for very wide screens
2. Right rail cards are fixed height - content overflow possible with long names
3. Quick Actions description text may wrap on very narrow cards
