# Kilo Report — Code Skeptic 5 Must-Fix Issues

## A. Ringkasan Task
Fix 5 must-fix issues identified by Code Skeptic: viewport margin, reduced motion inconsistency, pricing CTA targets, missing ARIA, unequal card heights.

## B. Perubahan yang Dilakukan

### Fix 1: VIEWPORT margin (`landingAnimations.ts`)
- Changed margin `"0px 0px -100px 0px"` → `"0px 0px -50px 0px"` (less aggressive, animations trigger earlier)

### Fix 2: Reduced motion inconsistency (`PricingSection.tsx`)
- Removed `useReducedMotion` import and hook call
- Removed all `reducedMotion ? false : ...` / `reducedMotion ? undefined : ...` guards on 4 animation blocks
- Now matches pattern of all other sections (plain `initial`/`whileInView`)

### Fix 3: Elite CTA target (`pricingData.ts`)
- Starter: `ctaTarget: "draft"` (unchanged)
- Pro: `ctaTarget: "draft"` (unchanged)
- Elite: `ctaTarget: "draft"` → `ctaTarget: "intelligence"`

### Fix 4: Missing ARIA (`PricingSection.tsx`)
- Added `aria-labelledby="pricing-title"` to `<section>`
- Added `id="pricing-title"` to `<h2>`
- Added `role="list"` to pricing grid div
- Added `role="listitem"` to each card `motion.div`

### Fix 5: Unequal card heights (`PricingSection.tsx`)
- Added `flex flex-col` to each card's `motion.div` className
- Added `flex-1` to features `<ul>`
- Wrapped CTA button in `<div className="mt-auto">` to push to bottom

## C. File yang Diubah
- `src/landing/constants/landingAnimations.ts` — 1 line changed
- `src/landing/constants/pricingData.ts` — 1 line changed
- `src/landing/components/PricingSection.tsx` — removed hook, added ARIA, added flex layout

## D. Verifikasi Data/Source
Tidak berubah / tidak disentuh (no hero data or API changes).

## E. Perubahan UI
- Animations trigger slightly earlier due to reduced viewport margin
- All pricing cards now equal height with CTA buttons aligned to bottom
- Screen reader users get proper list semantics on pricing section

## F. Validasi Teknis
- `npm run build` — passed
- No `typecheck` script available

## G. Localhost Status
Not checked (code-only changes).

## H. Commit Hash
belum commit

## I. Resource Summary
Model: mimo-v2.5-pro | Elapsed: ~1 min | 3 file edits, 1 build verification

## J. Catatan
- No typecheck script in package.json; build passes as proxy validation
- `useReducedMotion` hook file still exists but is now unused in PricingSection
