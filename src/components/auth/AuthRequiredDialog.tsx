import { useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, ArrowRight, UserPlus, Eye } from "lucide-react";
import { useAuthRequired } from "./AuthRequiredContext";
import { modalBackdrop } from "../../lib/motionPresets";

function validateReturnTo(returnTo: string): string {
  if (!returnTo || typeof returnTo !== "string") return "/app";
  if (!returnTo.startsWith("/") || returnTo.startsWith("//") || returnTo.match(/^https?:\/\//)) return "/app";
  return returnTo;
}

export default function AuthRequiredDialog() {
  const { dialogState, closeAuthDialog } = useAuthRequired();
  const navigate = useNavigate();
  const location = useLocation();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const returnTo = validateReturnTo(dialogState.returnTo || location.pathname);

  const handleSignIn = useCallback(() => {
    closeAuthDialog();
    navigate(`/login?returnTo=${encodeURIComponent(returnTo)}`, { replace: true });
  }, [closeAuthDialog, navigate, returnTo]);

  const handleCreateAccount = useCallback(() => {
    closeAuthDialog();
    navigate(`/register?returnTo=${encodeURIComponent(returnTo)}`, { replace: true });
  }, [closeAuthDialog, navigate, returnTo]);

  const handleContinuePreview = useCallback(() => {
    closeAuthDialog();
  }, [closeAuthDialog]);

  useEffect(() => {
    if (dialogState.open) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      setTimeout(() => closeButtonRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
    }
    return () => { document.body.style.overflow = ""; };
  }, [dialogState.open]);

  useEffect(() => {
    if (!dialogState.open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAuthDialog();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [dialogState.open, closeAuthDialog]);

  return (
    <AnimatePresence>
      {dialogState.open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          {...modalBackdrop}
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeAuthDialog}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Login diperlukan"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative z-10 w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0c1424] p-6 shadow-2xl"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                <Lock className="h-6 w-6 text-cyan-400" />
              </div>

              <h2 className="text-lg font-bold text-white mb-2">Login diperlukan</h2>

              <p className="text-sm text-slate-400 mb-1 leading-relaxed">
                {dialogState.action
                  ? `Untuk ${dialogState.action}, masuk atau buat akun terlebih dahulu.`
                  : "Masuk atau buat akun untuk mengakses fitur ini."}
              </p>
              <p className="text-xs text-slate-500 mb-6">
                Menyimpan progres, menjalankan analisis, dan menggunakan fitur personal.
              </p>

              <div className="flex flex-col gap-2.5 w-full">
                <button
                  onClick={handleSignIn}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:from-cyan-500 hover:to-blue-500 active:scale-[0.98] shadow-[0_8px_24px_-8px_rgba(6,182,212,0.4)]"
                >
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </button>

                <button
                  onClick={handleCreateAccount}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.08] hover:border-white/20 active:scale-[0.98]"
                >
                  <UserPlus className="h-4 w-4 text-slate-400" />
                  Create Account
                </button>

                <button
                  ref={closeButtonRef}
                  onClick={handleContinuePreview}
                  className="flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-medium text-slate-500 transition hover:text-slate-300 hover:bg-white/[0.03]"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Continue Preview
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
