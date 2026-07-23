# Laporan Task — Community Hub Pages

## A. Ringkasan task
Membuat 5 halaman Community Hub untuk MLBB Draft: layout dengan tab navigation, Global Chat (UI preview), Looking for Scrim, Looking for Team, dan Looking for Player. Semua halaman dalam status "UI Preview / Backend Coming Soon".

## B. Perubahan yang dilakukan
- Membuat `CommunityLayout.tsx` — layout dengan 4 tab NavLink (Global Chat, LFS, LFT, LFP), breadcrumb, dan Outlet untuk child routes
- Membuat `GlobalChat.tsx` — halaman chat dengan placeholder messages (opacity-30, blur-sm), online users sidebar, dan disabled input dengan "Coming Soon" overlay
- Membuat `LookingForScrim.tsx` — form preview (team name, date, time, BO format, tier, region, rank range, room type, contact) + 3 preview cards
- Membuat `LookingForTeam.tsx` — form preview (nickname, main/secondary role, rank, hero pool, region, active hours, contact) + 3 preview cards
- Membuat `LookingForPlayer.tsx` — form preview (team name, needed role, rank requirement, practice schedule, region, trial date, contact) + 3 preview cards

## C. File yang diubah
- `src/pages/community/CommunityLayout.tsx` (BARU)
- `src/pages/community/GlobalChat.tsx` (BARU)
- `src/pages/community/LookingForScrim.tsx` (BARU)
- `src/pages/community/LookingForTeam.tsx` (BARU)
- `src/pages/community/LookingForPlayer.tsx` (BARU)

## D. Verifikasi data/source yang relevan
- Semua import menggunakan path relatif (tidak ada path aliases)
- Menggunakan `motion` dari `framer-motion` dengan pattern `fadeUp` yang konsisten dengan codebase
- Menggunakan ikon dari `lucide-react` (MessageCircle, Send, Users, UserPlus, Swords, Calendar, Clock, Trophy, Globe, Lock, Shield, Star, ArrowLeft)
- Menggunakan CSS variables yang tersedia: `--bg-primary`, `--bg-card`, `--bg-card-hover`, `--text-primary`, `--text-secondary`, `--text-muted`, `--border`, `--accent`, `--accent-bg`
- Mengikuti pola NavLink dari `SettingsLayout.tsx` dengan `className` callback `isActive`
- Semua data placeholder diberi label "UI Preview / Backend Coming Soon" — tidak ada data palsu yang ditampilkan sebagai nyata

## E. Perubahan UI
- Community Hub memiliki tab navigation dengan underline cyan pada tab aktif
- Breadcrumb "App / Community" di bagian atas
- Link "Back to App" → /app
- Semua form dalam status disabled
- Semua cards preview menggunakan opacity-30 dan blur-sm
- Badge amber "UI Preview / Backend Coming Soon" di setiap halaman

## F. Validasi teknis
- `npx tsc --noEmit` — ✅ Tidak ada error
- Semua file menggunakan TypeScript yang bersih

## G. Localhost status
- Routes belum didaftarkan di `App.tsx` — user perlu menambahkan route untuk `/community` dengan `CommunityLayout` sebagai parent

## H. Commit hash + commit message
belum commit

## I. Best-effort resource summary
- Model: mimo-v2.5
- Estimated tokens: ~8,000
- Waktu: ~2 menit

## J. Catatan
- Routes `/community/*` belum terdaftar di `src/App.tsx`. User perlu menambahkan route bundling seperti:
  ```tsx
  <Route path="/community" element={<CommunityLayout />}>
    <Route path="chat" element={<GlobalChat />} />
    <Route path="lfs" element={<LookingForScrim />} />
    <Route path="lft" element={<LookingForTeam />} />
    <Route path="lfp" element={<LookingForPlayer />} />
  </Route>
  ```
- Semua form dan input dalam status disabled — backend belum terimplementasi
- Tidak ada fake data yang ditampilkan sebagai real data
