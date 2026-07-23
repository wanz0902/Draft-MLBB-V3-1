# Laporan Task — Guest App Preview + Action-Level Auth Gating

## A. Ringkasan task
Mengubah flow Landing Page → Launch App. Sebelumnya guest langsung diarahkan ke /login. Sekarang guest masuk ke /app dalam Preview Mode, dapat menjelajahi platform secara read-only, dan saat mencoba action utama muncul Auth Required dialog.

## B. Root cause Launch App membuka Login
RouteGuard di `src/components/RouteGuard.tsx` membungkus SEMUA route `/app/*` dengan `requireAuth`:
```tsx
<Route element={<RouteGuard requireAuth><AppShell /></RouteGuard>}>
```
Ketika user null (guest), `requireAuth` redirect ke `/login`. Ini menyebabkan Launch App selalu meminta login.

## C. Perubahan yang dilakukan

### 1. Route Architecture Refactoring (`src/App.tsx`)
- **SEBELUM**: `<Route element={<RouteGuard requireAuth><AppShell /></RouteGuard>}>` — semua route butuh login
- **SESUDAH**: `<Route element={<AppShell />}>` — AppShell tanpa auth guard, route preview terbuka untuk guest
- Protected routes dibungkus `<ProtectedRoute>` secara individual: `/profile/*`, `/settings/*`, `/events/my-squad`, `/events/history`, `/app/admin-tools`

### 2. RouteGuard Refactoring (`src/components/RouteGuard.tsx`)
- Prop `requireAuth` dihapus (tidak digunakan lagi)
- `ProtectedRoute` baru ditambahkan — redirect guest ke halaman "Login diperlukan" dengan navigasi ke `/login?returnTo=...`
- `guestOnly` dan `incompleteProfileOnly` tetap dipertahankan

### 3. Auth Required Dialog System (NEW)
**File baru:**
- `src/components/auth/AuthRequiredContext.tsx` — Context provider untuk dialog state
- `src/components/auth/AuthRequiredDialog.tsx` — Modal dialog accessible (focus trap, Escape close, backdrop click, aria-modal, body scroll lock)
- `src/lib/useRequireAuth.ts` — Reusable hook: `requireAuth({ action, returnTo, onAuthenticated })`

**Behavior:**
- Jika user login → onAuthenticated() dipanggil langsung
- Jika guest → dialog terbuka dengan action description dinamis
- Dialog memiliki 3 tombol: Sign In, Create Account, Continue Preview

### 4. AppShell Guest Mode (`src/components/AppShell.tsx`)
- Topbar saat guest: Preview Mode badge (cyan) + Sign In button + Create Account button
- Topbar saat authenticated: Online badge + Users badge (tetap seperti sebelumnya)
- Import `useAuth` dan `useNavigate` untuk guest detection dan navigation

### 5. AppSidebar Guest Mode (`src/components/navigation/AppSidebar.tsx`)
- **Expanded sidebar footer**: Guest area dengan icon User, "Guest Preview" label, "Sign in to unlock features", tombol Sign In dan Create
- **Compact sidebar footer**: Tombol LogIn icon menggantikan avatar profile
- **Mobile drawer footer**: Guest area expanded dengan Sign In dan Create buttons
- Import: `LogIn`, `UserPlus`, `User` icons, `useNavigate`

### 6. AppDashboard Guest Preview (`src/pages/app/AppDashboard.tsx`)
- **SEBELUM**: `if (!user) return null;` — guest melihat halaman kosong
- **SESUDAH**: Guest melihat preview dashboard dengan:
  - Hero artwork background (dekoratif)
  - "Preview Mode" badge
  - "Explore MVP Draft" heading
  - Deskripsi platform
  - 3 CTA buttons: Explore Draft, Browse Heroes, View Community
  - Guest Preview notice text
  - Prize Fund preview panel (Coming Soon)

### 7. ReturnTo Flow — Login (`src/pages/auth/LoginPage.tsx`)
- Baca `returnTo` dari query params: `/login?returnTo=/app/draft`
- Validasi route internal (startsWith `/`, bukan `//`, bukan protocol URL)
- Setelah login berhasil → navigate ke returnTo
- Google OAuth → simpan returnTo ke `sessionStorage("mvp-auth-return-to")`
- Link "Create one" mempertahankan returnTo

### 8. ReturnTo Flow — Register (`src/pages/auth/RegisterPage.tsx`)
- Baca `returnTo` dari query params
- Setelah register berhasil → navigate ke returnTo
- Google OAuth → simpan returnTo ke sessionStorage
- Link "Sign In" mempertahankan returnTo

### 9. ReturnTo Flow — CompleteProfile (`src/pages/auth/CompleteProfilePage.tsx`)
- Baca returnTo dari `sessionStorage("mvp-auth-return-to")` (disimpan oleh LoginPage/RegisterPage sebelum Google OAuth)
- Setelah profile complete → navigate ke returnTo
- Hapus key dari sessionStorage setelah digunakan
- Fallback ke `/app` jika returnTo invalid

### 10. Google OAuth Redirect Handler (`src/App.tsx`)
- Komponen `GoogleOAuthRedirectHandler` — useEffect yang check sessionStorage saat user login
- Jika ada saved returnTo dan user baru saja login (pathname === "/app") → redirect ke returnTo
- Bersihkan sessionStorage setelah redirect

## D. PreviewRoute Map (Guest boleh akses)
| Route | Status |
|-------|--------|
| `/app` | Preview — guest dashboard |
| `/app/draft` | Preview — read-only draft board |
| `/app/heroes` | Preview — public hero data |
| `/app/hero-intelligence` | Preview — public hero data |
| `/app/data` | Preview — public item data |
| `/app/live-matches` | Preview — public match data |
| `/app/draft-planner` | Preview — read-only planner |
| `/app/counters` | Preview — public counter data |
| `/app/macro` | Preview — read-only macro planner |
| `/app/teams` | Preview — public team data |
| `/app/meta` | Preview — public meta data |
| `/app/pro` | Preview — public Liquipedia data |
| `/community/*` | Preview — public community layout |
| `/events/community-cup` | Preview — public event page |
| `/services/*` | Preview — public services catalog |

## E. ProtectedRoute Map (Butuh login)
| Route | Status |
|-------|--------|
| `/profile/*` | Protected — Redirect ke /login?returnTo= |
| `/settings/*` | Protected — Redirect ke /login?returnTo= |
| `/events/my-squad` | Protected — personal squad |
| `/events/history` | Protected — personal history |
| `/app/admin-tools` | Protected — admin only |

## F. Private API Safety
- SharedDataProvider tetap fetch public APIs: `/api/hero-stats`, `/api/assets`, `/api/team-stats`, `/api/items`
- `/api/history` di-fetch tapi diabaikan jika gagal (catch block)
- Tidak ada personal API yang dipanggil saat guest
- Guest dashboard tidak menampilkan data personal (BabyBrezzy, UID, avatar, membership)

## G. Logout Behavior
- `useAuth().logout()` sudah tersedia — set user ke null
- Setelah logout, user tetap di route aktif dalam Guest Preview Mode
- Sidebar dan topbar otomatis switch ke guest mode (karena depends on `user` state)
- Tidak ada stale data karena SharedDataProvider uses public data only

## H. Files changed
| File | Type |
|------|------|
| `src/App.tsx` | Modified — route architecture, AuthRequiredProvider, GoogleOAuthRedirectHandler |
| `src/components/RouteGuard.tsx` | Modified — removed requireAuth, added ProtectedRoute |
| `src/components/AppShell.tsx` | Modified — guest topbar with preview badge + auth buttons |
| `src/components/navigation/AppSidebar.tsx` | Modified — guest footer in all sidebar modes |
| `src/pages/app/AppDashboard.tsx` | Modified — guest preview dashboard content |
| `src/pages/auth/LoginPage.tsx` | Modified — returnTo flow |
| `src/pages/auth/RegisterPage.tsx` | Modified — returnTo flow |
| `src/pages/auth/CompleteProfilePage.tsx` | Modified — returnTo from sessionStorage |
| `src/components/auth/AuthRequiredContext.tsx` | NEW — context provider |
| `src/components/auth/AuthRequiredDialog.tsx` | NEW — accessible modal dialog |
| `src/lib/useRequireAuth.ts` | NEW — reusable auth gate hook |

## I. Validasi teknis
- `npx tsc --noEmit` — passed (0 errors)
- `npx vite build` — passed (12.15s)

## J. Known limitations
1. **Action-level gating belum di-integrasikan ke semua halaman** — `useRequireAuth` hook tersedia dan siap digunakan, tapi belum di-pass ke DraftSimulator, GlobalChat, dll. Perlu penambahan manual di setiap halaman yang punya action button.
2. **Google OAuth redirect path bergantung pada backend** — Jika server redirect ke path selain `/app`, handler perlu disesuaikan.
3. **SharedDataProvider fetch `/api/history`** — endpoint ini mungkin memerlukan auth. Saat ini error di-catch dan diabaikan, tapi bisa menghasilkan error di console.

## K. Manual test checklist
| Test | Expected |
|------|----------|
| `/` → Launch App | Masuk `/app` (bukan `/login`) |
| Guest `/app` | Preview dashboard terlihat, ada badge "Preview Mode" |
| Guest sidebar | Footer menampilkan "Guest Preview" + Sign In/Create |
| Guest topbar | Preview Mode badge + Sign In + Create Account buttons |
| Guest klik Draft Now di sidebar | Buka `/app/draft` (read-only) |
| Guest klik /profile | Redirect ke login page dengan returnTo |
| `/login?returnTo=/app/draft` → login | Kembali ke `/app/draft` |
| `/register?returnTo=/app/community` → register | Kembali ke `/app/community` |
| Google OAuth | returnTo disimpan di sessionStorage, redirect setelah login |
| Complete Profile | Baca returnFrom sessionStorage, redirect setelah selesai |
| Auth Required dialog | Focus trap, Escape close, backdrop click close |

## L. Catatan
- Landing page CTA sudah menuju `/app` (bukan `/login`) — `enterApp()` di `src/landing/integration.ts` memanggil `navigate("/app/draft")` yang sekarang bisa diakses guest
- Tidak ada perubahan pada backend, database, migration, membership price, atau Prize Fund formula
- Tidak ada perubahan pada sidebar redesign yang sedang dikembangkan
- Status: **PARTIAL** — Core infrastructure selesai, action-level gating perlu integrasi ke halaman spesifik
