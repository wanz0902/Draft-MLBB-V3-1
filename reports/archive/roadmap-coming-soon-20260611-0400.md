# Report: Enhance RoadmapSection with Coming Soon Features

## A. Ringkasan task
Menambahkan 5 fitur "Coming Soon" baru ke RoadmapSection, memperbarui timeline milestones, dan menambahkan teaser "many more" di bagian akhir.

## B. Perubahan yang dilakukan
1. **Import icons baru** dari lucide-react: `Video`, `Smartphone`, `Radio`, `DollarSign`, `Gamepad2`, `Sparkles`
2. **Menambahkan `COMING_SOON` array** (line 95-126) berisi 5 fitur baru:
   - Auto Clip Generator (Video, rose)
   - Account Marketplace (DollarSign, amber)
   - Team Scrim Analyzer (Gamepad2, cyan)
   - Live Match Integration (Radio, violet)
   - Mobile App (Smartphone, emerald)
3. **Menambahkan rendering section** (line 185-232) untuk 5 kartu coming soon dengan:
   - Dashed border, `bg-[#fafbfe]`, opacity-70
   - Numbered step indicators (4-8)
   - Color-coded icon boxes per fitur
   - "Coming Soon" badge dengan Clock icon
   - Motion animations (fade + slide)
4. **Menambahkan teaser** "And many more features coming every update..." dengan Sparkles icon dan animate-pulse
5. **Memperbarui `Q_MILESTONES`** dari 4 item menjadi 7 item:
   - Q1: Manual Draft, Q2: AI Coach, Q3: Pro War Room
   - Q4: Auto Clip, Q1 '26: Scrim Tool, Q2 '26: Live Draft, Q3 '26: Mobile App
6. **Timeline bar** diperbesar dari `max-w-2xl` ke `max-w-3xl` untuk mengakomodasi 7 milestone

## C. File yang diubah
- `src/landing/components/RoadmapSection.tsx` (171 → 256 baris)

## D. Verifikasi data/source yang relevan
Tidak berubah / tidak disentuh. Tidak ada perubahan data hero atau API.

## E. Perubahan UI
- 5 kartu coming soon baru dengan dashed border dan icon berwarna
- Timeline bar lebih panjang dengan 7 milestone
- Teaser "And many more..." dengan animasi pulse di akhir section

## F. Validasi teknis
- `tsc --noEmit`: ✅ clean (no errors)
- `npm run build`: ✅ success

## G. Localhost status
Not checked (no dev server started).

## H. Commit hash + commit message
belum commit

## I. Best-effort resource summary
- Model: mimo-v2.5-pro
- Estimated tokens: ~8k (read + edits + verification)
- Elapsed time: ~3 menit

## J. Catatan
- Dynamic Tailwind classes (`border-${feat.color}-200`, `bg-${feat.color}-50`) mengikuti pattern yang sudah ada di `ProWarRoomPreview`. Jika warna tidak render di production, perlu safelist di tailwind config.
