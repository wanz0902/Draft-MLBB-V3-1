# PROMPT: Pro Player Card + Detail Animation (Butss Only)

MODE: SAFE IMPLEMENTATION — FRAMER MOTION ANIMATIONS FOR PRO PLAYER

Project: D:\PROJECT VS CODE\mlbb draft v2
File: src/components/LiquipediaDatabase.tsx

Task: Tambahkan Framer Motion animations ke Pro Player cards dan detail drawer. Test hanya di Butss.

Working folder: D:\PROJECT VS CODE\mlbb draft v2

Rules:
- Jangan worktree, clone, commit, push
- Jangan sentuh: AI lock, Draft Pick, Landing Page, HeroFullPage, HeroStats
- HANYA edit: src/components/LiquipediaDatabase.tsx
- Jangan ubah data logic, API calls, types/interfaces
- Hanya tambah VISUAL ANIMATION

==================================================
INSPECT FIRST
==================================================

Read LiquipediaDatabase.tsx.
Find:
- PlayerPreviewCard component
- PlayerDetailDrawer component
- How card click triggers detail (setSelectedPlayer)
- How detail closes (onClose / setSelectedPlayer(null))
- Existing framer-motion imports

Do NOT rely on old line numbers.

==================================================
ANIMATION 1: SHARED LAYOUT TRANSITION (Card → Detail)
==================================================

Ini adalah animation paling penting — bikin terasa "iOS app feel".

Concept:
Ketika user klik card, photo + name "terbang" dari card ke detail page.
Ketika close, reverse animation — detail ke card.

Implementation:

1. Di PlayerPreviewCard:
   Bungkus photo dan name dengan motion.div yang punya layoutId:

   {/* Photo */}
   <motion.div
     layoutId={`player-photo-${person.id}`}
     className="relative w-full aspect-[3/4] overflow-hidden bg-[#0d1225]"
   >
     <img ... />
   </motion.div>

   {/* Name */}
   <motion.h3
     layoutId={`player-name-${person.id}`}
     className="text-xl sm:text-2xl font-black text-white"
     style={{ fontFamily: "var(--font-display)" }}
   >
     {person.nickname}
   </motion.h3>

2. Di PlayerDetailDrawer:
   pakai layoutId yang SAMA untuk photo dan name:

   {/* Hero Header Photo */}
   <motion.div
     layoutId={`player-photo-${person.id}`}
     className="relative h-64 sm:h-72 w-full overflow-hidden"
   >
     <img ... />
   </motion.div>

   {/* Nickname */}
   <motion.h2
     layoutId={`player-name-${person.id}`}
     className="text-3xl sm:text-4xl font-black text-white"
     style={{ fontFamily: "var(--font-display)" }}
   >
     {person.nickname}
   </motion.h2>

3. Di main render (antara grid dan drawer):
   Wrap selectedPlayer rendering dengan AnimatePresence:

   <AnimatePresence mode="wait">
     {selectedPlayer && (
       <PlayerDetailDrawer
         key={selectedPlayer.id}
         person={selectedPlayer}
         matchedTeam={findTeamForPlayer(selectedPlayer, allTeams)}
         allTeams={allTeams}
         onClose={() => setSelectedPlayer(null)}
       />
     )}
   </AnimatePresence>

==================================================
ANIMATION 2: HOVER EFFECTS (Cards)
==================================================

Di PlayerPreviewCard, tambah:

a) Card hover — scale + lift + glow:
   Bungkus outer button dengan motion.div:

   <motion.div
     whileHover={{ scale: 1.03, y: -6 }}
     whileTap={{ scale: 0.98 }}
     transition={{ type: "spring", stiffness: 400, damping: 25 }}
   >
     <button className="... group" onClick={onClick}>
       ... existing content ...
     </button>
   </motion.div>

b) Photo hover — subtle zoom:
   Di img tag, tambah class:
   className="... transition-transform duration-500 group-hover:scale-110"

c) Border glow — role color on hover:
   Di button className, tambah:
   hover:shadow-[0_8px_30px_-5px_var(--accent)]

   Atau pakai inline style:
   style={{
     "--accent": accent,
   }}
   className="... hover:shadow-[0_8px_30px_-5px_rgba(var(--accent-rgb),0.25)]"

d) "View Profile" text — slide arrow:
   ChevronRight icon: group-hover:translate-x-1 transition-transform

==================================================
ANIMATION 3: DETAIL DRAWER ENTRANCE
==================================================

Di PlayerDetailDrawer wrapper:

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
  className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto py-8 px-4"
  onClick={onClose}
>
  {/* Backdrop */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/70 backdrop-blur-sm"
  />

  {/* Modal content */}
  <motion.div
    initial={{ opacity: 0, y: 40, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 20, scale: 0.97 }}
    transition={{ type: "spring", stiffness: 350, damping: 30 }}
    className="relative w-full max-w-2xl ..."
    onClick={(e) => e.stopPropagation()}
  >
    ... existing content ...
  </motion.div>
</motion.div>

==================================================
ANIMATION 4: SECTION STAGGER (Detail)
==================================================

Di PlayerDetailDrawer body sections:

Buat helper function:
const sectionStagger = (i: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.2 + i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] },
});

Terapkan ke setiap section:
<motion.div {...sectionStagger(0)}> {/* Quick Stats */} </motion.div>
<motion.div {...sectionStagger(1)}> {/* Player Info */} </motion.div>
<motion.div {...sectionStagger(2)}> {/* Trivia */} </motion.div>
... dst

==================================================
ANIMATION 5: EARNINGS BAR CHART ANIMATE
==================================================

Di earnings bars:

<motion.div
  initial={{ width: 0 }}
  animate={{ width: `${(e.amount / maxEarning) * 100}%` }}
  transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
/>

==================================================
ANIMATION 6: ACHIEVEMENT ROWS STAGGER
==================================================

Di achievements table rows:

{placements.map((p, i) => (
  <motion.tr
    key={i}
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.3 + i * 0.04, duration: 0.3 }}
    className="hover:bg-white/[0.03]"
  >
    ... existing cells ...
  </motion.tr>
))}

==================================================
IMPORTS YANG PERLU
==================================================

Pastikan ini sudah di-import:
import { motion, AnimatePresence } from "framer-motion";

Jika belum, tambah ke import statement.

==================================================
YANG TIDAK BERUBAH
==================================================

- Data logic, API calls, types
- PlayerPreviewCard layout/structure
- PlayerDetailDrawer content
- TeamPreviewCard, TeamDetailDrawer
- Filter system, search
- Pagination

==================================================
VALIDATION
==================================================

1. npm run lint
2. npm run build
3. localhost:3001 → Data → Pro Database
4. Cek:
   - Hover card: scale + lift + glow effect
   - Klik Butss: shared layout transition (photo + name terbang ke detail)
   - Detail entrance: smooth fade + spring
   - Detail sections: staggered entrance
   - Earnings bars: animate dari 0 ke value
   - Achievement rows: staggered fade-in
   - Close: reverse animation (detail ke card)
   - ESC key menutup
   - Tidak ada layout jump atau flicker

==================================================
REPORT
==================================================

Update reports/latest-kilo-report.md.
