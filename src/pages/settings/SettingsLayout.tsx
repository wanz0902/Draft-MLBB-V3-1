import { useState } from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  User,
  Palette,
  Gamepad2,
  CreditCard,
  AlertTriangle,
  LogOut,
  Menu,
  X,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "../../lib/auth";
import { apiUrl } from "../../lib/api";

interface SidebarItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const ACCOUNT_ITEMS: SidebarItem[] = [
  { label: "Account & Security", path: "/settings/account", icon: Shield },
  { label: "Profile", path: "/settings/profile", icon: User },
  { label: "Appearance", path: "/settings/appearance", icon: Palette },
  { label: "MLBB Account", path: "/settings/mlbb", icon: Gamepad2 },
  { label: "Membership & Billing", path: "/settings/membership", icon: CreditCard },
];

function DeleteAccountModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canDelete = confirmText === "DELETE";

  const handleDelete = async () => {
    if (!canDelete) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(apiUrl("/auth/account"), {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ confirmation: "DELETE" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to delete account");
        setLoading(false);
        return;
      }
      await logout();
      navigate("/");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="w-full max-w-md rounded-xl border border-red-900/30 bg-[#0a111f] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <h2 className="text-lg font-bold text-white">Delete Account Permanently</h2>
            </div>
            <p className="mb-4 text-sm text-slate-400">
              This action is irreversible. All of the following will be permanently deleted:
            </p>
            <ul className="mb-4 space-y-1.5 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                Your profile, stats, and match history
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                All draft analytics and saved compositions
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                Membership and billing data
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                Connected MLBB account information
              </li>
            </ul>
            <p className="mb-3 text-sm text-slate-400">
              Type <span className="font-mono font-bold text-red-400">DELETE</span> to confirm:
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type DELETE"
              className="mb-4 w-full rounded-lg border border-red-900/30 bg-white/[0.04] px-3 py-2.5 text-sm text-white placeholder-slate-600 outline-none transition focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30"
            />
            {error && (
              <p className="mb-3 text-sm text-red-400">{error}</p>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={onClose}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/[0.08] hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={!canDelete || loading}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "Deleting..." : "Delete Forever"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showDelete, setShowDelete] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <nav className="py-6">
        <div className="mb-6">
          <p className="px-4 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Account
          </p>
          <div className="space-y-0.5">
            {ACCOUNT_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "border-l-2 border-cyan-400 bg-cyan-400/10 text-cyan-400"
                        : "border-l-2 border-transparent text-slate-400 hover:bg-white/[0.04] hover:text-white"
                    }`
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        </div>

        <div>
          <p className="px-4 mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Danger Zone
          </p>
          <div className="space-y-0.5">
            <button
              onClick={() => {
                setShowDelete(true);
                onNavigate?.();
              }}
              className="flex w-full items-center gap-3 border-l-2 border-transparent px-4 py-2.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
            >
              <AlertTriangle className="h-4 w-4 shrink-0" />
              Delete Account
            </button>
            <button
              onClick={() => {
                handleLogout();
                onNavigate?.();
              }}
              className="flex w-full items-center gap-3 border-l-2 border-transparent px-4 py-2.5 text-sm font-medium text-slate-400 transition-all duration-200 hover:bg-white/[0.04] hover:text-white"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="border-t border-white/[0.06] px-4 pt-4">
        <Link to="/app" onClick={onNavigate} className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to App
        </Link>
      </div>

      <DeleteAccountModal open={showDelete} onClose={() => setShowDelete(false)} />
    </>
  );
}

export default function SettingsLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0a111f]">
      <aside className="hidden w-60 shrink-0 border-r border-white/[0.08] bg-[#0a111f] lg:block">
        <SidebarContent />
      </aside>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-white/[0.08] bg-[#0a111f] transition-transform duration-300 lg:hidden ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <span className="text-sm font-semibold text-white">Settings</span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <SidebarContent onNavigate={() => setDrawerOpen(false)} />
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-white/[0.08] bg-[#0a111f] px-4 py-3 lg:hidden">
          <button
            onClick={() => setDrawerOpen(true)}
            className="text-slate-400 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-semibold text-white">Settings</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
