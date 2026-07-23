# Laporan Task: Fix MLBB Nickname Not Saved to Database

**Tanggal:** 2026-07-23 06:54 WIB
**Mode:** Bug Fix

---

## Root Cause

Dua bug pada flow Google Complete Profile:
1. `CompleteProfile.tsx` tidak mengirim `mlbb_nickname` di request body
2. `server/auth/routes.ts` complete-profile endpoint tidak mendestructure atau UPDATE `mlbb_nickname`

## File yang Diubah

| File | Perubahan |
|------|-----------|
| `src/components/CompleteProfile.tsx` | Tambah `mlbb_nickname` ke request body |
| `server/auth/routes.ts` | Destructure `mlbb_nickname`, tambah ke UPDATE query |

## Query Sebelum vs Sesudah

**Sebelum:**
```sql
UPDATE users SET name=$1, mlbb_uid=$2, mlbb_sid=$3, profile_completed=TRUE WHERE id=$4
```

**Sesudah:**
```sql
UPDATE users SET name=$1, mlbb_uid=$2, mlbb_sid=$3, mlbb_nickname=$4, profile_completed=TRUE WHERE id=$5
```

## Validasi

- `tsc --noEmit`: ✅ 0 errors
- `npm run build`: ✅ 12.33s
- Tidak ada migration baru
- Login email/password tetap berfungsi
- Flow MLBB Link Account (server.ts) sudah benar sebelumnya
