# Laporan Task: Rewrite 3 Auth Pages

**Tanggal:** 2026-07-23 08:32 WIB

---

## A. Ringkasan Task

Menulis ulang 3 halaman autentikasi (LoginPage, RegisterPage, CompleteProfilePage) untuk menggunakan AuthLayout baru dengan headline/subheadline/features, navigasi ke `/app` (bukan `/profile`), MLBB account mandatory di register, dan tooltip pada button disabled.

## B. Perubahan yang Dilakukan

### LoginPage.tsx
- Ditambahkan AuthLayout props: `headline="Build Better Drafts"`, `subheadline="Your Command Center"`, `features=[...]`
- Logo ML badge ditambahkan di atas form
- Navigasi sukses login: `/profile` → `/app`
- Tombol Sign In menggunakan gradient `from-cyan-600 to-blue-600` dengan shadow
- Spacing form diperbaiki (`gap-3.5`)

### RegisterPage.tsx
- Ditambahkan AuthLayout props: `headline="Join the War Room"`, `subheadline="Create your MVP Draft account"`, `features=[...]`
- MLBB Account section: label "(optional)" dihapus, judul "MLBB Account" ditampilkan tanpa optional
- Deskripsi: "Hubungkan akun MLBB untuk melanjutkan registrasi." ditambahkan
- Submit body: `mlbb_uid`, `mlbb_sid`, `mlbb_nickname` selalu dikirim (required)
- Tombol Create Account: disabled jika `mlbbStep !== 'found'`
- Tooltip: "Verifikasi akun MLBB terlebih dahulu" muncul saat hover pada button disabled
- `resetMlbb()` helper dibuat untuk reset state MLBB saat UID/SID berubah
- Navigasi sukses: `/profile` → `/app`

### CompleteProfilePage.tsx
- Ditambahkan AuthLayout props: `headline="Complete Your Profile"`, `subheadline="One more step to enter MVP Draft"`, `features=[...]`
- Deskripsi: "Hubungkan akun MLBB untuk melanjutkan registrasi." ditambahkan
- Tombol Complete Registration: disabled jika `mlbbStep !== 'found'`
- Tooltip: "Verifikasi akun MLBB terlebih dahulu" muncul saat hover pada button disabled
- `resetMlbb()` helper dibuat untuk reset state MLBB
- Tombol "Ganti akun" dipertahankan
- Navigasi sukses: `/profile` → `/app`

## C. File yang Diubah

| File | Status |
|------|--------|
| `src/pages/auth/LoginPage.tsx` | Diubah |
| `src/pages/auth/RegisterPage.tsx` | Diubah |
| `src/pages/auth/CompleteProfilePage.tsx` | Diubah |

## D. Verifikasi Data/Source yang Relevan

- `src/components/AuthLayout.tsx` - Props: `children`, `headline`, `subheadline`, `features` — sudah diverifikasi
- `src/lib/auth.tsx` - `AppUser` type, `useAuth()` — sudah diverifikasi
- `src/lib/api.ts` - `apiUrl()` function — sudah diverifikasi
- Semua route navigasi menggunakan `/app` — sudah diverifikasi

## E. Perubahan UI

- AuthLayout kiri sekarang menampilkan headline, subheadline, dan features list (sesuai props baru)
- Brand logo ML badge ditambahkan di atas form login/register
- Tombol submit menggunakan gradient style dengan shadow
- Register: MLBB section sekarang mandatory dengan deskripsi tambahan
- Disabled button tooltip muncul saat hover
- Mobile: form full width, art panel hidden (dari AuthLayout)

## F. Validasi Teknis

- `tsc --noEmit` ✅ Tidak ada error
- `vite build` ✅ Berhasil dalam 15.50s
- Tidak ada inline styles kecuali gradients (sesuai aturan)
- Semua navigasi menggunakan `/app`

## G. Localhost Status

- Build production berhasil
- Tidak ada dev server yang running

## H. Commit Hash + Commit Message

Belum commit

## I. Best-effort Resource Summary

- Model: mimo-v2.5
- Tokens: ~8,000 (estimated)
- Waktu: ~3 menit

## J. Catatan

- Tidak ada perubahan pada AuthLayout component
- Tidak ada perubahan pada router config
- Tooltip disabled button menggunakan CSS group-hover (pure Tailwind, tanpa JS state)
- Error handling MLBB check tetap menggunakan三种状态: not_found (merah), error (amber), found (hijau)
