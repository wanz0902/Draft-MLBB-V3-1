# Pro Database Player Preview Card Visual Redesign Report

**Tanggal:** Rabu, 18 Juni 2026, pukul 17:25 WIB

## Files Changed

| File | Change |
|---|---|
| `src/components/LiquipediaDatabase.tsx` | PlayerPreviewCard redesigned: large visual area, premium layout |
| `src/data/playerPhotoOverrides.ts` | **NEW** — Local photo override map (empty by default) |

## What Changed in Preview Cards

### Before (compact contact list)
- 64×64 initials avatar box
- Horizontal layout: avatar | name + badges | chevron
- Small text, low visual impact

### After (premium esports ID card)
- **Visual area:** h-36/h-40 with gradient backdrop + photo/initials
- **Photo support:** `getPlayerPhoto()` checks override map → shows large photo if available
- **Initials fallback:** Large 5xl/6xl text with role accent color, semi-transparent
- **Gradient background:** Role-colored gradient from top
- **Category badge:** Top-right with backdrop blur
- **Status badge:** Top-left with backdrop blur
- **Nickname:** Larger (text-base/lg), bold, display font
- **Real name:** Subtitle below nickname
- **Role badge:** Larger (text-[9px]), role-colored
- **Country + region:** Globe icon + clean text
- **Team ref:** Team logo if matched, Shield icon fallback
- **Signature heroes:** Max 4 chips + "+N" overflow indicator
- **View Profile hint:** Eye icon + "View Profile" text, appears on hover
- **Hover state:** Border lightens, shadow, slight lift (-translate-y-0.5)
- **Accent line:** Role-colored line separator above info area

### Photo/Fallback Behavior
- `getPlayerPhoto(nickname)` checks `PLAYER_PHOTO_OVERRIDES` map
- If photo exists: shows large `object-contain` image with drop shadow
- If no photo: shows large semi-transparent initials + accent line
- No broken images ever shown (onError handler hides failed images)

### Photo Override Mapping
- File: `src/data/playerPhotoOverrides.ts`
- Format: `{ "Butss": "/player-photos/butss.png" }`
- Currently empty — ready for future image additions
- Add images to `public/player-photos/` when available

## What Was NOT Changed

- Player detail drawer (unchanged)
- Team preview card (unchanged)
- Team detail drawer (unchanged)
- Filter defaults (All Countries, All Regions, etc.)
- Public tabs (Pro Players, Team Staff, Broadcast Talent, Teams)
- Needs Review not shown publicly
- Snapshot counts preserved
- Search, Load More, source attribution

## Validation

- `npm run lint`: **PASS**
- `npm run build`: **PASS** (12.89s)

## Git Safety

- `.env` not tracked
- No secrets in changed files
- No live API calls
- No commit/push

## Commit Status

Belum commit. Belum push.
