# Laporan: Draft Pick Hero Deck Command Board Rebuild

**Tanggal:** 2026-06-11 10:25 WIB  
**Status:** Selesai  
**Build:** Berhasil (vite build, 2808 modules, 33.33s)  
**Typecheck:** 0 errors

---

## A. Mengapa Hasil Sebelumnya Ditolak

1. "Show All 132 Heroes" bukan solusi — hanya menyembunyikan masalah
2. Hero grid masih terasa seperti catalog panjang
3. Quick Pick / All Heroes toggle masih pendekatan grid biasa

## B. Solusi: Hero Deck Command Board dengan Pagination

### Konsep Baru
Hero selection menggunakan **paginated deck** — seperti kartu deck yang di-flip halaman.

- **24 heroes per halaman** (bukan 30 atau 132)
- **Prev / Next navigation** dengan page indicator
- **Auto-reset** ke page 1 saat filter berubah
- **Grid density ditingkatkan**: `xl:grid-cols-6` (dari 5)
- **"Show All" toggle dihapus** — diganti deck navigation

### User Experience
1. User melihat 24 heroes (deck page 1)
2. Bisa search/filter — grid otomatis update
3. Bisa klik "Next →" untuk lihat heroes berikutnya
4. Page indicator: "132 heroes · Page 1 of 6"
5. Semua heroes tetap accessible — tanpa scroll panjang

## C. Perubahan yang Dilakukan

| # | Change | Before | After |
|---|--------|--------|-------|
| 1 | State | `showQuickPick` boolean | `deckPage` number + `DECK_PAGE_SIZE = 24` |
| 2 | Computed | — | `totalDeckPages` + `deckHeroes` (paginated slice) |
| 3 | Filter reset | — | `useEffect` resets `deckPage` to 1 on 8 filter changes |
| 4 | Toggle bar | "Quick Pick / All Heroes" buttons | Pagination bar: Prev/Next + page info |
| 5 | Hero grid | Conditional showQuickPick | Single `deckHeroes.map(renderHeroCard)` |
| 6 | Grid density | `xl:grid-cols-5` | `xl:grid-cols-6` |

## D. File yang Diubah

| File | Change |
|------|--------|
| `src/components/DraftSimulator.tsx` | Hero Deck pagination, removed showQuickPick |

## E. Logic yang TIDAK Disentuh

- `renderHeroCard` — hero card rendering
- `handleSelectHero` — hero selection
- `handleLockHero` — pick/ban state mutation
- `sortedHeroesList` — hero filtering/sorting
- `DRAFT_SEQUENCE` — draft order
- All draft engine files

## F. Validasi Teknis

- `tsc --noEmit`: **0 errors** ✅
- `vite build`: **Success** (33.33s, 2808 modules) ✅
- `grep showQuickPick`: **0 occurrences** ✅

## G. Checklist

- [x] "Show All Heroes" removed
- [x] Hero Deck pagination (24 per page)
- [x] Prev / Next navigation
- [x] Page indicator ("Page 1 of 6")
- [x] Hero count ("132 heroes")
- [x] Auto-reset on filter change
- [x] Grid density improved (xl: 5→6 cols)
- [x] All heroes accessible via pagination
- [x] No long page scroll
- [x] Pick/ban logic intact
- [x] Typecheck passes
- [x] Build passes

## H. Commit Status

Belum commit.

## I. Catatan

- `showQuickPick` state dan semua referensinya dihapus
- `deckPage` dimulai dari 1 (bukan 0)
- `DECK_PAGE_SIZE = 24` — sweet spot antara density dan readability
- `totalDeckPages` dihitung otomatis dari `sortedHeroesList.length / DECK_PAGE_SIZE`
- Filter reset via `useEffect` — 8 dependency (searchQuery, roleFilter, laneFilter, tierFilter, recommendedOnly, counterOnly, synergyOnly, comfortOnly)
- `xl:grid-cols-6` memberikan density lebih baik dari sebelumnya (5 kolom)
