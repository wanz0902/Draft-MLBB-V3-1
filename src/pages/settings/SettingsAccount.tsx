import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Shield,
  Calendar,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../lib/auth";
import { apiUrl } from "../../lib/api";
import { fadeUp } from "../../lib/motionPresets";

export default function SettingsAccount() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const isGoogleUser = !!user?.google_id;
  const accountCreated = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(apiUrl("/auth/change-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to change password");
        setLoading(false);
        return;
      }
      setSuccess("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setLoading(false);
    } catch {
      setError("Endpoint not available yet. Coming soon!");
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-3xl space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold text-white">Account & Security</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage your account credentials and security settings.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10">
              <Mail className="h-4 w-4 text-cyan-400" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Email
            </span>
          </div>
          <p className="text-sm font-medium text-white">{user?.email || "—"}</p>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
              <ExternalLink className="h-4 w-4 text-purple-400" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Login Provider
            </span>
          </div>
          <p className="text-sm font-medium text-white">
            {isGoogleUser ? "Google" : "Email"}
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
              <Calendar className="h-4 w-4 text-emerald-400" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Account Created
            </span>
          </div>
          <p className="text-sm font-medium text-white">{accountCreated}</p>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10">
              <CheckCircle2 className="h-4 w-4 text-cyan-400" />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Session Status
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <p className="text-sm font-medium text-white">Authenticated</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6">
        <h2 className="mb-1 flex items-center gap-2 text-lg font-bold text-white">
          <Lock className="h-5 w-5 text-cyan-400" />
          Change Password
        </h2>

        {isGoogleUser ? (
          <p className="mt-3 text-sm text-slate-400">
            Your account uses Google Sign-In. Password management is handled by Google.
          </p>
        ) : (
          <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 pr-10 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 pr-10 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 pr-10 text-sm text-white placeholder-slate-600 outline-none transition focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
            {success && (
              <p className="text-sm text-emerald-400">{success}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-cyan-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </div>

      <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-medium text-slate-400 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </motion.div>
  );
}
