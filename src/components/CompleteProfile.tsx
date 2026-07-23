import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, AlertTriangle, Gamepad2, Search, Link2, ArrowRight } from "lucide-react";
import { apiUrl } from "../lib/api";
import type { AppUser } from "./Navbar";

interface CompleteProfileProps {
  user: AppUser;
  onComplete: (updatedUser: AppUser) => void;
}

type MlbbStep = "idle" | "checking" | "found" | "not_found" | "error";

export default function CompleteProfile({ user, onComplete }: CompleteProfileProps) {
  const [name, setName] = useState(user.name || "");
  const [mlbbUid, setMlbbUid] = useState("");
  const [mlbbSid, setMlbbSid] = useState("");
  const [mlbbStep, setMlbbStep] = useState<MlbbStep>("idle");
  const [mlbbNickname, setMlbbNickname] = useState("");
  const [mlbbMsg, setMlbbMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(user.name || "");
  }, [user.name]);

  const handleCheckAccount = async () => {
    if (mlbbStep === "checking") return;
    if (!mlbbUid.trim() || !mlbbSid.trim()) return;
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

    if (!name.trim()) {
      setError("Nama tidak boleh kosong.");
      return;
    }
    if (!mlbbUid.trim() || !mlbbSid.trim()) {
      setError("MLBB User ID dan Server ID harus diisi.");
      return;
    }
    if (mlbbStep !== "found") {
      setError("Silakan cek akun MLBB terlebih dahulu.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(apiUrl("/auth/complete-profile"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          mlbb_uid: mlbbUid.trim(),
          mlbb_sid: mlbbSid.trim(),
          mlbb_nickname: mlbbNickname || '',
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Gagal menyimpan profil.");
        return;
      }

      onComplete(data.user);
    } catch {
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  const mlbbDisabled = mlbbStep === "found" || mlbbStep === "checking";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-sm mx-4 rounded-2xl border border-white/10 bg-[#0a1121]/95 p-6 shadow-2xl backdrop-blur-xl max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-5">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 font-mono text-sm font-black text-slate-950 shadow-[0_12px_30px_-14px_rgba(56,189,248,0.8)]">ML</div>
          <h2 className="text-lg font-bold text-white tracking-tight">Complete Your Profile</h2>
          <p className="text-xs text-slate-400 mt-1">One more step before entering MVP Draft</p>
        </div>

        {/* Google account info */}
        <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 mb-4">
          {user.avatar_url && (
            <img
              src={user.avatar_url}
              alt="Google avatar"
              className="h-10 w-10 rounded-full border border-cyan-300/30"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-400">Signed in via Google</p>
            <p className="text-sm text-white font-medium truncate">{user.email}</p>
          </div>
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Name */}
          <div>
            <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30"
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">Email</label>
            <input
              type="email"
              value={user.email}
              readOnly
              className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5 text-sm text-slate-400 outline-none cursor-not-allowed opacity-60"
            />
          </div>

          {/* MLBB Account */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 mt-1">
            <div className="flex items-center gap-2 mb-2">
              <Gamepad2 className="h-3.5 w-3.5 text-cyan-400" />
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">MLBB Account</span>
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={mlbbUid}
                  onChange={(e) => {
                    setMlbbUid(e.target.value);
                    if (mlbbStep !== "idle") {
                      setMlbbStep("idle");
                      setMlbbNickname("");
                      setMlbbMsg("");
                    }
                  }}
                  placeholder="User ID"
                  disabled={mlbbDisabled}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </div>
              <div className="w-24">
                <input
                  type="text"
                  value={mlbbSid}
                  onChange={(e) => {
                    setMlbbSid(e.target.value);
                    if (mlbbStep !== "idle") {
                      setMlbbStep("idle");
                      setMlbbNickname("");
                      setMlbbMsg("");
                    }
                  }}
                  placeholder="Server"
                  disabled={mlbbDisabled}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed"
                />
              </div>
              {mlbbStep !== "found" && (
                <button
                  type="button"
                  onClick={handleCheckAccount}
                  disabled={!mlbbUid.trim() || !mlbbSid.trim() || mlbbStep === "checking"}
                  className="shrink-0 flex items-center justify-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-600/20 px-3 py-2 text-xs font-bold text-cyan-400 transition hover:bg-cyan-600/30 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {mlbbStep === "checking" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">Cek Akun</span>
                </button>
              )}
            </div>

            {mlbbStep === "found" && (
              <div className="mt-2 px-3 py-2 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span className="text-xs text-emerald-400 font-semibold">Akun ditemukan</span>
                </div>
                <p className="text-[11px] text-slate-400 ml-5">Nickname: <span className="text-emerald-400 font-semibold">{mlbbNickname}</span></p>
                <p className="text-[11px] text-slate-400 ml-5">UID: {mlbbUid} | Server: {mlbbSid}</p>
                <button
                  type="button"
                  onClick={() => {
                    setMlbbStep("idle");
                    setMlbbNickname("");
                    setMlbbMsg("");
                  }}
                  className="mt-2 text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Ganti akun
                </button>
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
            <p className="text-xs text-red-400 bg-red-950/20 border border-red-900/30 rounded-lg px-3 py-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || mlbbStep !== "found"}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600/80 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-500/80 disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
            Complete Registration
          </button>
        </form>

        <p className="text-[10px] text-slate-600 text-center mt-4 leading-relaxed">
          Password tidak diperlukan untuk akun Google.
        </p>
      </div>
    </div>
  );
}
