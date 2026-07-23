import { useState } from "react";
import { useAuth } from "../../lib/auth";
import { apiUrl } from "../../lib/api";
import { Loader2, CheckCircle2, AlertTriangle, Search, Unplug, RefreshCw, Link2 } from "lucide-react";

type MlbbStep = "idle" | "checking" | "found" | "not_found" | "error";

export default function SettingsMLBB() {
  const { user, refreshUser } = useAuth();
  const [mode, setMode] = useState<"view" | "change">("view");
  const [uid, setUid] = useState("");
  const [sid, setSid] = useState("");
  const [step, setStep] = useState<MlbbStep>("idle");
  const [nickname, setNickname] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);

  const handleCheck = async (checkUid: string, checkSid: string) => {
    if (!checkUid.trim() || !checkSid.trim()) return;
    setStep("checking");
    setMsg("");
    setNickname("");
    try {
      const res = await fetch(apiUrl("/api/mlbb/check-account"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: checkUid.trim(), zoneId: checkSid.trim() }),
      });
      const data = await res.json();
      if (data.success && data.valid && data.nickname) {
        setNickname(data.nickname);
        setStep("found");
      } else if (data.success && !data.valid) {
        setStep("not_found");
        setMsg(data.message || "Akun tidak ditemukan.");
      } else {
        setStep("error");
        setMsg(data.message || "Gagal mengecek akun.");
      }
    } catch {
      setStep("error");
      setMsg("Tidak dapat terhubung ke server.");
    }
  };

  const handleChangeAccount = async () => {
    if (!nickname || !uid.trim() || !sid.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/profile"), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ mlbb_uid: uid.trim(), mlbb_sid: sid.trim(), mlbb_nickname: nickname }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshUser();
        setMode("view");
        setStep("idle");
        setUid("");
        setSid("");
        setNickname("");
      }
    } catch {
      setMsg("Gagal menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/profile/mlbb/disconnect"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        await refreshUser();
        setShowDisconnect(false);
      }
    } catch {
      setMsg("Gagal memutuskan akun.");
    } finally {
      setLoading(false);
    }
  };

  const hasMlbb = user?.mlbb_uid && user?.mlbb_sid;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-1">MLBB Account</h2>
        <p className="text-sm text-slate-400">Manage your connected Mobile Legends account.</p>
      </div>

      {hasMlbb && mode === "view" && (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Connected Account</h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-400">
              <CheckCircle2 className="h-3 w-3" /> Connected
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Nickname</p>
              <p className="text-sm text-white font-medium">{user?.mlbb_nickname || '—'}</p>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">User ID</p>
              <p className="text-sm text-white font-medium font-mono">{user?.mlbb_uid}</p>
            </div>
            <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Server ID</p>
              <p className="text-sm text-white font-medium font-mono">{user?.mlbb_sid}</p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => handleCheck(user?.mlbb_uid || "", user?.mlbb_sid || "")} disabled={step === "checking"}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.06] disabled:opacity-50">
              <RefreshCw className={`h-3.5 w-3.5 ${step === "checking" ? "animate-spin" : ""}`} /> Check Again
            </button>
            <button onClick={() => { setMode("change"); setUid(""); setSid(""); setStep("idle"); setNickname(""); }}
              className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-600/20 px-3 py-2 text-xs font-semibold text-cyan-400 transition hover:bg-cyan-600/30">
              <Link2 className="h-3.5 w-3.5" /> Change Account
            </button>
            <button onClick={() => setShowDisconnect(true)}
              className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-600/10 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-600/20">
              <Unplug className="h-3.5 w-3.5" /> Disconnect
            </button>
          </div>

          {step === "found" && (
            <div className="px-3 py-2 rounded-lg bg-emerald-950/20 border border-emerald-900/30 text-xs text-emerald-400">
              Verified: <span className="font-semibold">{nickname}</span>
            </div>
          )}
        </div>
      )}

      {(!hasMlbb || mode === "change") && (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white">{hasMlbb ? 'Change MLBB Account' : 'Connect MLBB Account'}</h3>
          <div className="flex gap-2">
            <input type="text" value={uid} onChange={(e) => { setUid(e.target.value); if (step !== "idle") { setStep("idle"); setNickname(""); } }} placeholder="User ID"
              className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-500/50" />
            <input type="text" value={sid} onChange={(e) => { setSid(e.target.value); if (step !== "idle") { setStep("idle"); setNickname(""); } }} placeholder="Server"
              className="w-24 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-500/50" />
            <button onClick={() => handleCheck(uid, sid)} disabled={!uid.trim() || !sid.trim() || step === "checking"}
              className="shrink-0 flex items-center justify-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-600/20 px-3 py-2 text-xs font-bold text-cyan-400 transition hover:bg-cyan-600/30 disabled:opacity-30">
              {step === "checking" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
              Cek Akun
            </button>
          </div>
          {step === "found" && (
            <div className="px-3 py-2 rounded-lg bg-emerald-950/20 border border-emerald-900/30">
              <p className="text-xs text-emerald-400">Nickname: <span className="font-semibold">{nickname}</span></p>
              <button onClick={handleChangeAccount} disabled={loading}
                className="mt-2 flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-600/20 px-3 py-1.5 text-[11px] font-bold text-emerald-400 transition hover:bg-emerald-600/30 disabled:opacity-50">
                {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Link2 className="h-3 w-3" />}
                {hasMlbb ? 'Update Connection' : 'Connect Account'}
              </button>
            </div>
          )}
          {step === "not_found" && <p className="text-[11px] text-red-400">{msg}</p>}
          {step === "error" && <p className="text-[11px] text-amber-400">{msg}</p>}
          {hasMlbb && mode === "change" && (
            <button onClick={() => setMode("view")} className="text-xs text-slate-500 hover:text-slate-300 transition">Cancel</button>
          )}
        </div>
      )}

      {showDisconnect && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <h3 className="text-white font-bold text-lg mb-2">Disconnect MLBB Account?</h3>
            <p className="text-gray-400 text-sm mb-6">This will remove the connection to your MLBB account. You can reconnect later.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDisconnect(false)} className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm font-medium transition-colors">Cancel</button>
              <button onClick={handleDisconnect} disabled={loading}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors disabled:opacity-50">
                {loading ? 'Disconnecting...' : 'Disconnect'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
