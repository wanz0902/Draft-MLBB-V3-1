# Liquipedia 429 Rate Limit Handling Report

**Tanggal:** Rabu, 18 Juni 2026, pukul 14:20 WIB

## Problem

`npm run sync:liquipedia` fails with HTTP 429 from Liquipedia API. The key is valid and read correctly, but Liquipedia rate/quota limits were hit.

## What Changed

### `server/services/liquipediaService.ts`
- Added explicit 429 handling in `fetchLiquipediaV3`
- Extracts `Retry-After` header if present
- Throws descriptive error: "429 Rate Limit. The key is configured, but rate/quota limit was reached..."

### `scripts/sync-liquipedia.ts` — Full rewrite

**429 handling:**
- `classifyError()` categorizes: `rate_limit`, `auth`, `missing_key`, `network`, `unknown`
- On 429: stops immediately, prints partial data count, does NOT retry in tight loop
- Partial data is returned instead of crashing (caller decides whether to save)

**CLI arguments:**
- `--endpoint=players|teams|all` (default: all) — sync only what you need
- `--limit=N` (default: 500, max: 1000) — page size
- `--offset=N` (default: 0) — start offset for resuming

**Less aggressive preflight:**
- Only tests endpoints being synced
- If `--endpoint=teams`, skips player preflight entirely

**Larger delay:**
- Increased from 500ms to 700ms between requests

**Partial sync:**
- Meta file merges with existing data on partial sync
- If only players synced, teams count preserved from previous sync

## Files Changed

| File | Change |
|---|---|
| `server/services/liquipediaService.ts` | 429 error handling with Retry-After extraction |
| `scripts/sync-liquipedia.ts` | Full rewrite: 429 stop, CLI args, partial sync, classifyError |

## Usage Examples

```bash
# Full sync (default)
npm run sync:liquipedia

# Players only
npm run sync:liquipedia -- --endpoint=players

# Teams only
npm run sync:liquipedia -- --endpoint=teams

# Small batch test (10 players)
npm run sync:liquipedia -- --endpoint=players --limit=10

# Resume from offset
npm run sync:liquipedia -- --endpoint=players --offset=500
```

## Validation

- `npm run lint`: **PASS**
- `npm run build`: **PASS** (14.26s)

## Status

- Key is read correctly: **YES**
- 429 means: rate/quota limit reached (key valid, but too many requests or daily quota exceeded)
- Code now stops safely on 429: **YES**
- Partial data preserved: **YES**

## Next Steps

After cooldown (wait ~1-5 minutes or until next day depending on quota):

```bash
# Test small batch first
npm run sync:liquipedia -- --endpoint=players --limit=10

# If OK, try teams
npm run sync:liquipedia -- --endpoint=teams --limit=10

# If both OK, full sync
npm run sync:liquipedia
```

If 429 persists after waiting, the daily quota may be exhausted. Check Liquipedia dashboard for quota reset time.

## Commit Status

Belum commit. Belum push.
