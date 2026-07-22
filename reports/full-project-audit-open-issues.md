# Full Project Audit — Open Issues & Risk Map

**Audit Date:** 2026-06-20 23:00 WIB

---

## Priority Legend

- **P0** = Breaks build/runtime/security
- **P1** = Important user-visible bug
- **P2** = Important improvement
- **P3** = Cleanup/optimization

---

## Issues

### P2 — Important Improvements

#### 1. Bundle Size Exceeds 500 kB Limit
- **File:** `dist/assets/index-26br2c3_.js` — 2,421 kB (gzip: 655 kB)
- **Impact:** Slow initial load, especially on mobile
- **Cause:** All components loaded in single chunk, no code-splitting
- **Fix:** Use `React.lazy()` + `dynamic import()` for route-level components
- **Risk if unfixed:** Performance degradation as more features are added

#### 2. 59 Items Lack Enrichment Data
- **File:** `data/items.json`
- **Impact:** 59 items show placeholder UI in data catalog
- **Cause:** `validate:assets` reports 162 item images but only 103 have enrichment
- **Fix:** Complete item enrichment pipeline from mlbbhub.com
- **Risk if unfixed:** Incomplete item catalog experience

#### 3. `framer-motion` Is Transitive Dependency
- **Current:** `motion@12.40.0` → `framer-motion@12.40.0` (transitive)
- **Docs use:** `import { motion } from "framer-motion"` (19+ files)
- **Impact:** Works now but fragile — if `motion` changes peer deps, imports may break
- **Fix:** `npm install framer-motion@12.40.0` as direct dependency
- **Risk if unfixed:** Potential import resolution failure on future `motion` updates

---

### P3 — Cleanup/Optimization

#### 4. Landing Page Component Duplication
- **Locations:** `src/components/LandingPage.tsx` AND `src/landing/components/LandingPage.tsx`
- **Also:** `src/components/DraftIntroLoader.tsx` AND `src/landing/components/DraftIntroLoader.tsx`
- **Also:** `src/components/ScrollStoryLanding.tsx` (possibly unused)
- **Impact:** Confusion about which is canonical, maintenance burden
- **Fix:** Consolidate into `src/landing/` directory, remove duplicates

#### 5. 10 npm Packages Outdated
- **Packages:** @google/genai, @types/express, @types/node, @vitejs/plugin-react, esbuild, express, lucide-react, pg, typescript, vite
- **Impact:** Missing security patches, new features, performance improvements
- **Fix:** Periodic `npm update` (non-breaking minor/patch versions)
- **Note:** Some have major version jumps (express 4→5, typescript 5→6, vite 6→8) — require careful evaluation

#### 6. Stray File: `tatus --short`
- **Location:** Project root
- **Impact:** Appears to be a file created by mistyped `git status --short` command
- **Fix:** Delete the file

#### 7. Multiple Stale Local Branches
- **Branches:** excessive-cup, spicy-nerine, jet-watcher, nova-song, feat-landing-intro-loader, feat-landing-page-rewrite, fix-hero-attrs-compact, fix-local-ai-lock
- **Impact:** Cluttered branch list, confusion about active work
- **Fix:** Review and delete merged/stale branches

#### 8. Large Untracked Video Assets
- **Location:** `public/videos/heroes/` — 129 hero folders with MP4 videos
- **Impact:** Repository bloat if committed, slow clone times
- **Status:** Videos appear to be committed in recent commits (5636dfe, 7a23bd3)
- **Note:** Already in git history — cannot be removed without history rewrite

#### 9. UI UX Pro Max Phases 3-6 Not Started
- **Phase 3:** Hero Stats premium polish — NOT STARTED
- **Phase 4:** Team Analytics premium polish — NOT STARTED
- **Phase 5:** Draft War Room premium polish — NOT STARTED
- **Phase 6:** Landing Page premium polish — NOT STARTED
- **Impact:** Inconsistent premium feel across different sections
- **Fix:** Execute remaining UI UX phases as separate tasks

#### 10. `aset_item/` and Other Asset Extraction Folders
- **Location:** Project root (aset_item/, aset_hero/, aset_emblem/, aset_spell/, aset_talent/)
- **Impact:** May be temporary extraction folders that should be cleaned up
- **Fix:** Evaluate if still needed, archive or delete

#### 11. `deploy-pages/` Build Artifacts Tracked in Git
- **Location:** `deploy-pages/` — 1,081 files
- **Impact:** Build output committed to repo, inflates repo size, clone times
- **Fix:** Add `deploy-pages/` to `.gitignore`, remove from tracking (not from disk)
- **Severity:** **P2** — should not be tracked

#### 12. Stray File `tatus --short` Committed
- **Location:** Project root
- **Impact:** Accidental file from mistyped `git status --short` command
- **Fix:** Delete the file
- **Severity:** P3

#### 13. `deploy-pages-root.zip` Committed
- **Location:** Project root
- **Impact:** Zip archive redundant with `deploy-pages/` folder
- **Fix:** Delete the file
- **Severity:** P3

#### 14. `skill_icons/` at Root May Duplicate `public/skill_icons/`
- **Location:** `skill_icons/` (558 files) vs `public/skill_icons/`
- **Impact:** Potential duplicate assets, wasted space
- **Fix:** Evaluate if both are needed, consolidate if redundant
- **Severity:** P3

#### 15. 5 Screenshots/Stray Files Tracked
- **Location:** `butss.png`, `homepage-check-latest.png`, `homepage-final-check.png`
- **Impact:** Temporary files committed to repo
- **Fix:** Review and remove if no longer needed
- **Severity:** P3

---

## Risk Summary

| Risk | Level | Mitigation |
|---|---|---|
| Bundle size | Medium | Code-split with dynamic imports |
| `deploy-pages/` tracked | **High** | Add to .gitignore, remove from tracking |
| Incomplete items | Low | Complete enrichment pipeline |
| Transitive framer-motion | Low | Add as direct dependency |
| Component duplication | Low | Consolidate landing components |
| Liquipedia 429 rate limits | Medium | Already documented, rate-limited |
| Large video assets in git | Low | Already committed, can't undo without history rewrite |
| Stray files committed | Low | Remove accidental files |
| Port conflicts | Low | Pre-existing, dev environment issue |

---

## No P0/P1 Issues Found

The project has no build-breaking, runtime-crashing, or security-critical issues. All validation passes. The main concerns are optimization (bundle size), completeness (item enrichment), build artifact tracking (`deploy-pages/`), and maintenance (duplication, stale branches, stray files).

---

**Report path:** `reports/full-project-audit-open-issues.md`
