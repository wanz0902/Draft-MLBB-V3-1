# Kilo Report — Pricing Section + Viewport Standardization

## A. Ringkasan Task
Implementasi plan dari Architect: menambahkan PricingSection (3-tier pricing cards Rupiah), standardisasi VIEWPORT constant di semua section components, update navbar/footer dengan Pricing link, dan hapus dead code `useIntersectionReveal`.

## B. Perubahan yang dilakukan

### File baru:
1. **`src/landing/constants/pricingData.ts`** — Data 3 tier pricing (Starter Rp49.000, Pro Rp99.000, Elite Rp179.000) dengan interface `PricingTier`.
2. **`src/landing/components/PricingSection.tsx`** — Komponen section pricing dengan responsive grid, badge "Most Popular" di Pro card, CTA buttons via `enterApp()`, Framer Motion scroll reveal, `useReducedMotion` support.

### File diubah:
3. **`src/landing/constants/landingAnimations.ts`** — Tambah `VIEWPORT` constant (`once: true, margin: "0px 0px -100px 0px"`).
4. **`src/landing/components/LandingPage.tsx`** — Import + insert `<PricingSection />` antara HeroIntelTeaser dan RoadmapSection.
5. **`src/landing/components/LandingNavbar.tsx`** — Tambah `{ label: "Pricing", id: "pricing" }` ke NAV_LINKS.
6. **`src/landing/components/LandingFooter.tsx`** — Tambah `{ label: "Pricing", href: "#pricing" }` ke LINKS.
7. **`src/landing/components/HowItWorksSection.tsx`** — Import VIEWPORT, replace semua inline viewport configs.
8. **`src/landing/components/BanPickPOVSection.tsx`** — Import VIEWPORT, replace semua inline viewport configs.
9. **`src/landing/components/AIAnalysisPreview.tsx`** — Import VIEWPORT, replace semua inline viewport configs.
10. **`src/landing/components/MetaIntelligenceSection.tsx`** — Tambah VIEWPORT ke import existing, replace semua inline viewport configs.
11. **`src/landing/components/FeatureShowcaseGrid.tsx`** — Import VIEWPORT, replace semua inline viewport configs.
12. **`src/landing/components/HeroIntelTeaser.tsx`** — Import VIEWPORT, replace semua inline viewport configs.
13. **`src/landing/components/RoadmapSection.tsx`** — Import VIEWPORT, replace semua inline viewport configs.
14. **`src/landing/components/FinalCTASection.tsx`** — Import VIEWPORT, replace semua inline viewport configs.
15. **`src/landing/components/ProductShowcaseStrip.tsx`** — Import VIEWPORT, replace semua inline viewport configs.

### File dihapus:
16. **`src/landing/hooks/useIntersectionReveal.ts`** — Dead code, tidak ada import lain.

## C. File yang diubah
- `src/landing/constants/pricingData.ts` (baru)
- `src/landing/components/PricingSection.tsx` (baru)
- `src/landing/constants/landingAnimations.ts`
- `src/landing/components/LandingPage.tsx`
- `src/landing/components/LandingNavbar.tsx`
- `src/landing/components/LandingFooter.tsx`
- `src/landing/components/HowItWorksSection.tsx`
- `src/landing/components/BanPickPOVSection.tsx`
- `src/landing/components/AIAnalysisPreview.tsx`
- `src/landing/components/MetaIntelligenceSection.tsx`
- `src/landing/components/FeatureShowcaseGrid.tsx`
- `src/landing/components/HeroIntelTeaser.tsx`
- `src/landing/components/RoadmapSection.tsx`
- `src/landing/components/FinalCTASection.tsx`
- `src/landing/components/ProductShowcaseStrip.tsx`
- `src/landing/hooks/useIntersectionReveal.ts` (deleted)

## D. Verifikasi data/source yang relevan
- Pricing tiers menggunakan data statis (bukan dari API/database), sesuai plan.
- Tidak ada perubahan pada heroes_master.json, API endpoints, atau scraper files.

## E. Perubahan UI
- PricingSection baru: 3 cards (Starter/Pro/Elite) dengan responsive grid (1 col mobile, 3 col desktop).
- Pro card: cyan border, shadow, "Most Popular" badge dengan Sparkles icon.
- Navbar: link "Pricing" ditambah setelah "Roadmap".
- Footer: link "Pricing" ditambah setelah "Roadmap".
- Semua section components sekarang menggunakan VIEWPORT constant yang konsisten.

## F. Validasi teknis
- `npx tsc --noEmit` — PASS (0 errors)
- `npm run build` — PASS (vite build + esbuild server bundle sukses)
- Tidak ada sisa inline `viewport={{ once: true }}` di components.

## G. Localhost status
Tidak di-check (tidak diminta).

## H. Commit hash + commit message
Belum commit.

## I. Best-effort resource summary
- Model: mimo-v2.5-pro
- Files created: 2
- Files modified: 13
- Files deleted: 1
- Build: clean pass

## J. Catatan
- PricingSection menggunakan `bg-[#f7f8fb]` yang match dengan page background.
- VIEWPORT margin `"0px 0px -100px 0px"` lebih agresif dari sebelumnya (`-60px`/`-40px`), artinya animasi trigger lebih awal. Ini memberikan experience yang lebih smooth.
- `useReducedMotion` diintegrasikan di PricingSection — jika user punya reduced motion preference, animation initial states tidak di-set.
- Tidak ada string interpolation di Tailwind classes (static classes only).
