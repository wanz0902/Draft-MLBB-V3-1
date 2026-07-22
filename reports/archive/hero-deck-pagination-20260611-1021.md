# Laporan Task — Replace Quick Pick / Show All with Hero Deck Pagination

**Tanggal:** 2026-06-11 10:21 WIB
**Task:** Replace Quick Pick / Show All toggle with paginated hero deck navigation
**File:** `src/components/DraftSimulator.tsx`

---

## A. Ringkasan Task
Mengganti fitur "Quick Pick / All Heroes" toggle dengan sistem pagination (navigasi halaman) pada hero grid di DraftSimulator. Tujuan: menampilkan hero dalam halaman-halaman 24 hero per page, bukan mode show/hide.

## B. Perubahan yang Dilakukan

1. **State `showQuickPick` dihapus** → diganti `deckPage` (number) + `DECK_PAGE_SIZE = 24`
2. **Computed values ditambahkan:**
   - `totalDeckPages` — jumlah halaman berdasarkan filtered heroes
   - `deckHeroes` — slice 24 hero untuk halaman aktif
3. **`useEffect` reset** — `deckPage` di-reset ke 1 saat filter berubah (searchQuery, roleFilter, laneFilter, tierFilter, recommendedOnly, counterOnly, synergyOnly, comfortOnly)
4. **Toggle bar diganti** — "Quick Pick / All Heroes" button → pagination bar dengan "← Prev" / "Next →" + info "Page X of Y"
5. **Hero grid rendering** — sebelumnya conditional `showQuickPick ? slice(0,30) : full` → sekarang selalu render `deckHeroes` (paginated)
6. **Grid breakpoint** — `xl:grid-cols-5` → `xl:grid-cols-6` untuk densitas lebih baik

## C. File yang Diubah
- `src/components/DraftSimulator.tsx`

## D. Verifikasi Data/Source
Tidak berubah / tidak disentuh — hero data, API, dan computed `sortedHeroesList` tidak diubah.

## E. Perubahan UI
- **Dihilangkan:** tombol "Quick Pick" dan "All Heroes (N)" + "Show All N Heroes" dashed button
- **Ditambahkan:** pagination bar di atas hero grid — menampilkan jumlah hero, halaman aktif, tombol Prev/Next
- Hero grid sekarang selalu menampilkan max 24 hero per halaman

## F. Validasi Teknis
- `npx tsc --noEmit` — ✅ passed, 0 errors

## G. Localhost Status
Tidak dicek (code change only, tidak ada server-side impact).

## H. Commit
Belum commit.

## I. Resource Summary
- Model: mimo-v2.5-pro
- Estimasi tokens: ~15k (context reading + edits)
- Elapsed: ~2 menit

## J. Catatan
- `renderHeroCard` tidak diubah — hero selection logic tetap sama
- Hero pick/ban validation tidak diubah
- `sortedHeroesList` computation tidak diubah — hanya display layer yang berubah
- Semua referensi `showQuickPick` sudah dihapus (verified via grep)
