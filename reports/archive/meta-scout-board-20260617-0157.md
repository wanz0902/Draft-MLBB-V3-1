# Hero Stats Left Meta Scout Board Report

**Tanggal:** Rabu, 17 Juni 2026, pukul 01:57 WIB

## Files Changed

| File | Status |
|---|---|
| `src/components/StatsDashboard.tsx` | Modified — Left hero grid replaced with compact Meta Scout Board |

## UX Issue

Hero cards in the left panel were too large (~300px height per card with h-56 portrait), forcing excessive scrolling through 82 heroes. The gallery-style layout did not feel like an analyst dashboard. Data (WR, picks, bans) was small and hard to compare across heroes.

## Fix Applied

### CompactHeroMetaCard Component
Created inline `CompactHeroMetaCard` component inside `StatsDashboard.tsx`:
- Card height: ~72-92px (vs ~300px previously)
- Portrait: 52x52px rounded-lg with role-colored border
- Hero name: text-sm font-bold, truncated
- Role chip: text-[8px] uppercase with role color background (ASN/FHT/MAG/MKS/TNK/SUP)
- Tier chip: text-[8px] gold/dark gradient badge with glow
- WR color: emerald (#34d399) >=55%, amber (#f59e0b) 48-55%, rose (#fb7185) <48%
- Picks/Bans: text-[10px] mono, bans red if >20
- Presence bar: h-1.5, width proportional to percentage
- Selected: amber border glow
- Hover: subtle scale + role-color border

### Grid Layout
- Changed from grid (2-5 columns) to flex column list
- Scroll height increased to 680px for better visibility
- Tighter gap (1.5 = 6px) between cards
- Single column layout for clean data comparison

### Helper Functions Added
- `getWinRateColor(wr)` — returns emerald/amber/rose based on thresholds
- `getRoleShort(role)` — returns 3-letter role abbreviation

### Preserved Behavior
- Search filter still works
- Role filter still works
- Sort (presence/winrate/picks/bans/name) still works
- Click hero → right panel updates
- View Intelligence Profile → HeroFullPage routing preserved
- HeroCard.tsx file NOT deleted (only import removed from StatsDashboard)

## Validation

- `npm run lint`: **PASS** (tsc --noEmit, 0 errors)
- `npm run build`: **PASS** (built in 18.15s)
- localhost manual check: **PENDING** — run `npm run dev` and verify at http://localhost:3001 → Heroes → Hero Stats

## Not Touched

- AI lock
- Draft Pick
- Landing Page
- HeroFullPage.tsx
- HeroDetailPanel.tsx
- HeroCard.tsx (file intact, only import removed)
- Neon/R2/database/storage migration
- Right detail panel (Hero Intelligence Card)
- .env
- Routing logic
- heroUtils.ts
- React Router

## Commit Status

Belum commit. Belum push.
