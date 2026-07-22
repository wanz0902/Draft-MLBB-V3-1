# Liquipedia Snapshot Filter Polish — Phase 1.6 Report

**Tanggal:** Rabu, 18 Juni 2026, pukul 05:25 WIB

## What Changed

### Sync Script (`scripts/sync-liquipedia.ts`)
- Added preflight test: tests player + team endpoints with limit=1 before full sync
- 403 error: clear message "key is invalid, revoked, expired, or not allowed"
- Network error: separate handling with connection check
- Missing key: clear message with expected format
- Safe error messages: never prints key value

### Server Routes (`server.ts`)
- **`/api/liquipedia/status`**: Added `filtersAvailable` field
- **`/api/liquipedia/filters`**: NEW — returns dynamic filter options from snapshot (nationalities, regions, statuses, roles, categories for players; regions, statuses for teams)
- **`/api/liquipedia/players`**: Added `region` filter. All filters AND-combined
- **`/api/liquipedia/teams`**: Filters AND-combined (search + region + status)

### Frontend (`LiquipediaDatabase.tsx`)
- Renamed tab: "Players / People" → "Players"
- Header: "MLBB Pro Database" with "Local Snapshot" badge + last synced date
- Dynamic filter options from `/api/liquipedia/filters` (not hardcoded)
- Player filters: Country, Region, Category, Role, Status, Search, Limit
- Team filters: Search, Region, Status, Limit
- Default: nationality=Indonesia, category=players
- Select component for clean dropdown UI
- Player card: initials avatar, role badge, status, nationality+region, Team Reference (readable), signature heroes, links
- Team card: logo (with fallback), name, region, status, links
- Attribution per section

## Files Changed

| File | Status |
|---|---|
| `scripts/sync-liquipedia.ts` | Preflight test + safe error handling |
| `server.ts` | Added `/api/liquipedia/filters`, improved `/api/liquipedia/status`, added region filter to players |
| `src/components/LiquipediaDatabase.tsx` | Full rewrite: dynamic filters, polished UI, "MLBB Pro Database" header |

## Sync Status

- **Sync executed:** NO
- **Reason:** `LIQUIPEDIA_API_KEY` still 403 (invalid)
- **players.json:** NOT CREATED
- **teams.json:** NOT CREATED

## Validation

- `npm run lint`: **PASS**
- `npm run build`: **PASS** (13.22s)

## Git Safety

- `.env` not tracked (gitignored)
- No API key in changed files
- No secrets in reports or logs

## Next Action

Bro, sistem snapshot sudah siap, tapi sync belum bisa karena `LIQUIPEDIA_API_KEY` masih 403.

1. Generate key baru dari https://liquipedia.net/api/
2. Masukin raw key tanpa prefix `Apikey` ke `.env`:
   ```
   LIQUIPEDIA_API_KEY=KEY_BARU_MENTAH
   ```
3. Jalankan: `npm run sync:liquipedia`
4. Restart: `npm run dev`

## Commit Status

Belum commit. Belum push.
