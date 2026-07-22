# Indonesia Player Photo Pack Report

**Generated:** 18/6/2026, 18.36.07

## Summary

| Metric | Count |
|---|---|
| Total people in snapshot | 599 |
| Indonesian people | 112 |
| Indonesian Pro Players | 57 |
| Indonesian Staff | 21 |
| Indonesian Broadcast Talent | 4 |
| Indonesian Pro Players with photo | 1 |
| Indonesian Pro Players missing photo | 56 |

## Files

| File | Path |
|---|---|
| Target list | `data/player-photo-indonesia-targets.json` |
| Approved sources | `data/player-photo-sources-indonesia.json` |
| Photo folder | `public/player-photos/` |
| Override map | `src/data/playerPhotoOverrides.ts` |
| This report | `reports/player-photo-indonesia-photo-pack-report.md` |

## Existing Photo Mappings

| Nickname | Role | Team | Photo |
|---|---|---|---|
| Butss | exp | ONIC | ✅ |

## Missing Indonesian Pro Player Photos (first 100 by priority)

| # | Priority | Nickname | Role | Team | Status |
|---|---|---|---|---|---|
| 1 | P1 | Bryann | exp | GEEK | Active |
| 2 | P1 | Fluffy | exp | EVOS | Active |
| 3 | P1 | KennzyySkie | gold | GEEK | Active |
| 4 | P1 | Kyou | gold | TLID | Active |
| 5 | P1 | Lutpiii | exp | ONIC | Active |
| 6 | P1 | Marzyyy | exp | BTR | Active |
| 7 | P1 | Maybeee | gold | DEWA | Active |
| 8 | P1 | Moai | gold | RRQ | Active |
| 9 | P1 | Namira | exp | EVOS | Active |
| 10 | P1 | Nino | exp | AE | Active |
| 11 | P1 | Savero | gold | ONIC | Active |
| 12 | P1 | Shogun | exp | BTR | Active |
| 13 | P1 | Tompu | mid | EVOS | Active |
| 14 | P1 | Toyy | gold | RRQ | Active |
| 15 | P1 | Vanz | jungler | DEWA | Active |
| 16 | P1 | XMagic | mid | NAVI | Active |
| 17 | P1 | Y1PPY | gold | ONIC | Active |
| 18 | P2 | Antimage | exp | EVOS | Inactive |
| 19 | P2 | Branz | gold | EVOS | Inactive |
| 20 | P2 | Clayyy | mid | RRQ | Inactive |
| 21 | P2 | Kabuki | gold | TLID | Inactive |
| 22 | P2 | Lemon | mid | RRQ | Retired |
| 23 | P2 | LJ | roamer | EVOS | Inactive |
| 24 | P2 | Skylar | gold | ONIC | Inactive |
| 25 | P3 | AeronnShikii | gold | AC Esports | Active |
| 26 | P3 | Benji | exp | — | Active |
| 27 | P3 | Bottle | gold | Pabz Esports | Active |
| 28 | P3 | Deee | gold | — | Active |
| 29 | P3 | Faviannn | jungler | AC Esports | Active |
| 30 | P3 | Ferxiic | jungler | — | Active |
| 31 | P3 | Matt | gold | — | Active |
| 32 | P3 | Nathan | roamer | — | Active |
| 33 | P3 | Rinazmi | exp | — | Active |
| 34 | P3 | Vanilla | jungler | Vesakha Esports Fe | Active |
| 35 | P3 | Variety | jungler | — | Active |
| 36 | P3 | Watt | gold | Shadow Esports | Active |
| 37 | P3 | Xorizo | exp | — | Active |
| 38 | P4 | Alberto | exp | — | Active |
| 39 | P4 | Elle | exp | — | Active |
| 40 | P4 | Gentz | exp | Team Liquid Academy ID | Active |
| 41 | P4 | Kaeya | mid | Pabz Esports | Active |
| 42 | P4 | Kenma | gold | — | Active |
| 43 | P4 | Liv | gold | Falcons Vega | Active |
| 44 | P4 | Lzd | mid | — | Active |
| 45 | P4 | Ruii | jungler | Gen.G Esports | Active |
| 46 | P4 | Soyy | jungler | Virtus.pro Fe | Active |
| 47 | P4 | Zhiry | exp | Holy Esports | Active |
| 48 | P5 | Clover | gold | — | Retired |
| 49 | P5 | Ivann | roamer | Team Rey | Inactive |
| 50 | P5 | JerL | mid | — | Retired |
| 51 | P5 | Liam | roamer | — | Retired |
| 52 | P5 | Luminaire | mid | — | Retired |
| 53 | P5 | Pai | exp | — | Retired |
| 54 | P5 | Phoenix | roamer | — | Retired |
| 55 | P5 | Psychoo | mid | — | Retired |
| 56 | P5 | Reiya | exp | — | Retired |

## Priority Legend

| Priority | Description |
|---|---|
| P0 | Already has photo |
| P1 | Popular Indonesian team + Active |
| P2 | Popular Indonesian team |
| P3 | Active + has signature heroes |
| P4 | Active |
| P5 | Other |

## How to Add Photos

1. Add approved image URLs to `data/player-photo-sources-indonesia.json`
2. Run `npm run sync:player-photos:id` to download
3. Add override entries in `src/data/playerPhotoOverrides.ts`
4. Run `npm run report:player-photos:id` to update this report

## Commands

| Command | Description |
|---|---|
| `npm run report:player-photos:id` | Generate Indonesia target list + coverage report |
| `npm run sync:player-photos:id` | Download approved Indonesia photos |
