# App Dashboard, Community, Events & Services Restructure Report

**Date:** 2026-07-23 09:30 WIB  
**Model:** mimo-v2.5

---

## 1. Old vs New Information Architecture

### Old (Problematic)
- Profile sidebar had 6 sections (Player Hub, Community, Competitive, Services, Account, Danger Zone) - too long, mixed personal with platform features
- No dedicated Community/Events/Services routes
- Generic ComingSoonPage for all new features
- Navbar items collided on laptop widths

### New (Revised)
```
APPLICATION:     /app, /app/draft, /app/heroes, etc.
COMMUNITY:       /community, /community/chat, /community/lfs, /community/lft, /community/lfp
EVENTS:          /events, /events/community-cup, /events/my-squad, /events/history
SERVICES:        /services, /services/scrim, /services/room-tournament, /services/account-valuation
PROFILE:         /profile, /profile/matches, /profile/statistics, /profile/favorites, /profile/squad, /profile/tournaments
SETTINGS:        /settings/profile, /settings/appearance, /settings/mlbb, /settings/membership, /settings/account
```

---

## 2. Profile Sidebar (Simplified)

```
PLAYER PROFILE
├── Overview → /profile
├── Match History → /profile/matches
├── Statistics → /profile/statistics
├── Favorite Heroes → /profile/favorites
├── My Squad → /profile/squad
└── Tournament History → /profile/tournaments

Footer: Back to App → /app
```

Removed from Profile sidebar: Global Chat, LFS, LFT, LFP, Community Tournament, Scrim Services, Room Tournament, Account Valuation, Edit Profile, Appearance, MLBB Account, Membership, Account Security, Delete Account, Logout

---

## 3. Settings Sidebar

```
ACCOUNT
├── Profile → /settings/profile
├── Appearance → /settings/appearance
├── MLBB Account → /settings/mlbb
├── Membership & Billing → /settings/membership
└── Account & Security → /settings/account

DANGER ZONE
├── Delete Account (modal)
└── Logout

Footer: Back to App → /app
```

---

## 4. Avatar Dropdown

- View Profile → /profile
- My Squad → /events/my-squad
- Membership → /settings/membership
- Settings → /settings/profile
- Logout

---

## 5. Navbar Responsive

Desktop > 1440px: Home, Draft, Heroes, Data, Live Matches, Draft Planner, Community, Events, More
More dropdown: Counters, Macro, Teams, Meta, Scrim Services, Room Tournament, Account Valuation
Tablet/Mobile: Hamburger drawer

---

## 6. App Dashboard Sections

A. Welcome Header - user name, MLBB nickname, plan badge, avatar, completion bar
B. Community Prize Fund - Rp2M pool, eligible members, progress bar, prize distribution
C. Weekly Tournament Timeline - 4-week monthly season
D. Tournament Requirements - 8-item checklist
E. Quick Actions - 6 feature cards
F. Latest Platform Updates - 3 placeholder updates

---

## 7. Prize Pool Formula

```
ELITE_MONTHLY_PRICE = 49,000
CONTRIBUTION_PER_ELIGIBLE_MEMBER = 20,000
TARGET_ELIGIBLE_MEMBERS = 100
MAX_MONTHLY_PRIZE_POOL = 2,000,000

eligibleMembers = activeElite + activePro
currentPrizeFund = min(eligibleMembers × 20,000, 2,000,000)
progress = min(eligibleMembers / 100 × 100, 100)
```

Prize Distribution: 1st Rp1M, 2nd Rp700K, 3rd Rp300K = Total Rp2M

---

## 8. Redirect Map

| Old Route | New Route |
|-----------|-----------|
| /profile/community/chat | /community/chat |
| /profile/community/scrim | /community/lfs |
| /profile/community/team | /community/lft |
| /profile/community/player | /community/lfp |
| /profile/competitive/tournament | /events/community-cup |
| /profile/competitive/squad | /events/my-squad |
| /profile/competitive/history | /events/history |
| /profile/services/scrim | /services/scrim |
| /profile/services/room | /services/room-tournament |
| /profile/services/valuation | /services/account-valuation |

---

## 9. Files Created (14)

- `src/pages/app/AppDashboard.tsx` - Full dashboard with Prize Fund, Timeline, Quick Actions
- `src/pages/community/CommunityLayout.tsx` - Tab layout (Global Chat, LFS, LFT, LFP)
- `src/pages/community/GlobalChat.tsx` - Chat preview with message feed + online users
- `src/pages/community/LookingForScrim.tsx` - Scrim request form + preview cards
- `src/pages/community/LookingForTeam.tsx` - Player profile form + preview cards
- `src/pages/community/LookingForPlayer.tsx` - Recruitment form + preview cards
- `src/pages/events/EventsLayout.tsx` - Tab layout (Community Cup, My Squad, History)
- `src/pages/events/CommunityCup.tsx` - Prize fund, timeline, distribution, requirements
- `src/pages/events/MySquad.tsx` - Squad preview card with fields
- `src/pages/events/TournamentHistory.tsx` - Empty state with link to Community Cup
- `src/pages/services/ServicesLayout.tsx` - Tab layout (Scrim, Room, Valuation)
- `src/pages/services/ScrimServices.tsx` - 11 service cards with prices
- `src/pages/services/RoomTournament.tsx` - Room booking preview
- `src/pages/services/AccountValuation.tsx` - Valuation form with security notice

## 10. Files Modified (4)

- `src/App.tsx` - 40+ routes, redirects, lazy imports
- `src/components/Navbar.tsx` - Responsive with More dropdown, avatar menu
- `src/pages/profile/ProfileLayout.tsx` - Simplified 6-item sidebar
- `src/pages/settings/SettingsLayout.tsx` - Back to App link

---

## 11. Verification

- `npx tsc --noEmit`: **PASS** (0 errors)
- `npm run build`: **PASS** (~11s)

---

## 12. Implementation Status

| Feature | Status |
|---------|--------|
| App Dashboard | UI PREVIEW |
| Community Prize Fund | UI PREVIEW / BACKEND COMING SOON |
| Tournament Timeline | UI PREVIEW / BACKEND COMING SOON |
| Global Chat | UI PREVIEW / BACKEND COMING SOON |
| Looking for Scrim | UI PREVIEW / BACKEND COMING SOON |
| Looking for Team | UI PREVIEW / BACKEND COMING SOON |
| Looking for Player | UI PREVIEW / BACKEND COMING SOON |
| Community Cup | UI PREVIEW / BACKEND COMING SOON |
| My Squad | UI PREVIEW / BACKEND COMING SOON |
| Tournament History | UI PREVIEW / BACKEND COMING SOON |
| Scrim Services | UI PREVIEW / BACKEND COMING SOON |
| Room Tournament | UI PREVIEW / BACKEND COMING SOON |
| Account Valuation | UI PREVIEW / BACKEND COMING SOON |
| Profile Sidebar | COMPLETE |
| Settings Sidebar | COMPLETE |
| Navbar Responsive | COMPLETE |
| Avatar Dropdown | COMPLETE |
| Route Redirects | COMPLETE |
