# Player Photo Asset Pipeline Report

**Tanggal:** Rabu, 18 Juni 2026, pukul 18:05 WIB

## Files Changed

| File | Status |
|---|---|
| `src/data/playerPhotoOverrides.ts` | Updated — rich config type (src, scale, offsetX, offsetY, objectPosition, credit) |
| `data/player-photo-sources.json` | **NEW** — empty manifest for approved photo URLs |
| `scripts/sync-player-photos.ts` | **NEW** — download approved photos from manifest |
| `scripts/report-player-photo-coverage.ts` | **NEW** — compare snapshot players with photo overrides |
| `package.json` | Added `sync:player-photos` and `report:player-photos` scripts |
| `src/components/LiquipediaDatabase.tsx` | PlayerPreviewCard uses rich photo config |

## Folder Structure

```
public/player-photos/           ← Photo files live here
  butss.png                     ← Existing test photo

src/data/playerPhotoOverrides.ts ← Photo config map (scale, offset, position)

data/player-photo-sources.json   ← Approved download URLs manifest

scripts/sync-player-photos.ts    ← Download script
scripts/report-player-photo-coverage.ts ← Coverage report script
```

## How to Add One Player Photo Manually

1. Add image file: `public/player-photos/<nickname>.png`
2. Add entry in `src/data/playerPhotoOverrides.ts`:
   ```ts
   "Nickname": {
     src: "/player-photos/nickname.png",
     scale: 1.3,
     offsetY: 12,
     objectPosition: "center bottom",
   },
   ```
3. Run `npm run report:player-photos` to update coverage

## How to Add Approved Photo Sources

1. Edit `data/player-photo-sources.json`:
   ```json
   [
     { "nickname": "Player", "url": "https://approved-url/image.png", "filename": "player.png" }
   ]
   ```
2. Run `npm run sync:player-photos`
3. Only approved URLs — no scraping

## Commands

| Command | Description |
|---|---|
| `npm run sync:player-photos` | Download approved photos from manifest |
| `npm run report:player-photos` | Generate coverage report |

## Validation

- `npm run lint`: **PASS**
- `npm run build`: **PASS** (22.47s)
- `npm run report:player-photos`: **PASS** (599 total, 303 pro, 1 photo)

## Commit Status

Belum commit. Belum push.
