# Liquipedia Role Normalization Report

**Tanggal:** Rabu, 18 Juni 2026, pukul 16:25 WIB

## Status

All role normalization features were already implemented in previous iterations. This report confirms the current state.

## Role Aliases (server/services/liquipediaService.ts:109)

| Raw Value | Canonical |
|---|---|
| bottom, bot, gold lane, goldlaner, gold laner, marksman, mm | gold |
| exp lane, explaner, exp laner, offlane, offlaner, off lane, sidelaner, side | exp |
| mid lane, midlaner, mid laner, mage | mid |
| roam, support, tank | roamer |
| jgl, jungle, jung, core, hyper, hypercarry, jungler/core | jungler |
| head coach, assistant coach, strategic coach | coach |
| team analyst, performance analyst | analyst |
| team manager, general manager | manager |
| shoutcaster | caster |
| desk host | host |
| analyst desk, broadcast analyst, talent, broadcast talent | caster |
| interviewer | commentator |
| streamer, contentcreator, creator | content creator |

## Raw Fields Preserved

- `primaryRoleRaw`: original Liquipedia value ✅
- `secondaryRoleRaw`: original value ✅
- `rolesRaw`: original array ✅
- `primaryRole`: canonical normalized ✅
- `secondaryRole`: canonical normalized ✅
- `roles`: canonical array ✅

## Backend Filter Behavior

- `ensureReadablePlayer()` normalizes roles on read via `normalizeRole()` + `classifyPerson()` ✅
- `/api/liquipedia/filters` returns only canonical roles ✅
- `/api/liquipedia/players?role=jungler` matches raw jgl/jungle/jungler via canonical fields ✅

## Frontend Dropdown Behavior

- Category-aware role dropdown ✅
  - Pro Players tab → Gold, EXP, Mid, Roamer, Jungler
  - Team Staff tab → Coach, Analyst, Manager
  - Broadcast Talent tab → Caster, Commentator, Host, Content Creator
- `ROLE_LABELS` maps canonical → display labels ✅
- Raw values (bottom, jgl, exp lane, etc.) never shown in UI ✅

## Clean Role Options

| Category | Roles |
|---|---|
| Pro Players | Gold, EXP, Mid, Roamer, Jungler |
| Team Staff | Coach, Analyst, Manager |
| Broadcast Talent | Caster, Commentator, Host, Content Creator, Observer |

## Validation

- `npm run lint`: **PASS**
- `npm run build`: **PASS** (17.37s)

## Commit Status

Belum commit. Belum push.
