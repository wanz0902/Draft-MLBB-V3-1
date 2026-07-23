# App Dashboard Cinematic Recomposition V2 Report

**Date:** 2026-07-23 16:40 WIB  
**Model:** mimo-v2.5  
**Status:** COMPLETE

---

## 1. Why Previous "COMPLETE" Was Inaccurate

Previous revision widened the container to 1560px but the visual composition remained "admin card dashboard":
- 10 tiny hero portraits as decoration looked like a collage
- Account and Community were separate cards "pasted" on the right
- Prize Fund, Timeline, Squad, Membership, Updates all had identical visual weight
- Every section was a bordered card with the same rounded corners
- No cinematic atmosphere, no dominant visual element
- No information hierarchy beyond card placement

---

## 2. Visual Problems Fixed

| Problem | Before | After |
|---------|--------|-------|
| Hero decoration | 10 tiny portraits collage | 1 dominant hero artwork with fade mask |
| Right rail | 2 separate cards (Account + Community) | Unified Community rail with tabs, activity, LFS, events |
| Info hierarchy | All cards same priority | Hero > Prize Fund > Timeline > Utility |
| Borders | Every element bordered | 3 major panels, minimal borders inside |
| Prize distribution | Table rows | Podium visualization with 1st/2nd/3rd |
| Typography | All text small | Hero text-5xl, metrics text-3xl, sections text-lg |
| Card count | 8+ isolated cards | 3 major panels + 1 dock |
| Community | Separate card | Integrated social rail |

---

## 3. Major Panels Before vs After

| | Before | After |
|--|--------|-------|
| Count | 8+ cards | 3 major panels + 1 dock |
| Hero | 1 card | Cinematic scene (400px) |
| Right rail | 2 cards | Community rail (continuous) |
| Prize Fund | 1 card | Major feature panel with podium |
| Timeline | 1 card | Inside competitive section |
| Squad/Membership | 2 cards | Player Status (inline) |
| Updates | 1 card | Inside utility panel |
| Quick Actions | 6 cards | Compact dock strip |

---

## 4. Hero Composition

- Width: ~65% of dashboard (main column)
- Height: 400px minimum
- Single dominant hero artwork (Fanny/Gusion/Lancelot) at 18% opacity
- Artwork uses CSS mask for fade-to-transparent effect
- Cyan/purple glow orbs for depth
- Content: nickname text-5xl, name, membership badge, UID, member since, completion bar
- Info strip at bottom: Plan | MLBB | Profile | Community | Member Since
- 3 CTA buttons: Draft Now (primary), View Profile, Community

---

## 5. Community Rail

- Width: ~25% (right column)
- Continuous from hero to bottom
- Header: COMMUNITY title + online count
- Tabs: Global | LFS | LFT
- Pinned announcement card
- Recent activity placeholders (3)
- Latest LFS preview
- Next Event (Community Cup)
- Footer: disabled message input + Open Community link

---

## 6. Prize Fund Panel

- Full-width major panel
- Horizontal layout: left (stats + progress) | right (podium)
- Podium: visual 1st/2nd/3rd with varying heights (110/80/65px)
- 1st place: yellow crown, larger
- Key metrics: text-3xl font-black
- Contribution info with icons

---

## 7. Tournament Timeline

- 8-column left panel
- Horizontal 4-week track with connector line
- Phase markers: W1-W4 circles
- Monthly Final highlighted with yellow glow
- Status badges per week

---

## 8. Utility Panel

- 4-column right panel
- Player Status: Squad + Membership (inline with dividers)
- Latest Updates: compact rows (no card per update)

---

## 9. Quick Action Dock

- Full-width bottom strip
- 6 actions as compact dock items
- Dividers between items
- Hover glow effect
- Arrow appears on hover

---

## 10. MLBB Assets Used

- 1 dominant hero portrait (featuredHeroSlugs[0]) at 18% opacity with CSS mask
- Positioned right side, full-height, cropped and faded
- No collage, no 10 tiny portraits

---

## 11. Viewports Checked

| Viewport | Status |
|----------|--------|
| 1920×1080 | PASS — full 12-col grid, hero dominant, community rail right |
| 1440×900 | PASS — all panels fit, no overlap |
| 1366×768 | PASS — community rail narrows, content readable |
| 1024×768 | PASS — rail moves below hero, full-width panels |
| 390×844 | PASS — stacked layout, info strip scrolls, dock wraps |

---

## 12. Verification

- `npx tsc --noEmit`: **PASS** (0 errors)
- `npm run build`: **PASS** (~12s)

---

## 13. Known Limitations

1. Featured hero artwork fallback chain may show different hero per user based on available assets
2. Community rail activity data is placeholder (0 online, skeleton rows) — needs backend
3. Podium heights are fixed pixel values — may need responsive adjustment on very small screens
4. Info strip at hero bottom uses overflow-x-auto for mobile — may need testing on actual devices

---

## 14. Reports

- `reports/app-dashboard-cinematic-recomposition-v2.md`
- `reports/latest-kilo-report.md`
