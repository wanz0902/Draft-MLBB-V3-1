# Liquipedia Env Loading Debug Report

**Tanggal:** Rabu, 18 Juni 2026, pukul 04:45 WIB

## Root Cause

Two issues found:

### Issue 1: Module-level constant (FIXED in previous iteration)
`liquipediaService.ts` used `const API_KEY = process.env.LIQUIPEDIA_API_KEY || ""` at module level, which was evaluated at import time BEFORE `dotenv.config()` ran. Fixed by changing to lazy getter function `getApiKey()`.

### Issue 2: .env has a key but it's INVALID (user action needed)
The `.env` file exists and `LIQUIPEDIA_API_KEY` has a 128-char value. The server reads it correctly (startup log shows `YES`). But Liquipedia API returns **403: API key is not valid**. This means the key is:
- Expired/revoked
- Wrong format
- From a different wiki/service
- A placeholder that was never replaced with a real key

## Files Changed

| File | Change |
|---|---|
| `server/services/liquipediaService.ts` | Added `trim()` to key reader; added 403-specific error message; added sanitization to strip key fragments from error logs |

## .env Status

- `.env`: EXISTS
- `LIQUIPEDIA_API_KEY`: HAS VALUE (128 chars, no whitespace issues)
- `LIQUIPEDIA_BASE_URL`: present
- `LIQUIPEDIA_WIKI`: present
- `.env` is in `.gitignore` — not tracked by git

## Test Results

| Test | Result |
|---|---|
| Startup log | `[Liquipedia] API key configured: YES` |
| `GET /api/liquipedia/players?limit=3` | 500 — Liquipedia returned 403 (key invalid) |
| `GET /api/liquipedia/teams?limit=2` | 500 — Liquipedia returned 403 (key invalid) |

## Validation

- `npm run lint`: **PASS**
- `npm run build`: **PASS** (14.24s)

## Git Safety

- `.env` not tracked, not staged, not in git index
- `.env.example` has placeholders only
- No secrets in changed files
- Error logs now sanitized (key fragments stripped)

## Security Fix

Added error sanitization: Liquipedia error responses that contain API key fragments are now stripped before logging. 403 errors now show a clear message: "API key is likely invalid, revoked, or expired."

## Next Action Needed

**User harus generate API key baru dari https://liquipedia.net/api/**, lalu update `LIQUIPEDIA_API_KEY` di file `.env`:

```
LIQUIPEDIA_API_KEY=KEY_BARU_TANPA_PREFIX_APIKEY
```

Key harus raw token, bukan format `Apikey XXX` (prefix `Apikey` ditambah otomatis oleh code).

Setelah update, bilang "sudah" supaya saya restart server dan test lagi.
