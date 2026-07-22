# Laporan Task — Enhance HeroIntelTeaser

## A. Ringkasan Task
Enhance komponen `HeroIntelTeaser.tsx` dengan skill videos, hero images, counter/synergy portraits, dan proper CTA yang mengarah ke halaman Zhuxin.

## B. Perubahan yang dilakukan
1. **Hero portrait → Video showcase**: Mengganti static image (85px stretched) dengan looping video background (`video-0-0.mp4`) + gradient overlay. Text diubah ke warna terang (white) agar readable di atas video.
2. **Skill icons & videos**: Array SKILLS diupdate dengan `icon` dan `video` path. Tab buttons sekarang menampilkan icon 4x4. Skill description area sekarang menampilkan video preview di atas deskripsi.
3. **Counter portraits**: COUNTERS array ditambah `slug`. Setiap counter card menampilkan hero portrait 7x7 menggunakan `resolveHeroPortrait()`.
4. **Synergy portraits**: SYNERGIES array ditambah `slug`. Setiap synergy card menampilkan hero portrait 8x8 menggunakan `resolveHeroPortrait()`.
5. **CTA button**: `enterApp("intelligence")` diubah ke `enterApp("intelligence", "Zhuxin")` agar navigasi langsung ke halaman hero Zhuxin.

## C. File yang diubah
- `src/landing/components/HeroIntelTeaser.tsx` — full rewrite

## D. Verifikasi data/source yang relevan
- Skill videos: `/videos/heroes/zhuxin/video-{0-3}-0.mp4` (4 video)
- Skill icons: `/raw-assets/skill_icons/zhuxin/{crimson_butterflies,fluttering_grace,lantern_flare,crimson_beacon}.png`
- Hero portraits via `resolveHeroPortrait(slug, heroAssets)` untuk: zhuxin, hayabusa, lancelot, fanny, atlas, tigreal
- Tidak berubah / tidak disentuh: hero data files, API endpoints, asset files

## E. Perubahan UI
- Hero card: video background menggantikan static image, gradient overlay gelap, text white
- Skill tabs: icon 4x4 di sebelah nama skill
- Skill area: video preview (h-40) + icon 6x6 di description card
- Counter cards: hero portrait 7x7 di kiri
- Synergy cards: hero portrait 8x8 di kiri
- CTA: navigasi ke Zhuxin hero page

## F. Validasi teknis
- `typecheck` (tsc --noEmit): ✅ PASS (no errors)
- `build` (npm run build): ✅ PASS (14.39s)

## G. Localhost status
- Tidak diverifikasi (tidak ada dev server running)

## H. Commit hash + commit message
- Belum commit

## I. Best-effort resource summary
- Model: mimo-v2.5-pro
- Task: enhance HeroIntelTeaser component
- Perubahan: 1 file, ~119 → ~126 lines

## J. Catatan
- Semua video dan icon path diasumsikan tersedia di public folder
- `enterApp` function signature diasumsikan sudah mendukung parameter kedua `heroName?: string`
- Tidak ada comments yang ditambahkan sesuai instruksi
