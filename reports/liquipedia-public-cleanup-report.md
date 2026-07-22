# Liquipedia Public Cleanup + Admin-Ready Review Separation Report

**Tanggal:** Rabu, 18 Juni 2026, pukul 16:50 WIB

## Files Changed

| File | Change |
|---|---|
| `src/components/LiquipediaDatabase.tsx` | Removed Needs Review tab, default filters → All, cleaned header |

## Changes Applied

### 1. Needs Review Removed from Public UI
- **Before:** 5 tabs — Pro Players, Team Staff, Broadcast Talent, Needs Review, Teams
- **After:** 4 tabs — Pro Players, Team Staff, Broadcast Talent, Teams
- `needs_review` data still exists in backend/internal logic
- `categoryCounts.needs_review` still computed server-side
- Comment added: "Needs Review reserved for future Admin Dashboard"

### 2. Default Filters → All
- **Country:** `"Indonesia"` → `""` (All Countries)
- **Region:** `""` (All Regions) — unchanged
- **Status (teams):** `"active"` → `""` (All Statuses)
- **Category:** `"pro_player"` — unchanged (default tab)
- **Per page:** 50 — unchanged

### 3. Country/Region Separation
- Country dropdown: All Countries, Indonesia, Philippines, Malaysia, etc.
- Region dropdown: All Regions, Southeast Asia, CIS, Europe, etc.
- No counts inside dropdown options
- `nationality` filter sends clean value (not "Global" check removed)

### 4. Role Dropdown (unchanged — already clean)
- Pro Players tab: Gold, EXP, Mid, Roamer, Jungler
- Team Staff tab: Coach, Analyst, Manager
- Broadcast Talent tab: Caster, Commentator, Host, Content Creator
- No raw aliases (bottom, jgl, jungle, exp lane, etc.)

### 5. Header Display
- **Before:** `420 Pro Players · 48 Staff · 36 Talent · 95 Review`
- **After:** `420 Pro Players · 48 Staff · 36 Talent` (Review count hidden from public)

### 6. Reserved for Admin Dashboard
- `needs_review` category logic preserved in `classifyPerson()`
- `categoryCounts.needs_review` still computed in `/api/liquipedia/status`
- `roleCategory === "needs_review"` records still exist in snapshot
- Not exposed in public tabs, header, or filter dropdowns

## Validation

- `npm run lint`: **PASS**
- `npm run build`: **PASS** (18.60s)

## Git Safety

- `.env` not tracked
- No secrets in changed files
- No commit/push

## Commit Status

Belum commit. Belum push.
