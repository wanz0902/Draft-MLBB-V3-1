# Pro Player Asset Pipeline Pilot — Report

**Tanggal:** Kamis, 19 Juni 2026, pukul 17:50 WIB

## Summary

Built a local esports asset system for Pro Player detail/profile pages, starting with Butss as pilot player. Created asset mapping from existing local team logos, asset sync script, and updated PlayerDetailDrawer to use local assets.

## Pilot Player

- **Primary:** Sanz — NOT found in local snapshot
- **Fallback:** Butss (ONIC, Indonesia, EXP Laner) — used as pilot
- **Photo:** `public/player-photos/butss.png` ✅ local asset
- **Team logo:** `raw-assets/regular_season_files/74px-ONIC_Esports_2019_allmode.png` ✅ existing local asset

## Existing Local Assets Found

| Asset Type | Path | Count |
|---|---|---|
| Team logos | `public/raw-assets/regular_season_files/` | 9 team logos |
| Player photos | `public/player-photos/` | 1 (butss.png) |
| Skill icons | `public/raw-assets/skill_icons/` | 558 |
| Item icons | `public/raw-assets/aset_item/` | 162 |
| Spell icons | `public/raw-assets/aset_spell/` | 12 |
| Talent icons | `public/raw-assets/aset_talent/` | 26 |

### Team logos available locally:
- ONIC Esports (74px)
- EVOS Esports (52px)
- RRQ (74px)
- Alter Ego (51px)
- Bigetron (56px)
- Geek Fam (43px)
- Dewa United (76px)
- Team Liquid (44px)

## Files Changed

| File | Status |
|---|---|
| `src/data/esportsAssetOverrides.ts` | **NEW** — Team logo + tournament logo mapping |
| `scripts/sync-pro-player-assets.ts` | **NEW** — Approved asset download script |
| `data/pro-player-asset-sources.json` | **NEW** — Empty manifest for approved URLs |
| `src/components/LiquipediaDatabase.tsx` | Updated team logo rendering to use asset overrides |
| `package.json` | Added `sync:pro-player-assets` script |

## How It Works

1. `esportsAssetOverrides.ts` maps team names to local asset paths
2. `getTeamLogoAsset(teamName)` finds the best local logo
3. PlayerDetailDrawer uses `getTeamLogoAsset()` for team reference + watermark + dossier header
4. `TeamLogoImg` component handles onError fallback (initials badge)
5. `sync-pro-player-assets.ts` can download approved assets from manifest

## Player Detail Visual Result

- Team logo (ONIC) appears cleanly in:
  - Left poster panel (watermark)
  - Dossier header
  - Team reference card
- Player photo (Butss) renders local asset via `playerPhotoOverrides.ts`
- No hotlink warnings
- No broken images
- Fallback initials work for teams without logos

## Validation

- `npm run lint`: **PASS**
- `npm run build`: **PASS** (12.17s)

## Git Status

Belum commit. Belum push.

## Next Step

To expand to all Indonesian players:
1. Add photo entries to `src/data/playerPhotoOverrides.ts`
2. Run `npm run sync:pro-player-assets` if any approved URLs in manifest
3. Team logos already mapped for all major Indonesian teams

## Report Path

`reports/pro-player-assets-pilot-report.md`
