# Player Dossier Real Visual Delta Report

**Tanggal:** Jumat, 20 Juni 2026, pukul 20:35 WIB

## What Changed (Structural — Not Just CSS Classes)

### Left Poster Panel
| Element | Before | After |
|---|---|---|
| Outer div | `w-[300px]` fixed height | `w-[320px]` `flex-1 min-h-[320px]` flexible height |
| Background | Basic radial gradient | Layered: radial + team color glow + grid pattern overlay (24px grid lines, 3% opacity) |
| Bottom gradient | `h-2/3` flat | `height: 55%` with 4-stop gradient for deeper nameplate zone |
| Role badge | `text-[9px] font-medium px-2 py-0.5 rounded` | `text-[10px] font-bold px-2.5 py-1 rounded-md` + accent glow shadow |
| Nickname | `text-3xl sm:text-4xl font-black` | `text-3xl sm:text-4xl font-black` + `textShadow with accent color` |
| Real name | `text-[13px] text-gray-400` | `text-[13px] text-gray-300/90 font-medium` (brighter) |
| Country/team row | `gap-3 text-[11px]` | `gap-2.5 text-[11px]` with text-shadow |
| Stat chips | Basic bg/border | `bg with 0.05 opacity + border 0.07 + py-2` (bigger padding) |

### Right Panel Dossier Header
| Element | Before | After |
|---|---|---|
| Header bg | `border-b border-white/[0.04]` | `border-b` with `borderColor: accent18` + gradient bg |
| Accent line | None | `h-px gradient from accent to transparent` at top |
| Nickname | `text-xl sm:text-2xl font-bold` | `text-2xl sm:text-3xl font-black` + accent textShadow |
| Summary text | `text-[12px] text-gray-500` | `text-[11px] text-gray-400 max-w-lg` |
| Team card | Just logo + name | Logo + name + team-colored pill badge |
| Career metrics | Basic grid | `card-metric-accent` featured card + `card-metric` supporting cards |

### Tab Navigation
| Element | Before | After |
|---|---|---|
| Tab buttons | `px-3 py-1.5 rounded-md text-[12px] font-medium` | `px-4 py-2 rounded-lg text-[12px] font-bold` |
| Active state | `layoutId` with accent bg | Inline style `background: accent15, border: accent30` |
| Container | `border-white/[0.04]` | `border-white/[0.06]` + `background: rgba(255,255,255,0.015)` |
| Count badge | `opacity-50` | `font-mono opacity-50` |

## What Was Visibly Different

1. **Left panel** is now wider (320px) with flexible height, grid pattern overlay visible
2. **Left nameplate** has deeper gradient (55% height), bigger role badges with glow, bigger stat chips
3. **Dossier header** has accent-colored border + gradient background, bigger nickname (text-3xl)
4. **Career metrics** use Phase 1 `card-metric` / `card-metric-accent` classes
5. **Tab navigation** is visually stronger with bigger padding and bold text
6. **Team card** in header has team-colored pill badge

## What Was NOT Changed (Honest)

- Achievements tab: still same timeline structure (no major visual overhaul)
- Awards tab: still same grouped cards
- Statistics tab: still same bar charts
- Team History tab: same layout
- Mobile responsive: not tested in this pass
- Left poster photo sizing: unchanged (layoutId + existing photo handling)

## Validation

- `npm run lint`: **PASS**
- `npm run build`: **PASS** (11.98s)

## Known Limitations

- Achievements/Awards/Statistics tabs are already reasonable from previous iterations — further overhaul would require full section rewrites
- Photo quality depends on playerPhotoOverrides configuration
- Mobile layout was not manually tested in this pass
- No earnings bar chart visualization (data availability varies)

## Report Path

`reports/ui-ux-phase-2-real-visual-delta-report.md`
