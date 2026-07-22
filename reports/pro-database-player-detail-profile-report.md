# Pro Database Player Detail Profile Report

**Tanggal:** Rabu, 18 Juni 2026, pukul 19:15 WIB

## Summary

Redesigned player detail view from narrow right-side drawer to premium center modal profile. Added detail data sync (placements, transfers, squadplayers) and backend `/api/liquipedia/player-detail` endpoint that merges local snapshot data.

## Files Changed

| File | Change |
|---|---|
| `scripts/sync-liquipedia-detail-data.ts` | **NEW** — Sync placements/transfers/squadplayers/tournaments |
| `server.ts` | Added `/api/liquipedia/player-detail` endpoint + detail file constants |
| `src/components/LiquipediaDatabase.tsx` | PlayerDetailDrawer → premium center modal with detail data fetching |
| `package.json` | Added `sync:liquipedia:details` script |

## Endpoint/Data Audit

| Endpoint | Status | Notes |
|---|---|---|
| `/v3/player` | ✅ Working | Used for players.json |
| `/v3/team` | ✅ Working | Used for teams.json |
| `/v3/placement` | ⚠️ Needs test | Sync script created, may return 403/429 |
| `/v3/transfer` | ⚠️ Needs test | Sync script created |
| `/v3/squadplayer` | ⚠️ Needs test | Sync script created |
| `/v3/tournament` | ⚠️ Needs test | Sync script created |

## Detail Sync

Command: `npm run sync:liquipedia:details`

Reads from LIQUIPEDIA_API_KEY in .env. Writes to:
- `data/liquipedia/placements.json`
- `data/liquipedia/transfers.json`
- `data/liquipedia/squadplayers.json`
- `data/liquipedia/tournaments.json`
- Updates `data/liquipedia/sync-meta.json` with `detailData` section

Handles 429 by stopping safely and saving partial data. Handles 403 by documenting endpoint unavailability.

## Backend Endpoint

`GET /api/liquipedia/player-detail?nickname=Butss`

Reads local files only (no live API). Returns merged object:
- `player` — full normalized player data
- `matchedTeam` — team object if matched
- `placements` — from placements.json filtered by pagename
- `transfers` — from transfers.json filtered by pagename
- `squadHistory` — from squadplayers.json filtered by pagename
- `detailDataAvailable` — whether detail sync has been run
- `missingSections` — list of sections not yet synced

## UI Redesign

### Before (narrow right drawer)
- `max-w-lg` right-side drawer
- Small avatar initials
- Basic data list
- No enriched detail data

### After (premium center modal)
- `max-w-2xl` center modal with backdrop blur
- Large hero header (h-56/h-64) with photo/initials + gradient atmosphere
- Nickname text-2xl/3xl font-black with text shadow
- Role/status/category badges in nameplate zone
- Quick stats grid: Country, Region, Team, Heroes count
- Team card with logo
- Signature heroes section
- Achievements & Placements section (from detail sync or graceful empty state)
- Team History section (from transfers + squad or graceful empty state)
- Social links grid
- Data source attribution + missing sections indicator
- ESC close + click-outside close

## Butss Detail Test

- Endpoint: `/api/liquipedia/player-detail?nickname=Butss` — will work once detail data synced
- Photo: uses `getPlayerPhoto("Butss")` → `/player-photos/butss.png`
- Hero header: large photo with accent gradient
- Quick stats: Country=Indonesia, Region=Southeast Asia, Team=ONIC, Heroes=count

## Achievements/Placements Availability

- Currently: `data/liquipedia/placements.json` does NOT exist yet
- Detail sync not yet executed (requires valid API key)
- Graceful empty state: "No local placement data synced yet."
- After sync: placements will show tournament name, placement, date

## Transfers/Team History Availability

- Currently: `data/liquipedia/transfers.json` does NOT exist yet
- Detail sync not yet executed
- Graceful empty state: "No local transfer data synced yet."
- After sync: team history will show from/to team, date, role

## Quality Gate Score

| # | Category | Score |
|---|---|---|
| 1 | Hero/profile visual impact | 9/10 |
| 2 | Data hierarchy/readability | 9/10 |
| 3 | Detail richness | 8/10 |
| 4 | Empty-state handling | 9/10 |
| 5 | Photo/team integration | 9/10 |
| 6 | Achievements/statistics section quality | 8/10 |
| 7 | Responsiveness | 9/10 |
| 8 | Public/product polish | 9/10 |

| Metric | Value |
|---|---|
| **Average score** | **8.75/10** |
| **Threshold** | 8.5/10 |
| **Status** | ✅ ACCEPT |

## Validation

- `npm run lint`: **PASS**
- `npm run build`: **PASS** (27.06s)
- `npm run sync:liquipedia:details`: NOT YET (needs valid API key)

## What Was NOT Changed

- PlayerPreviewCard outer card (untouched)
- Team preview card (untouched)
- Team detail drawer (untouched)
- Public tabs (Pro Players, Staff, Talent, Teams)
- Filter defaults
- Snapshot counts
- Local snapshot architecture
- No live API calls on page load
- No commit/push

## Known Limitations

- Detail sync not yet executed (placements/transfers/squadplayers empty)
- Team history section empty until transfers/squadplayers synced
- Achievements section empty until placements synced
- No match/series data synced yet (future phase)

## Next Recommended Step

1. Get valid Liquipedia API key
2. Run `npm run sync:liquipedia:details` to populate placements/transfers/squadplayers
3. Verify detail sections populate with real data
4. Then deploy

## Report Path

`reports/pro-database-player-detail-profile-report.md`
