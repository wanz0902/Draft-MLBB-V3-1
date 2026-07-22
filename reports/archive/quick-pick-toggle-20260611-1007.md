# Kilo Report — Quick Pick Section + All Heroes Drawer

## A. Ringkasan Task
Menambahkan fitur **Quick Pick / All Heroes toggle** di hero grid DraftSimulator untuk mengurangi scroll. Default view menampilkan 30 hero pertama, dengan opsi "Show All" untuk membuka full grid.

## B. Perubahan yang Dilakukan
1. **State baru** `showQuickPick` (default `true`) ditambahkan di line 231.
2. **Toggle button** "Quick Pick" / "All Heroes (N)" ditambahkan setelah filter chips (line 2343-2357).
3. **`renderHeroCard` helper** diekstrak ke fungsi terpisah (line 1630) agar hero card JSX tidak duplikat.
4. **Hero grid** di-wrap dalam conditional:
   - `showQuickPick=true`: render `sortedHeroesList.slice(0, 30)` + "Show All" button
   - `showQuickPick=false`: render full `sortedHeroesList`

## C. File yang Diubah
- `src/components/DraftSimulator.tsx`

## D. Verifikasi Data/Source
Tidak berubah / tidak disentuh (tidak ada perubahan data/hero/API).

## E. Perubahan UI
- Toggle bar "Quick Pick | All Heroes (N)" muncul di bawah filter chips
- Quick Pick mode: grid 30 hero pertama + dashed "Show All N Heroes" button
- All Heroes mode: full grid (behavior lama)

## F. Validasi Teknis
- `tsc --noEmit`: ✅ pass (0 errors)
- `vite build`: ✅ pass (built in ~19s)

## G. Localhost Status
Not checked in this task.

## H. Commit Status
belum commit

## I. Resource Summary
- Model: mimo-v2.5-pro
- Estimated tokens: ~25k input + ~5k output
- Elapsed time: ~3 minutes

## J. Catatan
- Hero card JSX di-exact-clone ke `renderHeroCard` — zero logic change
- `handleSelectHero`, filtering, sorting, pick/ban validation: tidak disentuh
- Quick Pick limit: 30 heroes (dapat di-adjust dengan mengubah `.slice(0, 30)`)
