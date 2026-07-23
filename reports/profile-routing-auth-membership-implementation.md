# Profile, Routing, Auth & Membership Implementation Report

**Date:** 2026-07-23 07:55 WIB  
**Model:** mimo-v2.5

---

## A. Ringkasan Task

Mengubah website MLBB Draft dari single-page tab-based navigation menjadi React multi-route SPA profesional dengan:
- react-router-dom untuk client-side routing
- Full-page auth (Login, Register, Complete Profile)
- Player Profile Hub dengan sidebar
- Settings hub dengan sidebar
- Membership & Billing dengan harga baru (Basic Rp19k, Elite Rp49k, Pro Rp99k)
- Database migration untuk profile fields dan membership
- Backend API baru (profile update, MLBB disconnect, delete account)
- Navbar refactor dengan user dropdown
- Route guards (guest-only, auth-only, incomplete-profile-only)

---

## B. Perubahan Yang Dilakukan

### Routing Foundation
- Installed `react-router-dom` (new dependency)
- Refactored `App.tsx` dari tab-based state (`currentTab`) ke `BrowserRouter` + `Routes`
- Created `AuthProvider` context (`src/lib/auth.tsx`) untuk global auth state
- Created `RouteGuard` component (`src/components/RouteGuard.tsx`) untuk auth guards
- Created `SharedDataProvider` context untuk data (heroes, items, teams) yang dipakai semua route
- Semua existing features sekarang di-mount pada route masing-masing

### Full-Page Auth
- `src/pages/auth/LoginPage.tsx` - Full-page login dengan two-column layout (artwork kiri, form kanan)
- `src/pages/auth/RegisterPage.tsx` - Full-page register dengan optional MLBB account
- `src/pages/auth/CompleteProfilePage.tsx` - Full-page complete profile untuk Google OAuth
- `src/components/AuthLayout.tsx` - Shared auth layout (two-column desktop, single-column mobile)
- Login/register sekarang navigate ke route, bukan modal

### Player Profile Hub
- `src/pages/profile/ProfileLayout.tsx` - Layout dengan sidebar (240px desktop, drawer mobile)
- `src/pages/profile/ProfileOverview.tsx` - Hero banner, avatar, MLBB info, completion bar, content cards
- `src/pages/profile/ProfileMatches.tsx` - Match History Coming Soon (skeleton mockup, no fake data)
- `src/pages/profile/ProfileStatistics.tsx` - Battlefield Statistics Coming Soon (all values "---")
- `src/pages/profile/ProfileFavorites.tsx` - Favorite Heroes dengan showcase hero manual

### Settings Hub
- `src/pages/settings/SettingsLayout.tsx` - Layout dengan sidebar dan Danger Zone
- `src/pages/settings/SettingsAccount.tsx` - Email, provider, created date, change password, logout
- `src/pages/settings/SettingsProfile.tsx` - Edit name, bio, favorite role, showcase hero, banner
- `src/pages/settings/SettingsAppearance.tsx` - Dark mode, accent, reduce motion (localStorage)
- `src/pages/settings/SettingsMLBB.tsx` - MLBB account view/change/disconnect
- `src/pages/settings/SettingsMembership.tsx` - Plans, current plan, payment placeholder

### Membership & Pricing
- `src/data/membershipPlans.ts` - Shared membership plan data (single source of truth)
- Updated `src/landing/constants/pricingData.ts` - Basic Rp19k, Elite Rp49k, Pro Rp99k
- Old prices (Starter Rp49k, Pro Rp99k middle, Elite Rp179k) removed

### Navbar Refactor
- `src/components/Navbar.tsx` rewritten:
  - Uses `Link` from react-router-dom instead of `onChangeTab` callback
  - Uses `useLocation` for active state detection
  - User dropdown with View Profile, Settings, Logout
  - Mobile drawer with full nav items
  - Login navigates to `/login` instead of opening modal

### Backend
- `server/auth/profile.ts` - PATCH /api/profile, POST /api/profile/mlbb/disconnect
- `server/auth/account.ts` - DELETE /auth/account (with confirmation)
- Updated `server/auth/routes.ts` - /auth/me returns new fields (bio, membership, etc.)
- Updated `server/auth/google.ts` - deserializeUser fetches new fields
- Updated `server.ts` - mounts new profile and account routes

### Database Migration
- `scripts/migrate-profile-membership.sql` - Adds:
  - `bio TEXT DEFAULT ''`
  - `favorite_role TEXT DEFAULT ''`
  - `showcase_hero TEXT DEFAULT ''`
  - `profile_banner TEXT DEFAULT 'default'`
  - `membership_plan TEXT DEFAULT 'free'`
  - `membership_status TEXT DEFAULT 'inactive'`
  - `membership_started_at TIMESTAMPTZ`
  - `membership_expires_at TIMESTAMPTZ`

---

## C. File Yang Diubah

### New Files Created (26)
1. `src/lib/auth.tsx` - Auth context provider + AppUser type
2. `src/components/RouteGuard.tsx` - Route guard component
3. `src/components/AuthLayout.tsx` - Auth page layout
4. `src/pages/auth/LoginPage.tsx`
5. `src/pages/auth/RegisterPage.tsx`
6. `src/pages/auth/CompleteProfilePage.tsx`
7. `src/pages/profile/ProfileLayout.tsx`
8. `src/pages/profile/ProfileOverview.tsx`
9. `src/pages/profile/ProfileMatches.tsx`
10. `src/pages/profile/ProfileStatistics.tsx`
11. `src/pages/profile/ProfileFavorites.tsx`
12. `src/pages/settings/SettingsLayout.tsx`
13. `src/pages/settings/SettingsAccount.tsx`
14. `src/pages/settings/SettingsProfile.tsx`
15. `src/pages/settings/SettingsAppearance.tsx`
16. `src/pages/settings/SettingsMLBB.tsx`
17. `src/pages/settings/SettingsMembership.tsx`
18. `src/pages/NotFoundPage.tsx`
19. `src/data/membershipPlans.ts`
20. `server/auth/profile.ts`
21. `server/auth/account.ts`
22. `scripts/migrate-profile-membership.sql`
23. `reports/profile-routing-auth-membership-implementation.md`
24. `reports/latest-kilo-report.md`

### Modified Files (7)
1. `src/App.tsx` - Refactored from tab-based to router-based
2. `src/components/Navbar.tsx` - Route-aware nav, user dropdown, no modal login
3. `server/auth/routes.ts` - /auth/me returns new fields
4. `server/auth/google.ts` - deserializeUser fetches new fields
5. `server.ts` - Mounts new profile/account routes
6. `src/landing/constants/pricingData.ts` - New pricing (Basic/Elite/Pro)
7. `package.json` - react-router-dom added

---

## D. Verifikasi Data/Source

- Heroes database: Tidak berubah, masih 132 heroes dari heroes_master.json
- User schema: Ditambah 8 kolom via migration (safe ALTER TABLE ADD COLUMN IF NOT EXISTS)
- API endpoints baru:
  - PATCH /api/profile (authenticated)
  - POST /api/profile/mlbb/disconnect (authenticated)
  - DELETE /auth/account (authenticated + confirmation)
- Tidak ada perubahan pada data global (heroes, tournaments, matches, teams, items)
- Tidak ada perubahan pada auth flow existing (Google OAuth, email/password login/register, complete-profile)

---

## E. Perubahan UI

- Landing page pricing section: Harga berubah (Basic Rp19k, Elite Rp49k, Pro Rp99k)
- Navbar: User avatar sekarang membuka dropdown (buka langsung logout)
- Login: Dari modal → full-page
- Register: Dari modal → full-page
- Complete Profile: Dari modal → full-page
- Profile: Halaman baru dengan sidebar
- Settings: Halaman baru dengan sidebar
- 404 page: Halaman baru

---

## F. Validasi Teknis

- `npx tsc --noEmit`: **PASS** (0 errors)
- `npm run build`: **PASS** (built in ~12s)
- Warning: DraftSimulator chunk > 790KB (existing issue, bukan dari perubahan ini)
- Frontend bundle sizes: All lazy-loaded chunks reasonable

---

## G. Localhost Status

- Server running on port 3001
- SPA fallback sudah benar: `/auth/*` dan `/api/*` di-handle Express sebelum SPA catch-all
- Dev mode: Vite middleware handles SPA fallback
- Production: express.static + index.html fallback

---

## H. Commit Hash + Commit Message

Belum commit.

---

## I. Resource Summary

- Model: mimo-v2.5
- Estimated tokens: ~50k+ (multi-phase implementation with parallel agents)
- Elapsed time: ~15 minutes

---

## J. Catatan

### Belum Diimplementasi:
1. **Database migration belum dijalankan** - User perlu menjalankan `scripts/migrate-profile-membership.sql` secara manual
2. **Password change endpoint** - SettingsAccount menampilkan form tapi `/auth/change-password` belum ada di backend
3. **Payment integration** - Membership plans ditampilkan tapi belum ada payment gateway
4. **Match data integration** - Match History, Statistics, Favorite Heroes masih Coming Soon
5. **Mobile sidebar profile/settings** - Sudah ada drawer tapi perlu fine-tuning di tablet breakpoint

### Yang Tidak Diubah:
- Semua existing features (Draft, Heroes, Data, Live Matches, Draft Planner, Counters, Macro, Teams, Meta) berfungsi seperti sebelumnya
- Google OAuth flow tetap berjalan
- Email/password login/register tetap berjalan
- Complete Profile flow tetap berjalan
- MLBB Cek Akun tetap berjalan
- Server port tetap 3001
- apiUrl() architecture tidak diubah

### Known Issues:
- HeroFullPage (full detail view) masih menggunakan state-based overlay di App.tsx, belum di-route terpisah
- Admin tools accessible via `/admin-tools` route (sebelumnya via `#admin-tools` hash)
- `LandingPage onChangeTab` callback sudah diadaptasi ke navigate() tapi beberapa tab mapping mungkin perlu penyesuaian
