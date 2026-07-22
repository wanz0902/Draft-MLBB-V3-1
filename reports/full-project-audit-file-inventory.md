# Full Project Audit — File Inventory

**Audit Date:** 2026-06-20 23:00 WIB

---

## Top-Level Directory Structure

| Directory | Files | Purpose |
|---|---|---|
| `src/` | 102 | Frontend React application |
| `server/` | 6 | Backend services |
| `data/` | 160 | Hero data, items, match history |
| `scripts/` | 50 | Sync, scrape, validation scripts |
| `public/` | 1,678 | Static assets (hero portraits, skill icons, videos, team logos) |
| `reports/` | ~40+ | Project reports and archives |
| `docs/` | 6 | Documentation and skill books |
| `dist/` | generated | Build output (gitignored) |
| `node_modules/` | generated | Dependencies (gitignored) |

---

## Frontend Areas (`src/`)

### Core App
| File | Purpose |
|---|---|
| `src/App.tsx` | Main app shell, tab routing, data loading |
| `src/index.css` | Global CSS, design system classes, animations |
| `src/types/` | TypeScript type definitions |

### Landing Page (`src/landing/`)
| File | Purpose |
|---|---|
| `src/landing/components/LandingPage.tsx` | Main landing page |
| `src/landing/components/HeroSection.tsx` | Hero banner with typing animation |
| `src/landing/components/FeatureShowcaseGrid.tsx` | Feature showcase cards |
| `src/landing/components/PricingSection.tsx` | Pricing display |
| `src/landing/components/FinalCTASection.tsx` | Final call-to-action |
| `src/landing/components/RoadmapSection.tsx` | Roadmap timeline |
| `src/landing/components/MetaIntelligenceSection.tsx` | AI meta intelligence preview |
| `src/landing/components/BanPickPOVSection.tsx` | Draft POV showcase |
| `src/landing/components/AIAnalysisPreview.tsx` | AI analysis demo |
| `src/landing/components/LandingNavbar.tsx` | Landing-specific navbar |
| `src/landing/components/LandingFooter.tsx` | Landing footer |
| `src/landing/components/MagneticCTA.tsx` | Magnetic cursor CTA button |
| `src/landing/components/PremiumButton.tsx` | Premium button component |
| `src/landing/components/TacticalCard.tsx` | Tactical feature card |
| `src/landing/components/CursorField.tsx` | Custom cursor effect |
| `src/landing/components/CommandBackground.tsx` | Command center background |
| `src/landing/components/ProductShowcaseStrip.tsx` | Product showcase strip |
| `src/landing/components/HowItWorksSection.tsx` | How it works section |
| `src/landing/components/HeroIntelTeaser.tsx` | Hero intelligence teaser |
| `src/landing/components/DraftIntroLoader.tsx` | Draft intro loading animation |
| `src/landing/hooks/` | Custom hooks (CTA, counter, magnetic, motion) |
| `src/landing/constants/` | Animation constants, demo data, pricing data |
| `src/landing/types/` | Landing type definitions |
| `src/landing/integration.ts` | Landing page integration |

### Main App Components (`src/components/`)
| File | Purpose |
|---|---|
| `Navbar.tsx` | App navigation bar |
| `DraftSimulator.tsx` | AI draft recommendation engine |
| `TeamDraftPlanner.tsx` | Visual team draft planner board |
| `MacroMapPlanner.tsx` | Interactive macro strategy map |
| `HeroIntelligenceDashboard.tsx` | Hero analysis dashboard |
| `HeroFullPage.tsx` | Hero detail full page (cinematic) |
| `HeroAttributeSystem.tsx` | Hero attribute comparison |
| `StatsDashboard.tsx` | Hero statistics with filters |
| `TeamAnalytics.tsx` | Team standings, matches, roster |
| `DataCatalog.tsx` | Items, emblems, spells catalog |
| `TierListPanel.tsx` | Hero tier rankings |
| `CounterMatrixPanel.tsx` | Hero counter relationships |
| `LiquipediaDatabase.tsx` | Pro player/team database |
| `LiveMatchHub.tsx` | Live match data hub |
| `AdminTools.tsx` | Admin panel |
| `LandingPage.tsx` | Legacy landing (kept for compatibility) |
| `ScrollStoryLanding.tsx` | Scroll-story landing variant |
| `StickyDraftShowcase.tsx` | Sticky draft showcase component |
| `DraftIntroLoader.tsx` | Draft intro loader (app-level) |
| `LoadingScreen.tsx` | Global loading screen |
| `LandingDemoCard.tsx` | Landing demo card |
| `VisitorStatsBadge.tsx` | Real-time visitor counter |
| `ui/animated-background.tsx` | Aurora background animation |

### Library (`src/lib/`)
| File | Purpose |
|---|---|
| `api.ts` | API base URL configuration |
| `motionPresets.ts` | 15 reusable Framer Motion animation presets |
| `draftStorage.ts` | Draft data persistence |
| `draftTypes.ts` | Draft type definitions |
| `heroUtils.ts` | Hero utility functions |
| `itemResolver.ts` | Item name/icon resolution |
| `firebase/` | Firebase configuration |

### Hooks (`src/hooks/`)
| File | Purpose |
|---|---|
| `useCounterAnimation.ts` | Animated counter hook |
| `useDraftBoardAnimation.ts` | Draft board animation hook |
| `useIntersectionObserver.ts` | Intersection observer hook |
| `useTeamMatchHistory.ts` | Team match history hook |
| `useTypingEffect.ts` | Typing effect animation hook |
| `useVisitorStats.ts` | Visitor statistics hook |

### Data (`src/data/`)
| File | Purpose |
|---|---|
| `heroes_master.json` | Master hero roster |
| `esportsAssetOverrides.ts` | Esports-specific asset overrides |
| `playerPhotoOverrides.ts` | Player photo path overrides |

---

## Backend Areas (`server/`)

| File | Purpose |
|---|---|
| `server.ts` | Express server, API routes, CORS, middleware |
| `services/aiLocalLock.ts` | Local AI provider lock system |
| `services/aiProviderRouter.ts` | AI provider routing |
| `services/liquipediaService.ts` | Liquipedia scraping service |
| `services/liquipediaLiveHub.ts` | Live match data service |

---

## Data Files (`data/`)

| Area | Count | Content |
|---|---|---|
| `data/heroes/` | 132 JSON files | Individual hero data (stats, builds, counters, skills, videos) |
| `data/items.json` | 1 file | All items data (162 items) |
| `data/emblems.json` | 1 file | Emblem data |
| `data/battle_spells.json` | 1 file | Battle spell data |
| `data/global_rank_tier.json` | 1 file | Global rank tier data |
| `data/match_history_normalized.json` | 1 file | 72 series (174 games) |
| `data/hero_countercard_sample.json` | 1 file | Counter card sample data |
| `data/player-photo-sources*.json` | 2 files | Player photo source manifests |
| `data/molebuild*.json` | 2 files | Community build data |
| `data/pro-player-sources*.json` | 1 file | Pro player data sources |

---

## Scripts (`scripts/`)

| Script | Purpose |
|---|---|
| `validate-data.ts` | Hero/match data validation |
| `validate-assets.ts` | Asset file validation |
| `validate-pro-builds.ts` | Pro build item validation |
| `sync-liquipedia.ts` | Liquipedia data sync |
| `sync-liquipedia-detail-data.ts` | Liquipedia detail sync |
| `sync-liquipedia-live-hub.ts` | Live match hub sync |
| `sync-items.ts` | Item data sync |
| `sync-emblems.ts` | Emblem data sync |
| `sync-battle-spells.ts` | Battle spell sync |
| `sync-global-rank.ts` | Global rank tier sync |
| `sync-pro-player-assets.ts` | Pro player asset sync |
| `sync-player-photos.ts` | Player photo sync |
| `scrape-player-detail.ts` | Player detail scraping |
| `populate-skill-videos.ts` | Auto-populate skill videos |
| `report-player-photo-coverage.ts` | Photo coverage report |
| `report-indonesia-player-photos.ts` | Indonesia player photos report |
| `extract_items.ps1` | PowerShell item extraction |

---

## Public Assets (`public/`)

| Area | Count | Content |
|---|---|---|
| `public/heroes/` | 132 folders | Hero portrait images |
| `public/skill_icons/` | 132 folders | Hero skill icons |
| `public/Item_Icons/` | ~162 files | Item images |
| `public/Emblem_Icons/` | Present | Emblem images |
| `public/Spell_Icons/` | Present | Battle spell images |
| `public/Talent_Icons/` | Present | Talent images |
| `public/teams/` | 9 folders | Team logos |
| `public/videos/heroes/` | 129 folders | Hero skill videos (MP4) |

---

## Reports & Docs

| Area | Count | Content |
|---|---|---|
| `reports/` | ~40 files | Project reports, audit reports, skill book reports |
| `reports/archive/` | ~80 files | Archived task reports |
| `reports/landing/` | 3 files | Landing page specific reports |
| `docs/` | 6 files | Architecture docs, skill books |

---

## Deployment/Config Files

| File | Purpose |
|---|---|
| `package.json` | npm config, scripts, dependencies |
| `tsconfig.json` | TypeScript configuration |
| `vite.config.ts` | Vite build configuration |
| `railway.json` | Railway deployment config |
| `.gitignore` | Git ignore rules |
| `.env` | Environment variables (gitignored) |
| `.env.example` | Environment template |
| `server.ts` | Backend server entry point |

---

## Generated/Deploy Artifacts (should be ignored)

| Directory | Status |
|---|---|
| `dist/` | Gitignored ✅ |
| `node_modules/` | Gitignored ✅ |
| `deploy-pages/` | Present (Cloudflare Pages deploy) |
| `.vite/` | Gitignored ✅ |

---

## Accidental/Questionable Files

| File | Status |
|---|---|
| `tatus --short` | Appears to be a stray file from a mistyped command — **should be cleaned up** |
| `aset_item/`, `aset_hero/`, etc. | Asset extraction source folders — may be temporary |
| `debug/` | Gitignored ✅ |
| `logs/` | Present, contents unknown |

---

## Root Explorer Inventory — Full VS Code Tree Audit

**Audit Date:** 2026-06-20 23:15 WIB

### Agent/Tool Folders

| Folder | Files | Tracked | Purpose | Risk | Recommendation |
|---|---|---|---|---|---|
| `.agent` | 31 | ✅ Yes | Kilo agent skill (ui-ux-pro-max) — SKILL.md, CSV data, Python scripts | Low | Keep — skill book for Kilo AI |
| `.cache` | 1 | ❌ No | Tool cache (not tracked) | Low | Ignore — already untracked |
| `.claude` | 31 | ✅ Yes | Claude Code skill (ui-ux-pro-max) — same structure as .agent | Low | Keep — Claude Code skill |
| `.codebuddy` | 31 | ✅ Yes | CodeBuddy skill (ui-ux-pro-max) — same structure | Low | Keep — CodeBuddy skill |
| `.codex` | 31 | ✅ Yes | OpenAI Codex skill (ui-ux-pro-max) — same structure | Low | Keep — Codex skill |
| `.continue` | 31 | ✅ Yes | Continue.dev skill (ui-ux-pro-max) — same structure | Low | Keep — Continue skill |
| `.cursor` | 31 | ✅ Yes | Cursor IDE skill (ui-ux-pro-max) — same structure | Low | Keep — Cursor skill |
| `.gemini` | 31 | ✅ Yes | Google Gemini skill (ui-ux-pro-max) — same structure | Low | Keep — Gemini skill |
| `.github` | 31 | ✅ Yes | GitHub Copilot prompts (ui-ux-pro-max) — PROMPT.md + CSV data | Low | Keep — GitHub Copilot prompts |
| `.kilo` | 3,031 | ❌ No | Kilo AI configuration — skills, agents, commands | Low | Ignore — not tracked, local config |
| `.kiro` | 53 | ✅ Yes | Amazon Kiro specs — 6 spec folders (draft-coach, audit-fix, etc.) | Low | Keep — Kiro project specs |
| `.opencode` | 31 | ✅ Yes | OpenCode skill (ui-ux-pro-max) — same structure | Low | Keep — OpenCode skill |
| `.qoder` | 3,486 | ✅ Yes | Qoder skill (ui-ux-pro-max) — largest agent folder | Medium | Review — 3,486 files seems excessive for a skill folder |
| `.roo` | 31 | ✅ Yes | Roo Code skill (ui-ux-pro-max) — same structure | Low | Keep — Roo Code skill |
| `.trae` | 31 | ✅ Yes | Trae AI skill (ui-ux-pro-max) — same structure | Low | Keep — Trae skill |
| `.vscode` | 1 | ❌ No | VS Code workspace settings (not tracked) | Low | Ignore — local workspace config |
| `.windsurf` | 31 | ✅ Yes | Windsurf skill (ui-ux-pro-max) — same structure | Low | Keep — Windsurf skill |
| `.wrangler` | 0 | ❌ No | Cloudflare Wrangler config (empty, not tracked) | Low | Ignore — already untracked |

**Note:** 14 of 18 agent folders contain identical ui-ux-pro-max skill data (SKILL.md + CSV data + Python scripts). This is by design — the skill is distributed across multiple AI tool formats.

### Asset/Data Folders

| Folder | Files | Tracked | Purpose | Risk | Recommendation |
|---|---|---|---|---|---|
| `archive` | 299 | ✅ Yes | Archived data/snapshots — Liquipedia data, hero data backups | Low | Keep — historical data |
| `aset_emblem` | 7 | ✅ Yes | Emblem icon source images | Low | Keep — emblem assets |
| `aset_hero` | 0 | ✅ Yes | Hero portrait source (empty) | Low | Keep — may be used by scripts |
| `aset_item` | 51 | ✅ Yes | Item icon source images (extraction sources) | Low | Keep — item assets |
| `aset_spell` | 12 | ✅ Yes | Battle spell icon source images | Low | Keep — spell assets |
| `aset_talent` | 26 | ✅ Yes | Talent icon source images | Low | Keep — talent assets |
| `data` | 160 | ✅ Yes | Hero JSON data, match history, items, emblems | Low | Keep — core data |
| `debug` | 39 | ❌ No | Debug artifacts (gitignored) | Low | Ignore — already gitignored |
| `public` | 1,678 | ✅ Yes | Static assets — portraits, icons, videos, team logos | Medium | Keep — large but required by code |
| `regular_season_files` | 139 | ✅ Yes | Liquipedia scraped images — tournament icons, hero icons, team logos | Medium | Review — may be raw scraped data, evaluate if all needed |
| `skill_icons` | 558 | ✅ Yes | Hero skill icon PNGs (root level, separate from public/) | Medium | Review — duplicate of public/skill_icons? Evaluate if needed |

### Build/Deploy/Runtime Folders

| Folder | Files | Tracked | Purpose | Risk | Recommendation |
|---|---|---|---|---|---|
| `deploy-pages` | 1,081 | ✅ Yes | Cloudflare Pages deploy output — raw assets, built files | High | **Should NOT be tracked** — build artifact, add to .gitignore |
| `dist` | 1,685 | ❌ No | Vite build output (gitignored) | Low | Already properly ignored |
| `logs` | 1 | ✅ Yes | Runtime log file | Low | Keep — single log file |
| `lib` | 6 | ✅ Yes | Backend library — database.ts, neon.ts, scrapers | Low | Keep — backend code |

### Root Files

| File | Tracked | Purpose | Risk | Recommendation |
|---|---|---|---|---|
| `.env` | ❌ No | Environment variables (gitignored) | Low | Already properly ignored |
| `.env.example` | ✅ Yes | Environment template | Low | Keep — required for setup |
| `.gitignore` | ✅ Yes | Git ignore rules | Low | Keep |
| `.railwayignore` | ✅ Yes | Railway deploy ignore rules | Low | Keep |
| `AGENTS.md` | ✅ Yes | Kilo AI project instructions | Low | Keep — skill book system |
| `CHANGELOG.md` | ✅ Yes | Project changelog | Low | Keep |
| `README.md` | ✅ Yes | Project readme | Low | Keep |
| `package.json` | ✅ Yes | npm config | Low | Keep |
| `package-lock.json` | ✅ Yes | npm lock file | Low | Keep |
| `railway.json` | ✅ Yes | Railway deployment config | Low | Keep |
| `server.ts` | ✅ Yes | Backend server entry point | Low | Keep |
| `vite.config.ts` | ✅ Yes | Vite build config | Low | Keep |
| `tsconfig.json` | ✅ Yes | TypeScript config | Low | Keep |
| `index.html` | ✅ Yes | HTML entry point | Low | Keep |

### Accidental/Stray Files

| File | Tracked | Purpose | Risk | Recommendation |
|---|---|---|---|---|
| `tatus --short` | ✅ Yes | **Typo file** — created by mistyped `git status --short` command | Medium | **Remove** — accidental file from wrong command |
| `butss.png` | ✅ Yes | Unknown screenshot/image | Low | Review — may be accidental |
| `deploy-pages-root.zip` | ✅ Yes | Zip archive of deploy-pages | Medium | **Remove** — redundant with deploy-pages/ folder |
| `homepage-check-latest.png` | ✅ Yes | Homepage check screenshot | Low | Review — may be temporary |
| `homepage-final-check.png` | ✅ Yes | Homepage final check screenshot | Low | Review — may be temporary |

### Summary Statistics

| Category | Count | Tracked | Gitignored |
|---|---|---|---|
| Agent/tool folders | 18 | 14 | 4 |
| Asset/data folders | 11 | 10 | 1 |
| Build/deploy folders | 4 | 2 | 2 |
| Root config files | 14 | 14 | 0 |
| Accidental/stray files | 5 | 5 | 0 |
| **Total** | **52** | **45** | **7** |

### Key Risks

1. **`deploy-pages/` is tracked but should NOT be** — 1,081 files of build artifacts are committed to git. This is the highest priority cleanup item.
2. **`skill_icons/` at root may duplicate `public/skill_icons/`** — 558 files that may be redundant.
3. **`qoder/` has 3,486 files** — seems excessive for a skill folder, worth investigating.
4. **Stray file `tatus --short`** — committed to git, should be removed.
5. **5 accidental files tracked** — screenshots and zip that may not belong in repo.

---

**Report path:** `reports/full-project-audit-file-inventory.md`
