# UI Recomposition & Layout Restructure Report

**Date:** 2026-07-23 15:50 WIB  
**Model:** mimo-v2.5

---

## 1. Composition Problems Found

| Problem | Location | Fix |
|---------|----------|-----|
| Single-column cards everywhere | AppDashboard, Community, Events | Added 2-column layouts with main + sidebar |
| Generic "tabs + empty area" | All section layouts | Added hero headers, banner sections, stats rows |
| Same card size/priority | All pages | Mixed large spotlight + small utility cards |
| Inconsistent max-width | 3xl/4xl/5xl/6xl/7xl | Standardized to 6xl for content, 7xl for layouts |
| Hardcoded colors vs CSS vars | AppDashboard, ProfileOverview | Unified to CSS variables |
| fadeUp duplication | 10+ files | Import from motionPresets.ts |
| Inline styles in ServicesLayout | ServicesLayout, ScrimServices | Converted to Tailwind + CSS vars |
| No section identity | CommunityLayout, EventsLayout | Added gradient headers with icons + stats |
| Flat requirements list | CommunityCup, AppDashboard | Grouped into categories with icons |
| Empty MySquad state | MySquad | Added squad formation graphic |

---

## 2. Old vs New Page Structure

### App Dashboard (/app)
**Old:** Single column, flat cards stacked vertically  
**New:** Hero header (280px) + 2-column grid (60/40) with main content left + sidebar right

### Community (/community/*)
**Old:** Basic tabs + single-column content  
**New:** Gradient header banner + stats + pill tabs + 2-column layouts (main + sidebar)

### Events (/events/*)
**Old:** Basic tabs + single-column content  
**New:** Competitive header + pill tabs + 2-column layouts (main + sidebar)

### Profile (/profile)
**Old:** Hero card + 3-column flat grid  
**New:** Enhanced hero with showcase artwork + color-differentiated cards + hero assets

### Services (/services/*)
**Old:** Basic tabs + form cards  
**New:** Purple header banner + pill tabs + 3-column service grid

---

## 3. Route-by-Route Layout Summary

| Route | Layout | Composition |
|-------|--------|-------------|
| /app | Dashboard shell | Hero header + 2-col grid + right sidebar |
| /community | Community shell | Gradient header + stats + pill tabs |
| /community/chat | Chat layout | 2-col: messages left, online right |
| /community/lfs | Scrim layout | 2-col: form left, requests right |
| /community/lft | Team layout | 2-col: profile form left, browse right |
| /community/lfp | Player layout | 2-col: recruitment form left, listings right |
| /events | Events shell | Competitive header + pill tabs |
| /events/community-cup | Cup layout | 2-col: prize fund + timeline left, summary right |
| /events/my-squad | Squad layout | Squad formation graphic + info grid |
| /events/history | History layout | Rich empty state with mock table |
| /services | Services shell | Purple header + pill tabs |
| /services/scrim | Scrim layout | 3-col service cards + membership |
| /services/room-tournament | Room layout | Booking form preview |
| /services/account-valuation | Valuation layout | Form with security notice |
| /profile | Profile shell | Left sidebar + main content |
| /profile | Overview | Hero banner + 3-col color-differentiated cards |
| /profile/matches | Matches layout | Tab bar + skeleton match cards |
| /profile/favorites | Favorites layout | 2-col: showcase left, hero grid right |

---

## 4. MLBB Assets Usage

| Asset | Where Used |
|-------|-----------|
| Hero portraits (heroAssets) | AppDashboard hero background, ProfileOverview showcase, ProfileFavorites hero grid, ProfileMatches skeleton cards |
| Hero roles | ProfileOverview role chips, LFT role selector, LFP role selector |
| Membership data | AppDashboard plan badge, ProfileOverview membership, SettingsMembership |
| MLBB UID/SID | ProfileOverview, SettingsMLBB |
| Avatar | AppDashboard header, ProfileOverview, Navbar dropdown |

---

## 5. Navbar Behavior

- Desktop >1440px: All primary links visible
- More dropdown: Counters, Macro, Teams, Meta, Services (3 items)
- Avatar dropdown: Profile, Squad, Membership, Settings, Logout
- Mobile: Hamburger with grouped sections (Product, Platform)
- Max-width: 1600px container
- No visual collision at any tested width

---

## 6. Responsive Fixes

- AppDashboard: 2-col → 1-col on mobile
- Community pages: 2-col → 1-col on mobile
- Events pages: 2-col → 1-col on mobile
- Profile: sidebar collapses to drawer on mobile
- All hero headers: stack vertically on mobile
- Navbar: hamburger on <1280px

---

## 7. Verification

- `npx tsc --noEmit`: **PASS** (0 errors)
- `npm run build`: **PASS** (~15s)

---

## 8. Implementation Status

| Feature | Status |
|---------|--------|
| App Dashboard hero header | UI PREVIEW |
| App Dashboard 2-col grid | UI PREVIEW |
| Community header banner | COMPLETE |
| Community 2-col layouts | UI PREVIEW |
| Global Chat feed + sidebar | UI PREVIEW |
| LFS form + requests | UI PREVIEW |
| Events header banner | COMPLETE |
| Community Cup 2-col layout | UI PREVIEW |
| My Squad formation graphic | UI PREVIEW |
| Tournament History mock table | UI PREVIEW |
| Profile hero with showcase | UI PREVIEW |
| Profile color-differentiated cards | COMPLETE |
| Profile hero assets integration | COMPLETE |
| Services purple header | COMPLETE |
| Services 3-col grid | UI PREVIEW |
| Navbar responsive | COMPLETE |
| Avatar dropdown | COMPLETE |
| Route redirects | COMPLETE |

---

## 9. Reports

- `reports/ui-recomposition-layout-polish.md` (this file)
- `reports/latest-kilo-report.md` (updated)
