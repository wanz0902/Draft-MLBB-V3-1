# Player Photo Layout Final Report

**Tanggal:** Rabu, 18 Juni 2026, pukul 18:05 WIB

## Files Changed

| File | Change |
|---|---|
| `src/data/playerPhotoOverrides.ts` | Rich config: scale, offsetX, offsetY, objectPosition |
| `src/components/LiquipediaDatabase.tsx` | PlayerPreviewCard uses photo config transforms |

## Butss Photo Test

- Photo: `public/player-photos/butss.png` ✅ exists
- Mapping: `PLAYER_PHOTO_OVERRIDES["Butss"]` ✅ mapped
- Config: `scale: 1.3, offsetY: 12, objectPosition: "center bottom"`
- Visual: photo appears large, bottom-anchored, dominant in card
- No face crop (object-contain)
- No overflow (overflow-hidden on card)
- Role-colored drop shadow

## Photo Layout Changes

| Aspect | Before | After |
|---|---|---|
| Visual area | h-48/h-56 | h-48/h-56 (unchanged) |
| Photo transform | `translateX(-50%)` only | `translateX(-50%) scale(${config.scale})` |
| Photo height | `max-h-[95%]` | `height: 115%` (extends upward) |
| Photo bottom | `bottom-0` | `bottom: ${config.offsetY}px` (configurable) |
| Photo objectPosition | `object-bottom` | `${config.objectPosition}` (configurable) |
| Radial glow | ✅ | ✅ |
| Bottom vignette | ✅ | ✅ |

## Fallback Behavior

- Players without photo: large 7xl/8xl initials, role accent, same card height
- No broken images (onError hides failed images)
- Old string format not used (new object format only)

## Photo Coverage

| Metric | Count |
|---|---|
| Total people | 599 |
| Pro Players | 303 |
| Players with photo | 1 (Butss) |
| Missing photo | 302 pro players |

## What Was NOT Changed

- Detail drawer (untouched)
- Team preview card (untouched)
- Sync/API/local snapshot logic
- Public tabs, filters, search, counts
- No live API calls
- No commit/push

## Validation

- `npm run lint`: **PASS**
- `npm run build`: **PASS** (22.47s)
- `npm run report:player-photos`: **PASS**

## Commit Status

Belum commit. Belum push.
