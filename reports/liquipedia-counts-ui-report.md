# Liquipedia Snapshot Counts UI Report

**Tanggal:** Rabu, 18 Juni 2026, pukul 14:57 WIB

## What Changed

Added clear snapshot counts and filtered display counts to the Pro Database UI.

## Files Changed

| File | Change |
|---|---|
| `server.ts` | `/api/liquipedia/status` now falls back to JSON array length if meta count is missing |
| `src/components/LiquipediaDatabase.tsx` | Header counts, tab counts, result counts, improved Load More |

## Where Counts Are Displayed

### Header
```
Local Snapshot • 599 Players · 343 Teams · Last synced: 18 Jun 2026, 14:49
```

### Tabs
```
Players (599)  |  Teams (343)
```

### Near list (per tab)
```
Showing 50 of 120 players · Snapshot total: 599
```

### Snapshot missing state
```
Local Snapshot unavailable · Players: 0 · Teams: 0
```

## Count Sources

| Count | Source | Fallback |
|---|---|---|
| `playersCount` | `sync-meta.json` → `playersCount` | `players.json` array length |
| `teamsCount` | `sync-meta.json` → `teamsCount` | `teams.json` array length |

## Result Count Behavior

- **No filter active:** `Showing 50 of 599 players`
- **Filter active (e.g. Indonesia):** `Showing 50 of 120 players · Snapshot total: 599`
- **All loaded:** `All filtered players loaded` (Load More button hidden)
- **More available:** `Load more players (50/120)`

## Validation

- `npm run lint`: **PASS**
- `npm run build`: **PASS** (13.02s)

## Not Touched

- Data sync behavior
- API key logic
- Draft War Room, AI providers, hero stats, match analytics

## Commit Status

Belum commit. Belum push.
