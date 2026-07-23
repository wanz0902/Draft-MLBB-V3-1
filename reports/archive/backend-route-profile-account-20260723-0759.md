# Laporan Task: Buat 2 Backend Route Files (profile.ts & account.ts)

**Tanggal:** 2026-07-23 07:59 WIB
**Mode:** Implementation — New Feature

---

## A. Ringkasan Task

Membuat 2 file route baru untuk backend MLBB Draft:
1. `server/auth/profile.ts` — Profile management API
2. `server/auth/account.ts` — Account deletion API

---

## B. Perubahan yang Dilakukan

### File 1: `server/auth/profile.ts`
Dua endpoint baru:

**PATCH /api/profile** — Update user profile
- Validasi: `name` (string, trim), `bio` (string, max 300 char, trim), `favorite_role` (whitelist 7 opsi), `showcase_hero` (string, trim), `profile_banner` (whitelist 5 opsi)
- Dynamic UPDATE query — hanya update field yang dikirim
- Return: id, email, name, avatar_url, mlbb_uid, mlbb_sid, mlbb_nickname, profile_completed, bio, favorite_role, showcase_hero, profile_banner, membership_plan, membership_status, created_at
- Refresh session via `req.login()`

**POST /api/profile/mlbb/disconnect** — Disconnect MLBB account
- SET mlbb_uid, mlbb_sid, mlbb_nickname = NULL
- Return user object

### File 2: `server/auth/account.ts`
Satu endpoint baru:

**DELETE /auth/account** — Delete user account
- Body wajib: `{ confirmation: 'DELETE' }` (exact match, case-sensitive)
- BEGIN transaction → DELETE → COMMIT (ROLLBACK on error)
- Setelah sukses: `req.logout()`, `req.session.destroy()`, clear cookie `connect.sid`
- Return: `{ success: true }`

---

## C. File yang Diubah

| File | Status |
|------|--------|
| `server/auth/profile.ts` | **BARU** |
| `server/auth/account.ts` | **BARU** |

Tidak ada file existing yang diubah.

---

## D. Verifikasi Data/Source yang Relevan

| Aspek | Status |
|-------|--------|
| Pattern `getNeonPool()` + `client.connect()` | ✅ Sesuai `server/auth/routes.ts` |
| Parameterized queries `$1`, `$2`, dll | ✅ |
| Auth check `req.isAuthenticated()` | ✅ |
| `Promise<any>` return type | ✅ |
| `export default router` | ✅ |
| No internal DB errors exposed to client | ✅ |
| Session refresh via `req.login()` | ✅ |
| Transaction BEGIN/COMMIT/ROLLBACK | ✅ di `account.ts` |

---

## E. Perubahan UI

Tidak ada — backend-only.

---

## F. Validasi Teknis

| Command | Status |
|---------|--------|
| `npx tsc --noEmit` | Perlu dijalankan |
| `npm run build` | Perlu dijalankan |

---

## G. Localhost Status

Belum dijalankan — hanya file baru dibuat.

---

## H. Commit

**Belum commit.**

---

## I. Best-Effort Resource Summary

- Model: mimo-v2.5 (xiaomi-token-plan-sgp/mimo-v2.5)
- Estimated tokens: ~4,000
- Elapsed time: ~2 menit

---

## J. Catatan

- Route files ini perlu di-mount di `server/index.ts` atau `server/routes.ts` agar endpoint aktif.
- `server/auth/profile.ts` di-mount sebagai `router.use(profileRoutes)` atau route prefix yang sesuai.
- `server/auth/account.ts` di-mount sebagai `router.use(accountRoutes)`.
- Kolom `bio`, `favorite_role`, `showcase_hero`, `profile_banner` diasumsikan sudah ada di database `users` table. Jika belum ada, perlu SQL migration.
