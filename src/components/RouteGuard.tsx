import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/auth";

function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-16 w-16">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-20" />
          <div className="relative rounded-full h-16 w-16 bg-[var(--bg-card)] border border-cyan-500/35 flex items-center justify-center shadow-lg shadow-cyan-500/15">
            <div className="h-6 w-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
        <div className="text-center">
          <h3 className="font-sans text-md font-bold text-[var(--text-primary)] tracking-tight">MVP Draft</h3>
          <p className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest mt-1">Verifying session...</p>
        </div>
      </div>
    </div>
  );
}

interface RouteGuardProps {
  children: React.ReactNode;
  guestOnly?: boolean;
  incompleteProfileOnly?: boolean;
}

export function RouteGuard({ children, guestOnly, incompleteProfileOnly }: RouteGuardProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AuthLoadingScreen />;

  if (guestOnly && user) {
    if (!user.profile_completed) {
      return <Navigate to="/complete-profile" replace />;
    }
    return <Navigate to="/app" replace />;
  }

  if (incompleteProfileOnly && user) {
    if (user.profile_completed) {
      return <Navigate to="/app" replace />;
    }
  }

  if (incompleteProfileOnly && !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <AuthLoadingScreen />;

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center max-w-sm mx-auto p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
            <svg className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Login diperlukan</h2>
          <p className="text-sm text-slate-400 mb-6">Halaman ini memerlukan akun. Masuk atau buat akun untuk melanjutkan.</p>
          <div className="flex flex-col gap-2.5">
            <Navigate to={`/login?returnTo=${encodeURIComponent(location.pathname)}`} replace />
          </div>
        </div>
      </div>
    );
  }

  if (!user.profile_completed) {
    if (location.pathname !== "/complete-profile") {
      return <Navigate to="/complete-profile" replace />;
    }
  }

  return <>{children}</>;
}
