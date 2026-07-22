# Player Preview Card Photo Layout Fix Report

**Tanggal:** Rabu, 18 Juni 2026, pukul 17:55 WIB

## Files Changed

| File | Change |
|---|---|
| `src/components/LiquipediaDatabase.tsx` | PlayerPreviewCard photo layout: larger, dominant, bottom-anchored |

## What Changed

### Photo Layout Fix
| Aspect | Before | After |
|---|---|---|
| Visual area height | h-36/h-40 | h-48/h-56 |
| Photo positioning | `inset-0 flex center` (centered, small) | `absolute bottom-0 left-1/2 -translate-x-1/2 max-w-[92%] max-h-[95%]` (dominant, bottom-anchored) |
| Photo sizing | `h-full w-full object-contain` (constrained to container) | `max-w-[92%] max-h-[95%] object-contain` (fills visual space) |
| Empty space | Large dead space left/right | Reduced — photo fills 92% width |
| Drop shadow | Generic `drop-shadow-2xl` | Role-colored: `drop-shadow(0 4px 20px ${accent}30)` |
| Radial glow | None | `w-48 h-48 rounded-full opacity-[0.08] blur-2xl` behind player |
| Bottom vignette | `h-16 gradient` | `h-20 gradient from-[#0d1225] via-80 to-transparent` |

### Fallback Initials (no photo)
| Aspect | Before | After |
|---|---|---|
| Initials size | `text-5xl sm:text-6xl` | `text-7xl sm:text-8xl` |
| Initials opacity | `opacity-20` | `opacity-[0.12]` |
| Accent line | `h-1 w-12 opacity-20` | `h-0.5 w-16 opacity-[0.12]` |
| Visual weight | Small, barely visible | Large, intentional design element |

### Preserved
- Card width: 3-column grid unchanged
- Info section: nickname, real name, role, country, team, heroes, View Profile
- Click behavior: opens existing detail drawer
- All filters, tabs, search, counts unchanged

## Butss Photo Test

With `public/player-photos/butss.png` mapped in `playerPhotoOverrides.ts`:
- Photo appears large, bottom-anchored in visual area
- Fills ~92% width, ~95% height
- Role-colored drop shadow
- No cropping of face (object-contain)
- No overflow outside card (overflow-hidden on container)
- Info section below remains clean

## Validation

- `npm run lint`: **PASS**
- `npm run build`: **PASS** (14.81s)

## Not Changed

- Detail drawer (untouched)
- Team preview card (untouched)
- Sync/API/local snapshot logic
- Public tabs, filters, search, counts
- No live API calls
- No commit/push

## Commit Status

Belum commit. Belum push.
