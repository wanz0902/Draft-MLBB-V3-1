# Liquipedia Local Snapshot / Offline Data — Phase 1.5 Report

**Tanggal:** Rabu, 18 Juni 2026, pukul 05:05 WIB

## Summary

Converted Liquipedia Data Layer from live-API-per-page-load to local persistent snapshot system. Frontend now reads from local JSON files. Sync is manual via `npm run sync:liquipedia`.

## What Changed

### Architecture
- **Before:** Every page load → server calls Liquipedia API → uses API key at runtime
- **After:** Manual sync → writes to `data/liquipedia/*.json` → server reads local files → no API key at page load

## Files Changed

| File | Status |
|---|---|
| `server/services/liquipediaService.ts` | Exported normalizers (`normalizePlayer`, `normalizeTeam`, `normalizeLinks`, `fetchLiquipediaV3`, `pagenameToReadable`) |
| `server.ts` | Rewrote `/api/liquipedia/players` and `/api/liquipedia/teams` to read from local JSON. Added `/api/liquipedia/status`. Removed `/api/liquipedia/cache/clear` |
| `scripts/sync-liquipedia.ts` | **NEW** — Sync script with pagination (500/page), dedupe, 500ms delay |
| `src/components/LiquipediaDatabase.tsx` | Updated for local snapshot: nationality filter, search via backend, pagination, snapshot status, "Local Snapshot" badge |
| `package.json` | Added `"sync:liquipedia": "tsx scripts/sync-liquipedia.ts"` |
| `.env.example` | Already had Liquipedia placeholders (from Phase 1) |

## New Data Files

| File | Description |
|---|---|
| `data/liquipedia/players.json` | Normalized player records (created by sync) |
| `data/liquipedia/teams.json` | Normalized team records (created by sync) |
| `data/liquipedia/sync-meta.json` | Sync metadata (source, counts, timestamp) |

## Sync Command

```bash
npm run sync:liquipedia
```

Requires valid `LIQUIPEDIA_API_KEY` in `.env`. API key is used ONLY during sync, never at page load.

## Backend Endpoints

### GET /api/liquipedia/status
Returns snapshot availability and last sync time.

### GET /api/liquipedia/players
Reads from `data/liquipedia/players.json`. Supports filters:
- `nationality` (e.g., Indonesia)
- `status` (e.g., Active)
- `role` (gold, exp, mid, roamer, jungler, coach, analyst, caster, commentator)
- `category` (players, staff, talent, all)
- `search` (backend search over nickname, realName, nationality, teamReference)
- `limit`, `offset` (pagination)

Returns `{ ok: true, sourceMode: "local-snapshot", lastSyncedAt, players, total, limit, offset }`.

### GET /api/liquipedia/teams
Reads from `data/liquipedia/teams.json`. Supports filters:
- `status` (active, disbanded, etc.)
- `region`
- `search` (name, template, region)
- `limit`, `offset`

## Frontend Changes

- "Local Snapshot" badge in header
- Last synced date display
- Snapshot missing warning with sync command
- Nationality dropdown (Indonesia default, Global, PH, MY, SG, MM, KH, TH, VN)
- Search via backend (not just client-side)
- Load More pagination
- Team status filter (Active/All/Disbanded)
- Team search
- Player initials avatar fallback
- `teamReferenceReadable` (pagename converted to readable format)

## Sync Status

- **Sync executed:** NO
- **Reason:** `LIQUIPEDIA_API_KEY` in `.env` is invalid (Liquipedia returns 403)
- **players.json:** NOT YET CREATED
- **teams.json:** NOT YET CREATED

## Validation

- `npm run lint`: **PASS**
- `npm run build`: **PASS** (12.61s)

## Git Safety

- `.env` not tracked (gitignored)
- `data/liquipedia/` snapshot files contain only public Liquipedia data, no API key
- No secrets in changed files

## Known Limitations

- Sync requires valid Liquipedia API key
- No auto-sync on page load (by design)
- Player photos not available from `/v3/player` endpoint
- Snapshot is point-in-time; re-run sync to update

## Next Action

User needs to:
1. Get valid API key from https://liquipedia.net/api/
2. Update `LIQUIPEDIA_API_KEY` in `.env`
3. Run `npm run sync:liquipedia`
4. Restart dev server

## Commit Status

Belum commit. Belum push.
