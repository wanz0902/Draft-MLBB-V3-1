# Laporan Task: Rewrite 3 Settings Pages + Fix Backend Auth

**Tanggal:** 2026-07-23 08:31 WIB

---

## A. Ringkasan Task

Rewrite 3 halaman settings (Appearance, Profile, Membership) menggunakan CSS variables dan useTheme(), serta fix 2 bug backend auth (Google callback redirect dan register MLBB validation).

## B. Perubahan yang Dilakukan

### File 1: SettingsAppearance.tsx — FULL REWRITE
- Menghapus toggle switch, accent color selector, reduce motion, visual effects
- Mengganti dengan 2 large segmented cards (Dark Theme & Light Theme)
- Setiap card menampilkan preview visual (dark bg + white text mockup / light bg + dark text mockup)
- Selected state: cyan ring + checkmark badge
- Menggunakan `useTheme()` dari `../../lib/theme` untuk `setTheme('dark')` / `setTheme('light')`
- Semua styling pakai CSS variables

### File 2: SettingsProfile.tsx — FULL REWRITE
- Preview card di atas: mini banner dengan avatar, display name, bio, favorite role, showcase hero
- Form: display name input, bio textarea (max 300 char + counter)
- Favorite role: chip selector (6 role dengan icon) — bukan native select
- Showcase hero: searchable grid picker dengan search input + hero grid (filtered)
- Profile banner: 5 gradient preview cards — selected = cyan ring
- Save → PATCH /api/profile → refreshUser() + success toast
- Semua styling pakai CSS variables

### File 3: SettingsMembership.tsx — FULL REWRITE
- Current Plan display (plan, status, next billing, payment method)
- 3 plan cards: Basic Rp19k, Elite Rp49k (Most Popular badge), Pro Rp99k
- Setiap card punya icon (Zap/Crown/Star), features dengan status icons
- Current plan highlighted dengan accent color
- Click plan → "Payment integration coming soon" modal
- Semua styling pakai CSS variables

### File 4: server/auth/routes.ts — FIX Google Callback
- Line 31: `return res.redirect(FRONTEND_URL)` → `return res.redirect(`${FRONTEND_URL}/app`)`
- `/complete-profile` redirect tidak diubah

### File 5: server/auth/routes.ts — FIX Register MLBB Validation
- Menambahkan validasi setelah password length check (line 47-49):
- `if (!mlbb_uid || !mlbb_sid || !mlbb_nickname)` → return 400 error
- Memastikan MLBB wajib untuk email registration

## C. File yang Diubah

| File | Aksi |
|------|------|
| `src/pages/settings/SettingsAppearance.tsx` | Rewrite |
| `src/pages/settings/SettingsProfile.tsx` | Rewrite |
| `src/pages/settings/SettingsMembership.tsx` | Rewrite |
| `server/auth/routes.ts` | Fix (2 edit) |

## D. Verifikasi Data/Source yang Relevan

- `heroes_master.json`: digunakan di SettingsProfile untuk hero grid picker, type `Array<{ hero_name: string; role: string[] }>`
- `membershipPlans.ts`: digunakan di SettingsMembership, 3 plans (basic/elite/pro) dengan features
- `auth.tsx` (AppUser type): digunakan untuk `useAuth()` — fields: name, bio, favorite_role, showcase_hero, profile_banner, membership_plan, membership_status
- `theme.tsx` (useTheme): digunakan di SettingsAppearance untuk theme switching
- `api.ts` (apiUrl): digunakan untuk API calls
- `profile.ts` (backend): PATCH /api/profile route sudah mendukung semua fields yang diupdate

## E. Perubahan UI

| Halaman | Perubahan |
|---------|-----------|
| SettingsAppearance | Layout 2 cards side-by-side, preview mockup visual per theme |
| SettingsProfile | Preview card + chip selector + hero grid + banner gradient cards |
| SettingsMembership | Plan cards dengan icons, badges, feature status icons |

## F. Validasi Teknis

- Semua kode TypeScript clean, no `any` type abuse
- Tailwind classes konsisten dengan codebase existing
- CSS variables konsisten (--bg-primary, --text-primary, --border, --accent, dst)
- Tidak ada comments di kode baru

## G. Localhost Status

Tidak dijalankan dalam session ini.

## H. Commit Hash + Commit Message

Belum commit.

## I. Best-Effort Resource Summary

- Model: mimo-v2.5
- Estimated tokens: ~15k input + ~12k output
- Elapsed time: ~2 minutes

## J. Catatan

- SettingsAppearance tidak menyimpan accent color atau reduce motion lagi — hanya dark/light
- SettingsProfile hero grid default menampilkan 20 hero pertama, bisa di-search
- Backend redirect ke `/app` setelah Google login (sebelumnya ke root `/`)
- Register sekarang wajib mengisi MLBB UID, Server ID, dan Nickname
