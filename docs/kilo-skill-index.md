# Kilo Skill Index — MLBB Draft Simulator

## Purpose

This index lists all available skill books and references for future Kilo AI coding tasks. Read the required order before starting any visual/design task.

## Required Reading Order

| Order | File | What It Is |
|---|---|---|
| 1 | `AGENTS.md` | Project rules — always read first |
| 2 | `docs/kilo-skill-index.md` | This file — what books exist |
| 3 | Context7 (external) | External reference docs — only when needed |
| 4 | `docs/ui-ux-pro-max-skill-book.md` | Design / UI UX Pro Max book |
| 5 | `docs/framer-motion-skill-book.md` | Animation / Framer Motion book |
| 6 | `reports/latest-kilo-report.md` | Current state / last task status |

## Rules

- Always follow `AGENTS.md` first.
- Always check `reports/latest-kilo-report.md` before coding.
- Use UI UX Pro Max book for layout/design decisions.
- Use Framer Motion presets from `src/lib/motionPresets.ts` before creating custom animation.
- Use Context7 only as external docs/reference when needed.
- If using external docs/reference, explicitly write in the report: "Saya baca buku/referensi: [source name]"
- Do not redesign or rewrite major features unless user explicitly asks.
- If a referenced book is missing, report it clearly.

## Books

### AGENTS.md
- Project rules and coding guidelines
- Always read first before any task

### docs/ui-ux-pro-max-skill-book.md
- Premium esports design direction
- Design system classes (card-metric, stat-bar, etc.)
- Motion presets usage
- Phase implementation status

### docs/framer-motion-skill-book.md
- 15 reusable animation presets from `src/lib/motionPresets.ts`
- Import examples, usage patterns
- Rules for safe animation in the project

### Context7 (External)
- Not a local file — external docs reference
- Use only when specific API/framework docs are needed
- Always cite: "Saya baca buku/referensi: Context7 [library]"

### reports/latest-kilo-report.md
- Current state of the project
- What was last changed
- Which tasks are complete/in-progress

## Report Files

- `reports/framer-motion-skill-setup-report.md` — Framer Motion setup
- `reports/latest-kilo-report.md` — Current project state
