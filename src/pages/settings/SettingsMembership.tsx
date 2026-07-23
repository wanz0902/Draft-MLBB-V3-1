import { useState } from "react";
import { useAuth } from "../../lib/auth";
import { MEMBERSHIP_PLANS } from "../../data/membershipPlans";
import { CheckCircle2, AlertCircle, Crown, Zap, Star } from "lucide-react";

const PLAN_ICONS: Record<string, typeof Crown> = {
  basic: Zap,
  elite: Crown,
  pro: Star,
};

export default function SettingsMembership() {
  const { user } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const currentPlan = user?.membership_plan || "free";

  const handleSelectPlan = (planId: string) => {
    if (planId === currentPlan) return;
    setSelectedPlan(planId);
    setShowPaymentModal(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Membership & Billing</h2>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Manage your subscription plan.</p>
      </div>

      <div className="rounded-2xl border p-6" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Current Plan</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-input)" }}>
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Plan</p>
            <p className="text-sm font-medium capitalize" style={{ color: "var(--text-primary)" }}>{currentPlan === "free" ? "Free" : currentPlan}</p>
          </div>
          <div className="rounded-lg border p-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-input)" }}>
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Status</p>
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>{user?.membership_status || "inactive"}</p>
          </div>
          <div className="rounded-lg border p-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-input)" }}>
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Next Billing</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>—</p>
          </div>
          <div className="rounded-lg border p-3" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-input)" }}>
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Payment Method</p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>—</p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Available Plans</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {MEMBERSHIP_PLANS.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            const Icon = PLAN_ICONS[plan.id] || Zap;
            return (
              <div
                key={plan.id}
                className="rounded-2xl border p-5 flex flex-col transition"
                style={{
                  borderColor: isCurrent ? "var(--accent)" : plan.recommended ? "rgba(139,92,246,0.3)" : "var(--border)",
                  backgroundColor: isCurrent ? "var(--accent-bg)" : "var(--bg-card)",
                }}
              >
                {plan.badge && (
                  <div
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3 self-start"
                    style={{ backgroundColor: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)", color: "#a78bfa" }}
                  >
                    <Crown className="h-3 w-3" />
                    {plan.badge}
                  </div>
                )}
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="h-5 w-5" style={{ color: isCurrent ? "var(--accent)" : "var(--text-secondary)" }} />
                  <h4 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>{plan.name}</h4>
                </div>
                <div className="flex items-baseline gap-1 mt-1 mb-2">
                  <span className="text-2xl font-black" style={{ color: "var(--text-primary)" }}>{plan.monthlyPriceLabel}</span>
                  <span className="text-sm" style={{ color: "var(--text-muted)" }}>/bulan</span>
                </div>
                <p className="text-xs mb-4" style={{ color: "var(--text-secondary)" }}>{plan.description}</p>
                <ul className="space-y-2 flex-1 mb-4">
                  {plan.features.map((f) => (
                    <li key={f.text} className="flex items-start gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                      <CheckCircle2
                        className="h-3.5 w-3.5 shrink-0 mt-0.5"
                        style={{ color: f.status === "available" ? "var(--success)" : f.status === "limited" ? "#eab308" : "var(--text-muted)" }}
                      />
                      <span>{f.text}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isCurrent}
                  className="w-full py-2.5 rounded-xl text-sm font-bold transition active:scale-[0.98]"
                  style={{
                    backgroundColor: isCurrent ? "var(--bg-input)" : plan.recommended ? "#7c3aed" : "var(--accent)",
                    color: isCurrent ? "var(--text-muted)" : "#ffffff",
                    opacity: isCurrent ? 0.6 : 1,
                    cursor: isCurrent ? "not-allowed" : "pointer",
                  }}
                >
                  {isCurrent ? "Current Plan" : plan.ctaLabel}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div
            className="border rounded-xl p-6 max-w-sm w-full mx-4 shadow-2xl"
            style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-strong)" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: "var(--accent-bg)", border: "1px solid var(--border)" }}
              >
                <AlertCircle className="h-5 w-5" style={{ color: "var(--accent)" }} />
              </div>
              <h3 className="font-bold text-lg" style={{ color: "var(--text-primary)" }}>Payment Coming Soon</h3>
            </div>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              Payment integration is not yet available. We're working on bringing you secure payment options.
              Stay tuned for updates!
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setShowPaymentModal(false); setSelectedPlan(null); }}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: "var(--bg-input)", color: "var(--text-primary)", border: "1px solid var(--border)" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
