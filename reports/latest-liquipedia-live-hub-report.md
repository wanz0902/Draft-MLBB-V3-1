# Live Match Hub — Asian Games / Liquipedia Matches Source Fix Report

**Tanggal:** Kamis, 19 Juni 2026, pukul 17:35 WIB

## User Correction

MPL Indonesia S17 was incorrectly shown as the default event. User wanted current Asian Games 2026 Qualifiers matches from Liquipedia:Matches page. MPL S17 is historical and should not be the default.

## Root Cause

1. Sync script defaulted to local `data/matches.json` (MPL S17 historical data)
2. Local seed labeled as "real" data instead of clearly marked "historical"
3. `/v3/series` was incorrectly tested with invalid query fields earlier (causing 404)
4. Real issue: rate limit (429) from multiple rapid API calls

## API Endpoint Status (verified this session)

| Endpoint | Status | Notes |
|---|---|---|
| `/v3/player` | 200 | Works |
| `/v3/team` | 200 | Works |
| `/v3/series` | 200 | Works (minimal query: name,pagename) |
| `/v3/tournament` | 200 | Works (minimal query: name,pagename) |
| `/v3/match` | 404 | Does not exist for this wiki |
| `/v3/placement` | 404 | Not available |

**Key insight:** `series` and `tournament` DO work, but earlier 404 was caused by:
- Invalid query fields (date, participants don't exist on these endpoints)
- Rate limiting (429 responses disguised as 404 after quota exhaustion)

## Files Changed

| File | Change |
|---|---|
| `data/liquipedia-live-hub-sources.json` | **NEW** — Source config with Asian Games as default |
| `scripts/sync-liquipedia-live-hub.ts` | Rewritten: source selection, minimal queries, clear fallback labels |
| `src/components/LiquidMatchHub.tsx` | Source banner, country flags, empty states, no MPL default |

## Source Config

```
Default: asian-games-2026-qualifiers
  - API: /v3/series, wiki=mobilelegends
  - Keywords: Asian Games, Qualifier, West/SEA/Central/East Asia

MPL Seed (disabled by default):
  - local-seed, data/matches.json
  - Historical fallback only
```

## Sync Command

```bash
# Sync Asian Games (default, API only)
npm run sync:liquipedia:live:ag

# Or explicitly:
npm run sync:liquipedia:live -- --source=asian-games-2026-qualifiers --api-only --force
```

## Sync Result

Currently blocked by rate limit (429) from rapid testing. API endpoints confirmed working.

```
sourceMode: empty (rate-limited during testing)
Warning: API endpoint not found (404). [actually 429 masked as error]
```

After rate limit clears (5-15 min), re-run:
```bash
npm run sync:liquipedia:live -- --source=asian-games-2026-qualifiers --api-only --force
```

## Frontend Changes

- MPL S17 is NO LONGER the default source
- Source banner shows clear label: "Historical local seed" or API status
- Empty states explain what to do
- Country flags for Asian Games teams (IDN→🇮🇩, PHI→🇵🇭, etc.)
- Match card shows score, timer, winner, team logos/initials
- Default tab: Live > Upcoming > Completed > All

## Country Flag Fallback

Asian Games country codes mapped to emoji flags:
- IDN→🇮🇩, PHI→🇵🇭, SGP→🇸🇬, MAS→🇲🇾, CAM→🇰🇭
- KSA→🇸🇦, OMN→🇴🇲, JOR→🇯🇴, ARE→🇦🇪, IRI→🇮🇷
- UZB→🇺🇿, KGZ→🇰🇬, PAK→🇵🇰, HKG→🇭🇰
- Unknown codes show initials badge

## Validation

- `npm run lint`: PASS
- `npm run build`: PASS (11.11s)
- API endpoints: series=200, tournament=200 (verified)
- Rate limit: 429 active (will clear in 5-15 min)

## What Was NOT Changed

- MPL local seed data (historical, still in data/matches.json)
- Other pages/features
- API key handling

## Next Step

Wait 5-15 minutes for rate limit to clear, then:
```bash
npm run sync:liquipedia:live -- --source=asian-games-2026-qualifiers --api-only --force
```

## Git Status

Belum commit. Belum push.

## Report Path

`reports/latest-liquipedia-live-hub-report.md`
