# Pro Database Card Preview + Detail View Redesign Report

**Tanggal:** Rabu, 18 Juni 2026, pukul 17:15 WIB

## Files Changed

| File | Change |
|---|---|
| `src/components/LiquipediaDatabase.tsx` | Full rewrite: preview cards + detail drawers + team logo join |

## What Changed

### Preview Cards (compact list view)

**PlayerPreviewCard:**
- 64×64 avatar block with initials + role color accent
- Nickname as primary title (hover → blue highlight)
- Role badge (Gold/EXP/Mid/Roamer/Jungler/Coach/etc.)
- Category badge (Pro Players/Team Staff/Broadcast Talent)
- Status badge (Active/Inactive)
- Country + region line
- Team reference with team logo if matched
- ChevronRight indicator for clickability

**TeamPreviewCard:**
- 56×56 logo block with dark contrast background, object-contain, padding
- Fallback initials if logo missing/fails (onError handler)
- Team name (hover → blue highlight)
- Status badge + region
- ChevronRight indicator

### Detail Drawers (click → full profile)

**PlayerDetailDrawer:**
- Right-side drawer on desktop (full-width on mobile via `max-w-lg`)
- Backdrop with blur, click-outside close, ESC close
- Large 80×80 avatar
- Full name + real name
- Primary + secondary role badges
- Category + status badges
- Country/region with team logo if matched
- Team template info
- Full roles list
- Signature heroes (all, not just 5)
- Social links with icons
- Source attribution

**TeamDetailDrawer:**
- Right-side drawer
- Large 80×80 logo
- Team name + status + region
- Template info
- Logo variants (default/dark/textless) if available
- Social links
- Related players (matched by teamTemplate/teamReference)
- Source attribution

### Team Logo Join Logic

`findTeamForPlayer()` matches player to team via:
1. `player.teamTemplate === team.template`
2. `player.teamReferenceRaw === team.pagename`
3. `player.teamReferenceReadable === team.name`

`getTeamLogo()` prefers logoUrl → darkLogoUrl → textlessLogoUrl.

Teams loaded on page init (`/api/liquipedia/teams?limit=500`) for join matching.

### Filter Defaults (preserved from previous cleanup)

- Country: All Countries
- Region: All Regions
- Role: All Roles
- Status: All Statuses
- Per page: 50
- Default tab: Pro Players

### Public Tabs (preserved)

- Pro Players, Team Staff, Broadcast Talent, Teams
- Needs Review NOT shown publicly

## Validation

- `npm run lint`: **PASS**
- `npm run build`: **PASS** (13.23s)

## Git Safety

- `.env` not tracked
- No secrets in changed files
- No live API calls
- No commit/push

## Commit Status

Belum commit. Belum push.
