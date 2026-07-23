# Profile, Auth & Navigation Revision Report

**Date:** 2026-07-23 09:16 WIB  
**Model:** mimo-v2.5

---

## 1. Root Causes Identified & Fixed

| # | Problem | Root Cause | Fix |
|---|---------|-----------|-----|
| 1 | Landing and app mixed | No `/app` prefix separation | All feature routes moved under `/app/*` |
| 2 | Register MLBB optional | Label said "(optional)", backend had no MLBB validation | Removed optional label, added backend validation |
| 3 | Auth pages plain | AuthLayout left panel was empty gradient | Added real content: headline, features, premium visual |
| 4 | Profile = Settings sidebar | Both used similar structure | ProfileLayout has own full sidebar (6 sections) |
| 5 | Account Created "—" | `created_at` not in deserializeUser query | Fixed, verified working |
| 6 | Appearance too complex | Had accent/motion/effects options | Reduced to Dark/Light only |
| 7 | Navbar labels short | Used "Live", "Planner" abbreviations | Full labels restored |
| 8 | No `/app` home route | All features at root level | Added `/app` |
| 9 | Profile sidebar incomplete | Missing Community, Competitive, Services | Full sidebar with all sections |

---

## 2. Route Map Final

### Public (4)
| Route | Component |
|-------|-----------|
| `/` | Marketing Landing Page |
| `/login` | Full-page Login |
| `/register` | Full-page Register |
| `/complete-profile` | Google OAuth Complete Profile |

### Application (14)
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

### Profile Hub (14)
| Route | Component |
|-------|-----------|
| `/profile` | Profile Overview |
| `/profile/matches` | Match History (Coming Soon) |
| `/profile/statistics` | Battlefield Statistics (Coming Soon) |
| `/profile/favorites` | Favorite Heroes |
| `/profile/community/chat` | Global Chat (Coming Soon) |
| `/profile/community/scrim` | Looking for Scrim (Coming Soon) |
| `/profile/community/team` | Looking for Team (Coming Soon) |
| `/profile/community/player` | Looking for Player (Coming Soon) |
| `/profile/competitive/squad` | My Squad (Coming Soon) |
| `/profile/competitive/tournament` | Community Tournament (Coming Soon) |
| `/profile/competitive/history` | Tournament History (Coming Soon) |
| `/profile/services/scrim` | Scrim Services (Coming Soon) |
| `/profile/services/room` | Room Tournament (Coming Soon) |
| `/profile/services/valuation` | Account Valuation (Coming Soon) |

### Settings (5)
| Route | Component |
|-------|-----------|
| `/settings/account` | Account & Security |
| `/settings/profile` | Profile Settings |
| `/settings/appearance` | Appearance (Dark/Light) |
| `/settings/mlbb` | MLBB Account |
| `/settings/membership` | Membership & Billing |

---

## 3. Profile Sidebar Structure

```
PLAYER HUB
├── Overview → /profile
├── Match History → /profile/matches
├── Statistics → /profile/statistics
└── Favorite Heroes → /profile/favorites

COMMUNITY
├── Global Chat → /profile/community/chat
├── Looking for Scrim → /profile/community/scrim
├── Looking for Team → /profile/community/team
└── Looking for Player → /profile/community/player

COMPETITIVE
├── My Squad → /profile/competitive/squad
├── Community Tournament → /profile/competitive/tournament
└── Tournament History → /profile/competitive/history

SERVICES
├── Scrim Services → /profile/services/scrim
├── Room Tournament → /profile/services/room
└── Account Valuation → /profile/services/valuation

ACCOUNT
├── Edit Profile → /settings/profile
├── Appearance → /settings/appearance
├── MLBB Account → /settings/mlbb
├── Membership & Billing → /settings/membership
└── Account & Security → /settings/account

DANGER ZONE
├── Delete Account (confirmation modal)
└── Logout
```

---

## 4. Landing vs App Separation

- `/` = Marketing landing page ONLY
- `/app` = Internal app home
- All feature routes under `/app/*`
- Landing CTA → `/app/*`
- Internal Navbar never on landing
- Logout → `/` (landing)

---

## 5. Dark/Light Theme

- Provider: `src/lib/theme.tsx`
- CSS Variables: 20+ variables
- Settings: 2 cards (Dark / Light)
- localStorage persistence

---

## 6. Membership

| Plan | Price | Badge |
|------|-------|-------|
| Basic | Rp19.000/bulan | — |
| Elite | Rp49.000/bulan | MOST POPULAR |
| Pro | Rp99.000/bulan | — |

Single source: `src/data/membershipPlans.ts`

---

## 7. Migration Required (MANUAL)

Run `scripts/migrate-profile-membership.sql` against Neon PostgreSQL.

---

## 8. Files Changed

### New (1)
- `src/pages/profile/ComingSoonPage.tsx`

### Rewritten (3)
- `src/pages/profile/ProfileLayout.tsx` - Full 6-section sidebar
- `src/App.tsx` - Added 10 new Coming Soon routes
- `src/lib/theme.tsx` - Dark/Light provider

### Modified (20+)
- All auth pages, profile pages, settings pages, Navbar, RouteGuard, AuthLayout, backend routes

---

## 9. Verification

- `npx tsc --noEmit`: **PASS**
- `npm run build`: **PASS** (~13s)

---

## 10. Known Limitations

1. Migration needs manual execution
2. `/auth/change-password` not implemented
3. Payment gateway placeholder
4. Some existing components use hardcoded dark colors
