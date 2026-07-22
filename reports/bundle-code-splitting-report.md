# Bundle Code-Splitting Report

**Tanggal:** Jumat, 20 Juni 2026, pukul 23:15 WIB

## Summary

Implemented React.lazy code-splitting for 13 page-level components in `src/App.tsx`. Main JS bundle reduced from **2,421 kB to 1,169 kB** (52% reduction). All validation passes.

## Baseline Bundle Size (Before)

| Chunk | Size | Gzip |
|---|---|---|
| `index-BfQ9HJte.js` (main) | **2,421.47 kB** | 655.85 kB |
| `index.es-BnBNgBMF.js` | 159.60 kB | 53.51 kB |
| `html2canvas.esm-QH1iLAAe.js` | 202.38 kB | 48.04 kB |
| `purify.es-Csrj9YNg.js` | 28.14 kB | 10.69 kB |
| Build time | 12.23s | |

## Bundle Size After Optimization

| Chunk | Size | Gzip |
|---|---|---|
| `index-CSaezaqK.js` (main) | **1,168.89 kB** | 312.94 kB |
| `index.es-C8R-iX-z.js` | 159.81 kB | 53.64 kB |
| `html2canvas.esm-QH1iLAAe.js` | 202.38 kB | 48.04 kB |
| `purify.es-Csrj9YNg.js` | 28.14 kB | 10.69 kB |
| Build time | 12.48s | |

### Lazy-Loaded Chunks (New)

| Chunk | Size | Gzip |
|---|---|---|
| `TeamDraftPlanner-DjZGi3OR.js` | 436.82 kB | 140.58 kB |
| `HeroDetailPanel-mAsYxWtQ.js` | 296.09 kB | 90.03 kB |
| `DraftSimulator-DTD0QZkU.js` | 118.74 kB | 27.42 kB |
| `HeroFullPage-BSyNnAxi.js` | 111.91 kB | 22.05 kB |
| `LiquipediaDatabase-D9pEB-e3.js` | 72.91 kB | 16.12 kB |
| `TeamAnalytics-BTMuI61I.js` | 46.66 kB | 10.81 kB |
| `DataCatalog-rZ30gcNl.js` | 36.97 kB | 8.23 kB |
| `StatsDashboard-BBCWabKl.js` | 30.48 kB | 7.72 kB |
| `MacroMapPlanner-uA1U8Msn.js` | 17.60 kB | 5.43 kB |
| `AdminTools-CrekHeH8.js` | 16.25 kB | 4.65 kB |
| `LiveMatchHub-DxEhsUm-.js` | 12.65 kB | 4.06 kB |
| `TierListPanel-fJSIQKx-.js` | 11.61 kB | 4.03 kB |
| `CounterMatrixPanel-JxZOcMMY.js` | 10.23 kB | 2.83 kB |
| `HeroIntelligenceDashboard-C6Wd-Xed.js` | 9.96 kB | 3.56 kB |

## Files Changed

| File | Change |
|---|---|
| `src/App.tsx` | Replaced 13 static imports with `React.lazy()`, added `Suspense` wrappers, added `ModuleLoader` fallback component |

## Lazy-Loaded Components

1. `DraftSimulator` (157 KB source → 118.74 kB chunk)
2. `LiquipediaDatabase` (105.1 KB source → 72.91 kB chunk)
3. `HeroFullPage` (71.5 KB source → 111.91 kB chunk, includes HeroDetailPanel)
4. `TeamAnalytics` (67.7 KB source → 46.66 kB chunk)
5. `TeamDraftPlanner` (48.2 KB source → 436.82 kB chunk, includes heavy dependencies)
6. `StatsDashboard` (45 KB source → 30.48 kB chunk)
7. `DataCatalog` (24 KB source → 36.97 kB chunk)
8. `MacroMapPlanner` (24.2 KB source → 17.60 kB chunk)
9. `TierListPanel` (19.6 KB source → 11.61 kB chunk)
10. `AdminTools` (17.4 KB source → 16.25 kB chunk)
11. `LiveMatchHub` (15.8 KB source → 12.65 kB chunk)
12. `CounterMatrixPanel` (13.4 KB source → 10.23 kB chunk)
13. `HeroIntelligenceDashboard` (6.3 KB source → 9.96 kB chunk)

## Dynamic Imports Added

None beyond React.lazy — `html2canvas` is already code-split by Vite as a separate chunk (202 kB).

## ManualChunks Changes

None — React.lazy provided sufficient reduction without needing Vite manual chunks.

## Validation Results

| Check | Result |
|---|---|
| `npm run lint` | **PASS** |
| `npm run build` | **PASS** (12.48s) |
| `npm run validate:data` | **PASS** (132 heroes, 0 errors) |
| `npm run validate:assets` | **PASS** (1 warning: 59 items — pre-existing) |

## Smoke Check Result

- Server running on port 3001 (existing instance)
- `GET /` — **200 OK** (1,127 bytes)
- `GET /api/hero-stats` — **200 OK** (43,210 bytes)
- No blank screen, no dynamic import errors

## Remaining Warnings

- Chunk-size warning remains: main chunk at 1,169 kB > 500 kB limit
- This is expected — the main chunk still contains shared vendor libraries (react, react-dom, framer-motion, etc.) and the landing page with its many sub-components
- Further reduction would require manualChunks for vendor splitting or lazy-loading the landing page (not recommended — it's the first thing users see)

## Risk Assessment

**Low risk.** Only `src/App.tsx` was modified. All changes are additive (lazy imports + Suspense wrappers). No component logic, no exports, no API calls, no routing changed. Each lazy-loaded component renders with a simple "Loading module..." fallback that matches the existing design system.

## Next Recommendation

1. **ManualChunks for vendors** — Split `react`, `react-dom`, `framer-motion` into separate vendor chunks to further reduce main chunk (estimated ~200-300 kB reduction)
2. **Lazy-load landing sub-sections** — The landing page imports many section components that could be lazy-loaded with intersection observer
3. **Analyze main chunk contents** — Use `npm run build -- --debug` or `rollup-plugin-visualizer` to identify what's still in the main 1,169 kB chunk

---

**Report path:** `reports/bundle-code-splitting-report.md`
