# Full Project Audit — Commit History

**Audit Date:** 2026-06-20 23:00 WIB

---

## Branch Info

| Field | Value |
|---|---|
| Current branch | `feature/framer-motion-skill-book` |
| HEAD | `fa2bd4f3d1a385beb3bbf9a9512dec36dbe55efc` |
| Remote | `origin` → `https://github.com/wanz0902/draftmlbbv2.git` |
| All local branches | 11 (main, feature/framer-motion-skill-book, feat-landing-intro-loader, feat-landing-page-rewrite, fix-hero-attrs-compact, fix-local-ai-lock, jet-watcher, nova-song, excessive-cup, spicy-nerine) |

---

## Commit Timeline (96 commits, 2026-06-05 → 2026-06-20)

### Phase 1: Foundation (2026-06-05 → 2026-06-06) — 14 commits
| Hash | Date | Message |
|---|---|---|
| 8163fdc | 06-05 | Initial commit |
| 46fa38e | 06-06 | Checkpoint AI provider and draft engine updates |
| 9017b59 | 06-06 | chore: ignore env files |
| 8b874af | 06-06 | chore: secure env handling |
| d73cef5 | 06-06 | chore: ignore sqlite runtime files |
| 4a0663a | 06-06 | feat: improve recommendation UI labels and responsive hero cards |
| 8ff3e0d | 06-06 | chore: ignore local debug artifacts |
| 1b32b40 | 06-06 | chore: add data validation script |
| bd666ed | 06-06 | docs: document data architecture |
| 3a1028e | 06-06 | docs: document ai provider policy |
| 434e426 | 06-06 | chore: log ai request usage for analysis endpoints |
| 4aa120c | 06-06 | chore: gate deep analysis endpoint |
| 13591bc | 06-06 | chore: rate limit user-facing ai endpoints |
| 6e40a25 | 06-06 | chore: protect legacy ai endpoints |
| 081f80a | 06-06 | chore: deprecate legacy draft evaluate endpoint |
| c989f10 | 06-06 | chore: gate ai diagnostic endpoints |

### Phase 2: Data Pipeline & Core Features (2026-06-07) — 22 commits
| Hash | Date | Message |
|---|---|---|
| 56be2f5 | 06-07 | chore: archive backup_20260605 data snapshot |
| 82c64cf | 06-07 | chore: archive inactive data backups |
| eecc69e | 06-07 | chore: add asset validation script |
| 7cd75cb | 06-07 | chore: remove scraped junk files from team assets |
| 5defe56 | 06-07 | chore: add missing skill icons |
| a15c62d | 06-07 | fix: return fallback for ranked ai recommendation failures |
| d093851 | 06-07 | feat: add missing skill icons and data for 14 heroes |
| 2e5524d | 06-07 | fix: improve hero stats interactions |
| d8fedcf | 06-07 | fix: show hero intelligence preview in stats |
| 90d4606 | 06-07 | fix: open selected hero intelligence from stats |
| 7a20e74 | 06-07 | fix: sync hero stats count with liquipedia |
| 439a0b5 | 06-07 | fix: align hero stats scraper source |
| 1dc0a92 | 06-07 | fix: sync yi sun-shin hero stats from liquipedia |
| c05699c | 06-07 | fix: correct valentina hero stats mapping |
| 5145aa5 | 06-07 | chore: gate liquipedia scraper admin access |
| cf2f1ab | 06-07 | feat: add admin liquipedia update preview |
| 08be81e | 06-07 | chore: improve admin liquipedia preview status |
| 0630e39 | 06-07 | feat: add admin approved liquipedia apply flow |
| 3d36849 | 06-07 | chore: hide incomplete counter matrix |
| 1a4e1ea | 06-07 | fix: improve tier list filters and hero details |
| 01db4a0 | 06-07 | feat: add global rank tier data pipeline and mode switch |
| ba9af59 | 06-07 | fix: sync full global rank tier data |

### Phase 3: Item Catalog & Team Features (2026-06-07) — 15 commits
| Hash | Date | Message |
|---|---|---|
| c7fb8b3 | 06-07 | fix: clarify incomplete item catalog data |
| 4303ed6 | 06-07 | feat: add item catalog enrichment pipeline |
| 2068330 | 06-07 | fix: show item abilities and add data catalog tabs |
| 587691b | 06-07 | feat: improve item catalog details and unique attributes |
| b7ab89d | 06-07 | feat: polish item catalog detail UI |
| 7f7f161 | 06-07 | feat: redesign item catalog database layout |
| 646f1eb | 06-07 | fix: complete data catalog visuals and validation |
| abb3e31 | 06-07 | fix: verify equipment data and add data catalog icons |
| 530db32 | 06-07 | fix: polish team match center UI |
| a59e88e | 06-07 | feat: add wafer multi-key rotation support |
| 137f572 | 06-07 | fix: polish team profile history UI |
| 652819a | 06-07 | fix: verify item data and improve item catalog UI with visual recipe build path |
| 19f027a | 06-07 | feat: redesign item catalog with MLBBHub-style premium dark theme |
| f1dae20 | 06-07 | fix: redesign teams analytics and standings UI |
| 25c691c | 06-07 | fix: improve draft simulator pause and selection UX |

### Phase 4: Hero Data Sync (2026-06-08) — 12 commits
| Hash | Date | Message |
|---|---|---|
| db0d401 | 06-08 | feat: sync hero data from mlbb.tools |
| 34c6852 | 06-08 | feat: complete hero data sync from mlbb.tools |
| fd35dfa | 06-08 | feat: sync counter data from mlcounters.app |
| 727a3e5 | 06-08 | feat: enrich items/emblems/spells data from mlbbhub.com |
| c5c68fe | 06-08 | feat: sync community builds from molebuild.com |
| 12a21e9 | 06-08 | feat: enrich mlbbhub.com data |
| ec1e9b2 | 06-08 | fix: resolve tier list duplicate, clean labels |
| 2942c39 | 06-08 | docs: add full data sync report |

### Phase 5: Team Draft Planner & Landing (2026-06-08) — 25 commits
| Hash | Date | Message |
|---|---|---|
| 23e20b7 → 927c790 | 06-08 | TDP v1 creation, guided tour, onboarding, polish (15+ commits) |
| 102ed80 → 0c8c15d | 06-08 | Landing page polish, visitor stats badge |

### Phase 6: Hero Detail Redesign (2026-06-09) — 7 commits
| Hash | Date | Message |
|---|---|---|
| 09df951 | 06-09 | feat: redesign hero detail page with cinematic header + skill video |
| 7eeaefb | 06-09 | fix: item icon fallback for pro builds |
| 94262f9 | 06-09 | fix: validate and resolve pro build items across all 132 heroes |
| 544dd68 | 06-09 | refactor: refine hero attributes interactive layout |
| 34fd940 | 06-09 | fix: remove firebase-applet-config.json dependency |
| 5636dfe | 06-09 | chore: add item icon assets, extraction script, public videos |
| 489b5a2 | 06-09 | fix: tighten navbar layout |

### Phase 7: Video Assets (2026-06-09) — 1 commit
| Hash | Date | Message |
|---|---|---|
| 7a23bd3 | 06-09 | feat: auto-populate skillVideos for 129 heroes from local video assets |

### Phase 8: Item Fix (2026-06-09) — 1 commit
| Hash | Date | Message |
|---|---|---|
| 1657060 | 06-09 | fix: add marcel items/proBuilds, remove 3 invalid items |

### Phase 9: Skill Books (2026-06-20) — 1 commit
| Hash | Date | Message |
|---|---|---|
| fa2bd4f | 06-20 | docs: register kilo skill books and motion presets |

---

## Commit Clusters Summary

| Cluster | Commits | Description |
|---|---|---|
| Foundation & security | ~16 | Env, auth, rate limiting, data architecture |
| Data pipeline | ~20 | Hero sync, counters, items, builds |
| Core features | ~25 | Draft sim, TDP, hero detail, landing |
| UI polish | ~20 | Item catalog, team analytics, tier list |
| Tooling | ~10 | Validation scripts, asset management |
| Docs/skill books | ~5 | Reports, skill index, Framer Motion |

---

## Suspicious/Unclear Commits

- None found. All commits have clear descriptive messages following conventional commit format.

---

## Branch Safety

- Current branch `feature/framer-motion-skill-book` is clean with only audit-related uncommitted changes.
- 10 other local branches exist — some may be stale (excessive-cup, spicy-nerine, jet-watcher, nova-song).
- No force-pushes or rebases detected.

---

**Report path:** `reports/full-project-audit-commit-history.md`
