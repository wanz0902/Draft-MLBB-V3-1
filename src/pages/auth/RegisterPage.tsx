import { useState, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle2, AlertTriangle, Search } from "lucide-react";
import { apiUrl } from "../../lib/api";
import AuthLayout from "../../components/AuthLayout";

function validateReturnTo(value: string | null): string {
  if (!value || typeof value !== "string") return "/app";
  if (!value.startsWith("/") || value.startsWith("//") || value.match(/^https?:\/\//)) return "/app";
  return value;
}

type MlbbStep = "idle" | "checking" | "found" | "not_found" | "error";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = useMemo(() => validateReturnTo(searchParams.get("returnTo")), [searchParams]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [mlbbUid, setMlbbUid] = useState("");
  const [mlbbSid, setMlbbSid] = useState("");
  const [mlbbStep, setMlbbStep] = useState<MlbbStep>("idle");
  const [mlbbNickname, setMlbbNickname] = useState("");
  const [mlbbMsg, setMlbbMsg] = useState("");

  const resetMlbb = () => {
    setMlbbStep("idle");
    setMlbbNickname("");
    setMlbbMsg("");
  };

  const handleCheckAccount = async () => {
    if (mlbbStep === "checking" || !mlbbUid.trim() || !mlbbSid.trim()) return;
    setMlbbStep("checking");
    setMlbbMsg("");
    setMlbbNickname("");
    try {
      const res = await fetch(apiUrl("/api/mlbb/check-account"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: mlbbUid.trim(), zoneId: mlbbSid.trim() }),
      });
      const data = await res.json();
      if (data.success && data.valid && data.nickname) {
        setMlbbNickname(data.nickname);
        setMlbbStep("found");
      } else if (data.success && !data.valid) {
        setMlbbStep("not_found");
        setMlbbMsg(data.message || "Akun tidak ditemukan.");
      } else {
        setMlbbStep("error");
        setMlbbMsg(data.message || "Gagal mengecek akun.");
      }
    } catch {
      setMlbbStep("error");
      setMlbbMsg("Tidak dapat terhubung ke server.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
          name,
          mlbb_uid: mlbbUid.trim(),
          mlbb_sid: mlbbSid.trim(),
          mlbb_nickname: mlbbNickname,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Something went wrong.");
        return;
      }
      navigate(returnTo, { replace: true });
    } catch {
      setError("Cannot reach server.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    sessionStorage.setItem("mvp-auth-return-to", returnTo);
    window.location.href = apiUrl("/auth/google");
  };

  const mlbbDisabled = mlbbStep === "found" || mlbbStep === "checking";
  const canSubmit = mlbbStep === "found" && !loading;

  return (
    <AuthLayout
      headline="Join the War Room"
      subheadline="Create your MVP Draft account"
      features={[
        "Full MLBB draft analytics access",
        "Hero intelligence & counter data",
        "Team strategy tools",
      ]}
    >
      <div className="w-full">
        <div className="text-center mb-8">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 font-mono text-sm font-black text-slate-950 shadow-[0_12px_30px_-14px_rgba(56,189,248,0.8)]">
            ML
          </div>
          <h1
            className="text-2xl font-bold text-white tracking-tight"
            style={{ fontFamily: "var(--font-display, system-ui)" }}
          >
            Create Account
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Join MVP Draft to save drafts and unlock features
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08] hover:border-white/20 active:scale-[0.98]"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[10px] text-slate-600 uppercase tracking-widest font-semibold">
            or
          </span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div>
            <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5 font-semibold">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5 font-semibold">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1.5 font-semibold">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              required
              minLength={6}
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30"
            />
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 mt-1">
            <div className="mb-1">
              <span className="text-[11px] text-slate-300 uppercase tracking-wider font-bold">
                MLBB Account
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mb-3">
              Hubungkan akun MLBB untuk melanjutkan registrasi.
            </p>
            <div className="flex flex-wrap items-stretch gap-2.5">
              <input
                type="text"
                value={mlbbUid}
                onChange={(e) => {
                  setMlbbUid(e.target.value);
                  if (mlbbStep !== "idle") resetMlbb();
                }}
                placeholder="User ID"
                disabled={mlbbDisabled}
                className="min-w-0 flex-1 basis-[120px] rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
              />
              <input
                type="text"
                value={mlbbSid}
                onChange={(e) => {
                  setMlbbSid(e.target.value);
                  if (mlbbStep !== "idle") resetMlbb();
                }}
                placeholder="Server"
                disabled={mlbbDisabled}
                className="w-[88px] shrink-0 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
              />
              {mlbbStep !== "found" && (
                <button
                  type="button"
                  onClick={handleCheckAccount}
                  disabled={
                    !mlbbUid.trim() || !mlbbSid.trim() || mlbbStep === "checking"
                  }
                  className="shrink-0 inline-flex items-center justify-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-600/20 px-4 py-2.5 text-xs font-bold text-cyan-400 transition hover:bg-cyan-600/30 disabled:opacity-30 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {mlbbStep === "checking" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-3.5 w-3.5" />
                  )}
                  <span>Cek Akun</span>
                </button>
              )}
            </div>
            {mlbbStep === "found" && (
              <div className="mt-2 px-3 py-2 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span className="text-xs text-emerald-400 font-semibold">
                    Akun ditemukan
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 ml-5">
                  Nickname:{" "}
                  <span className="text-emerald-400 font-semibold">
                    {mlbbNickname}
                  </span>
                </p>
              </div>
            )}
            {mlbbStep === "not_found" && (
              <div className="flex items-center gap-2 mt-2 px-2 py-1.5 rounded-lg bg-red-950/20 border border-red-900/30">
                <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0" />
                <span className="text-[11px] text-red-400">{mlbbMsg}</span>
              </div>
            )}
            {mlbbStep === "error" && (
              <div className="flex items-center gap-2 mt-2 px-2 py-1.5 rounded-lg bg-amber-950/20 border border-amber-900/30">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span className="text-[11px] text-amber-400">{mlbbMsg}</span>
              </div>
            )}
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/20 border border-red-900/30 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="relative mt-1 group">
            <button
              type="submit"
              disabled={!canSubmit}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] shadow-[0_8px_24px_-8px_rgba(6,182,212,0.4)]"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Create Account
            </button>
            {!canSubmit && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-800 border border-white/10 px-3 py-1.5 text-[11px] text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-10">
                Verifikasi akun MLBB terlebih dahulu
              </div>
            )}
          </div>
        </form>

        <p className="text-center text-sm text-slate-500 mt-5">
          Already have an account?{" "}
          <Link
            to={`/login?returnTo=${encodeURIComponent(returnTo)}`}
            className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
          >
            Sign In
          </Link>
        </p>

        <p className="text-[10px] text-slate-600 text-center mt-6 leading-relaxed">
          By creating an account, you agree to our terms. Your data is stored
          securely.
        </p>
      </div>
    </AuthLayout>
  );
}
