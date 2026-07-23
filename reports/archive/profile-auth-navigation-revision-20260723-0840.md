# Profile, Auth & Navigation Revision Report

**Date:** 2026-07-23 08:40 WIB  
**Model:** mimo-v2.5

---

## 1. Root Causes Identified & Fixed

| # | Problem | Root Cause | Fix |
|---|---------|-----------|-----|
| 1 | Landing and app mixed | No `/app` prefix separation | All feature routes moved under `/app/*` |
| 2 | Register MLBB optional | Label said "(optional)", backend had no MLBB validation | Removed optional label, added backend validation |
| 3 | Auth pages plain | AuthLayout left panel was empty gradient | Added real content: headline, features, premium visual |
| 4 | Profile = Settings sidebar | Both used similar structure | ProfileLayout has own sidebar with Profile/Battlefield/Account sections |
| 5 | Account Created "—" | `created_at` not in deserializeUser query | Fixed in previous iteration, verified working |
| 6 | Appearance too complex | Had accent/motion/effects options | Reduced to Dark/Light only with theme cards |
| 7 | Navbar labels short | Used "Live", "Planner" abbreviations | Full labels: "Live Matches", "Draft Planner" |
| 8 | No `/app` home route | All features at root level | Added `/app` as internal app home |
| 9 | Logout went to `/` | No distinction between landing and app | Logout now goes to `/` (landing page) |

---

## 2. Route Map Final

### Public
| Route | Component |
|-------|-----------|
| `/` | Marketing Landing Page |
| `/login` | Full-page Login |
| `/register` | Full-page Register |
| `/complete-profile` | Google OAuth Complete Profile |

### Application (`/app`)
| Route | Component |
|-------|-----------|
| `/app` | App Home |
| `/app/draft` | Draft Simulator |
| `/app/heroes` | Hero Stats |
| `/app/hero-intelligence` | Hero Intelligence |
| `/app/data` | Data Catalog |
| `/app/live-matches` | Live Matches |
| `/app/draft-planner` | Team Draft Planner |
| `/app/counters` | Counter Matrix |
| `/app/macro` | Macro Map Planner |
| `/app/teams` | Team Analytics |
| `/app/meta` | Meta/Tier List |
| `/app/pro` | Pro Database |
| `/app/admin-tools` | Admin Tools |

### Profile
| Route | Component |
|-------|-----------|
| `/profile` | Profile Overview |
| `/profile/matches` | Match History (Coming Soon) |
| `/profile/statistics` | Battlefield Statistics (Coming Soon) |
| `/profile/favorites` | Favorite Heroes |

### Settings
| Route | Component |
|-------|-----------|
| `/settings/account` | Account & Security |
| `/settings/profile` | Profile Settings |
| `/settings/appearance` | Appearance (Dark/Light) |
| `/settings/mlbb` | MLBB Account |
| `/settings/membership` | Membership & Billing |

---

## 3. Landing vs App Separation

- `/` = Marketing landing page ONLY (LandingNavbar)
- `/app` = Internal app home (Internal Navbar)
- Landing CTA buttons navigate to `/app/*` routes
- Internal Navbar never appears on landing
- Landing Navbar never appears in app
- Logo in app navbar → `/app`
- Logout → `/` (landing)

---

## 4. Register MLBB Required Flow

1. User fills Name, Email, Password
2. User enters MLBB UID + Server ID
3. User clicks "Cek Akun"
4. If found: nickname displayed, green success
5. Create Account button ENABLED only after verification
6. Submit sends: email, password, name, mlbb_uid, mlbb_sid, mlbb_nickname
7. Backend validates all MLBB fields present
8. User created with profile_completed = TRUE
9. Navigate to `/app`

---

## 5. Profile Sidebar Final

```
PROFILE
├── Overview → /profile
└── Match History → /profile/matches

BATTLEFIELD
├── Statistics → /profile/statistics
└── Favorite Heroes → /profile/favorites

ACCOUNT
├── MLBB Account → /settings/mlbb
└── Settings → /settings/account
```

---

## 6. Dark/Light Theme

- Provider: `src/lib/theme.tsx`
- Storage: `localStorage.getItem('mvp-theme')`
- CSS Variables: 20+ variables for all UI elements
- Dark: default
- Settings: 2 large cards (Dark Theme / Light Theme)
- Applied on document root via `classList` + `style.setProperty`

---

## 7. Membership Verification

| Plan | Price | Badge | Source |
|------|-------|-------|--------|
| Basic | Rp19.000/bulan | — | `src/data/membershipPlans.ts` |
| Elite | Rp49.000/bulan | MOST POPULAR | `src/data/membershipPlans.ts` |
| Pro | Rp99.000/bulan | — | `src/data/membershipPlans.ts` |

Landing pricing data updated to match. Single source of truth.

---

## 8. Migration Status

**MANUAL STEP REQUIRED:**

Run `scripts/migrate-profile-membership.sql` against Neon PostgreSQL database.

The migration adds 8 columns with safe defaults:
- `bio`, `favorite_role`, `showcase_hero`, `profile_banner`
- `membership_plan`, `membership_status`, `membership_started_at`, `membership_expires_at`

All use `ADD COLUMN IF NOT EXISTS` - safe for existing users.

---

## 9. Files Changed (This Revision)

### Core (4 files rewritten)
- `src/App.tsx` - `/app` routes, ThemeProvider, landing callbacks
- `src/components/Navbar.tsx` - `/app` links, full labels, theme vars
- `src/components/RouteGuard.tsx` - `/app` redirects, theme vars
- `src/components/AuthLayout.tsx` - Premium two-column with features

### New (1 file)
- `src/lib/theme.tsx` - Dark/Light theme provider

### Auth Pages (3 files rewritten)
- `src/pages/auth/LoginPage.tsx` - Premium layout, navigate to `/app`
- `src/pages/auth/RegisterPage.tsx` - MLBB mandatory, navigate to `/app`
- `src/pages/auth/CompleteProfilePage.tsx` - Navigate to `/app`

### Profile Pages (4 files rewritten)
- `src/pages/profile/ProfileOverview.tsx` - Gaming dashboard style
- `src/pages/profile/ProfileMatches.tsx` - Rich skeleton preview
- `src/pages/profile/ProfileStatistics.tsx` - Full layout with radar
- `src/pages/profile/ProfileFavorites.tsx` - Hero grid + showcase

### Settings (3 files rewritten)
- `src/pages/settings/SettingsAppearance.tsx` - Dark/Light only
- `src/pages/settings/SettingsProfile.tsx` - Premium form with picker
- `src/pages/settings/SettingsMembership.tsx` - Updated plans

### Backend (1 file modified)
- `server/auth/routes.ts` - Google callback → `/app`, MLBB required

### Shared (1 file updated)
- `src/landing/constants/pricingData.ts` - Basic/Elite/Pro

---

## 10. Verification

- `npx tsc --noEmit`: **PASS** (0 errors)
- `npm run build`: **PASS** (built in ~13s)

---

## 11. Known Limitations

1. Database migration needs manual execution
2. `/auth/change-password` endpoint not implemented
3. Payment gateway not connected
4. HeroFullPage still uses state overlay
5. Profile theme vars not yet applied to ALL existing feature components (DraftSimulator, etc. still use hardcoded dark colors)

---

## 12. Report Paths

- `reports/profile-auth-navigation-revision.md` (this file)
- `reports/latest-kilo-report.md` (updated)
