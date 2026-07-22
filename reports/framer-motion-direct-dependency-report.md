# Framer Motion Direct Dependency Report

**Tanggal:** Jumat, 20 Juni 2026, pukul 23:00 WIB

## Task

Add `framer-motion@12.40.0` as a direct dependency to make `import { motion } from "framer-motion"` safe for future tasks.

## Before

```
npm ls framer-motion:
`-- motion@12.40.0
    `-- framer-motion@12.40.0
```

- `framer-motion` was transitive only
- package.json: `"motion": "^12.23.24"` (direct), no `framer-motion` entry

## After

```
npm ls framer-motion:
+-- framer-motion@12.40.0
`-- motion@12.40.0
    `-- framer-motion@12.40.0 deduped
```

- `framer-motion@12.40.0` is now direct dependency (deduped)
- package.json: `"framer-motion": "^12.40.0"` (direct) + `"motion": "^12.23.24"` (direct)

## Validation

- `npm run lint`: **PASS** (tsc --noEmit, zero errors)
- `npm run build`: **PASS** (24.52s, 2987 modules)

## Changes

| File | Change |
|---|---|
| `package.json` | Added `"framer-motion": "^12.40.0"` to dependencies |
| `package-lock.json` | Updated with framer-motion direct entry + deduped |

## Warnings

- Chunk-size warning (2,421 kB > 500 kB) — pre-existing, unrelated

## Result

`framer-motion` is now a direct dependency. All `import { motion } from "framer-motion"` statements across 19+ files resolve safely.

---

**Report path:** `reports/framer-motion-direct-dependency-report.md`
