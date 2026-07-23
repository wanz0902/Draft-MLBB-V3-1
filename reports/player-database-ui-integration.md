# Player Database UI Integration

> Generated: 2026-07-23

## Source Data
- **File**: `data/liquipedia/players.json` — 599 pro players from Liquipedia
- **File**: `data/liquipedia/teams.json` — 343 pro teams from Liquipedia
- **Sync**: Liquipedia API v3, last synced 2026-06-18
- **API**: `GET /api/liquipedia/players` (paginated, filtered), `GET /api/liquipedia/player-detail`

## Existing Component
- **File**: `src/components/LiquipediaDatabase.tsx` (1759 lines)
- **Route**: `/app/pro`
- **Status**: FULLY FUNCTIONAL — tabs for Pro Players, Team Staff, Broadcast Talent, Needs Review, Teams
- **Features**: Search, filter (nationality, region, role, status), pagination, detail modal, photo overrides, team logo overrides

## Integration Changes

### 1. Sidebar Link Added
- **File**: `src/components/navigation/AppSidebar.tsx`
- **Change**: Added `{ label: "Players", short: "Players", icon: User, path: "/app/pro" }` to ANALYSIS_ITEMS
- **Position**: First item in ANALYSIS group (most discoverable)
- **Icon**: `User` from lucide-react (distinct from `Users` used for Teams)

### 2. Data Hub Overview
- **File**: `src/components/DataCatalog.tsx`
- **Change**: Added "Data Hub" tab showing all 10 data domains with counts and links
- **Player card**: Shows "Pro Players" with count 599, links to `/app/pro`

## Data Classification
- **Access Level**: PUBLIC (all users including guests)
- **Personal data**: None (all pro player data is public)
- **Admin data**: None exposed

## Validation
- `npx tsc --noEmit` — passed
- `npx vite build` — passed

## Known Limitations
- Only 1 of 599 players has a detailed profile file (`butss.json`)
- Player photos rely on overrides + Liquipedia auto-repair (some may show fallback)
- Team references may show raw template names for some players
