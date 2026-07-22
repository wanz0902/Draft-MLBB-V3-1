# Liquipedia Data Layer — Phase 1 Report

**Tanggal:** Rabu, 18 Juni 2026, pukul 02:40 WIB

## Summary

Implemented Phase 1 of the Liquipedia Data Layer: Players & Teams proxy endpoints with server-side caching, data normalization, and a frontend "Pro Database" page.

## Files Changed

| File | Status |
|---|---|
| `server/services/liquipediaService.ts` | **NEW** — API client, in-memory cache (6h TTL), player/team normalizers |
| `server.ts` | Added 3 routes: `/api/liquipedia/players`, `/api/liquipedia/teams`, `/api/liquipedia/cache/clear` |
| `src/components/LiquipediaDatabase.tsx` | **NEW** — Frontend page with Players/Teams tabs |
| `src/App.tsx` | Added `pro` tab routing + `LiquipediaDatabase` import |
| `src/components/Navbar.tsx` | Added "Pro Database" to Data group (desktop + mobile) |
| `.env.example` | Added `LIQUIPEDIA_API_KEY`, `LIQUIPEDIA_BASE_URL`, `LIQUIPEDIA_WIKI` |

## New Environment Variables

```
LIQUIPEDIA_API_KEY=replace_with_real_key     # Server-side only
LIQUIPEDIA_BASE_URL=https://api.liquipedia.net/api
LIQUIPEDIA_WIKI=mobilelegends
```

**Important:** `LIQUIPEDIA_API_KEY` must be set in the server environment (Railway env vars or local `.env`). Never expose to frontend.

## Backend Endpoints

### GET /api/liquipedia/players

| Param | Type | Required | Default | Description |
|---|---|---|---|---|
| nationality | string | No | — | Filter by nationality (e.g., `Indonesia`) |
| status | string | No | — | Filter by status (e.g., `Active`) |
| role | string | No | — | Filter by role: `gold`, `exp`, `mid`, `roamer`, `jungler`, `coach`, `analyst`, `caster`, `commentator` |
| category | string | No | — | Filter by category: `players`, `staff`, `talent`, `all` |
| limit | number | No | 20 | Max results (1-100) |
| offset | number | No | 0 | Pagination offset |

**Response:**
```json
{
  "ok": true,
  "players": [
    {
      "id": "Alberttt",
      "nickname": "Alberttt",
      "realName": "Albert Neilsen Iskandar",
      "nationality": "Indonesia",
      "region": "Southeast Asia",
      "status": "Active",
      "teamReference": "ONIC Esports",
      "teamTemplate": "ONIC",
      "primaryRole": "jungler",
      "secondaryRole": null,
      "roles": ["jungler"],
      "roleCategory": "players",
      "signatureHeroes": ["Ling", "Lancelot", "Fanny"],
      "links": [{ "type": "instagram", "url": "https://..." }],
      "sourceName": "Liquipedia",
      "sourceUrl": "https://liquipedia.net/mobilelegends/Alberttt"
    }
  ],
  "total": 1
}
```

### GET /api/liquipedia/teams

| Param | Type | Required | Default | Description |
|---|---|---|---|---|
| status | string | No | — | Filter by status (e.g., `active`) |
| region | string | No | — | Filter by region (e.g., `Southeast Asia`) |
| limit | number | No | 20 | Max results (1-100) |
| offset | number | No | 0 | Pagination offset |

**Response:**
```json
{
  "ok": true,
  "teams": [
    {
      "id": "ONIC_Esports",
      "name": "ONIC Esports",
      "pagename": "ONIC_Esports",
      "region": "Southeast Asia",
      "status": "active",
      "template": "ONIC",
      "logoUrl": "https://liquipedia.net/...",
      "darkLogoUrl": null,
      "textlessLogoUrl": null,
      "links": [{ "type": "website", "url": "https://..." }],
      "sourceName": "Liquipedia",
      "sourceUrl": "https://liquipedia.net/mobilelegends/ONIC_Esports"
    }
  ],
  "total": 1
}
```

### POST /api/liquipedia/cache/clear

Clears the in-memory cache. Returns `{ ok: true, cleared: <number> }`.

## Normalization

### Player Normalizer
- `id` — from `pagename` (stable)
- `nickname` — from `pagename` (display name)
- `realName` — from `name`
- `roleCategory` — `players` (gold/exp/mid/roamer/jungler), `staff` (coach/analyst), `talent` (caster/commentator)
- `signatureHeroes` — built from `extradata.signatureHero1` through `signatureHero5`
- `links` — handles both object and array shapes from Liquipedia

### Team Normalizer
- `logoUrl` — prefers `logourl`, falls back to `logodarkurl`, then `textlesslogourl`
- Prefixes `https://liquipedia.net` to relative logo paths

## Frontend

- **Page:** "Pro Database" accessible via Navbar → Data group
- **Tabs:** Players / People | Teams
- **Player filters:** All, Players, Coaches/Staff, Talent, Gold, EXP, Mid, Roamer, Jungler
- **Search:** Client-side search by name, nationality, team
- **Cards show:** nickname, real name, role badges, nationality, region, status, team reference, signature heroes, social links
- **Attribution:** "Player and team profile data provided by Liquipedia" + per-card source link
- **States:** Loading spinner, error with retry, empty state

## Cache

- In-memory TTL cache, 6 hours
- Cache key = full request URL
- Served from server process memory (resets on restart)
- Manual clear via `POST /api/liquipedia/cache/clear`

## How to Test Locally

1. Add to `.env`:
   ```
   LIQUIPEDIA_API_KEY=your_real_key_here
   ```

2. Start server:
   ```
   npm run dev
   ```

3. Test endpoints:
   ```
   curl "http://localhost:3001/api/liquipedia/players?limit=5"
   curl "http://localhost:3001/api/liquipedia/players?nationality=Indonesia&limit=10"
   curl "http://localhost:3001/api/liquipedia/players?role=jungler&limit=5"
   curl "http://localhost:3001/api/liquipedia/teams?limit=10"
   curl "http://localhost:3001/api/liquipedia/teams?region=Southeast+Asia"
   ```

4. Open frontend: `http://localhost:3001` → Data → Pro Database

## Validation

- `npm run lint`: **PASS**
- `npm run build`: **PASS** (13.89s)

## Known Limitations

- Phase 1 only: Players & Teams. No match/tournament/transfer/squadplayer endpoints yet.
- `status=Active` in Liquipedia includes coaches, casters, analysts — not just players. The normalizer assigns `roleCategory` to distinguish.
- `teampagename` is not guaranteed to be current roster — labeled as "Team Reference" not "Current Team".
- Cache is in-memory only — resets on server restart.
- No automatic pagination — max 100 results per request.
- No Neon database integration — data is fetched live from Liquipedia API.

## API Key Status

- `LIQUIPEDIA_API_KEY` is **required** for the endpoints to work.
- The key must be stored only in server environment (Railway env vars or local `.env`).
- The key is never exposed to frontend, never logged, never committed.
- If the key is missing, the API returns: `{ ok: false, error: "LIQUIPEDIA_API_KEY is not configured on the server." }`

## Not Touched

- Draft War Room / DraftSimulator
- AI recommendation logic
- Hero stats logic
- Match analytics logic
- Paid AI providers (OpenAI/MiMo/Wafer/Fireworks/Portkey)
- Neon database
- R2 storage
- No deployment

## Commit Status

Belum commit. Belum push.
