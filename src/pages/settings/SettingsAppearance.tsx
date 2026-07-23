import { useTheme } from "../../lib/theme";
import { Check } from "lucide-react";

export default function SettingsAppearance() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Appearance</h2>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Choose your theme.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => setTheme("dark")}
          className={`relative rounded-2xl border-2 p-1 text-left transition ${
            theme === "dark"
              ? "border-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
              : "border-transparent hover:border-white/10"
          }`}
        >
          {theme === "dark" && (
            <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-cyan-500 flex items-center justify-center z-10">
              <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            </div>
          )}
          <div className="rounded-xl overflow-hidden mb-3" style={{ backgroundColor: "#0a111f" }}>
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full" style={{ backgroundColor: "#1e293b" }} />
                <div className="h-2.5 rounded-full w-20" style={{ backgroundColor: "#1e293b" }} />
              </div>
              <div className="flex gap-2">
                <div className="h-8 rounded-lg flex-1" style={{ backgroundColor: "#0f1729" }} />
                <div className="h-8 rounded-lg flex-1" style={{ backgroundColor: "#0f1729" }} />
              </div>
              <div className="h-12 rounded-lg" style={{ backgroundColor: "#0d1a2d" }} />
              <div className="h-2 rounded-full w-3/4" style={{ backgroundColor: "#1e293b" }} />
              <div className="h-2 rounded-full w-1/2" style={{ backgroundColor: "#1e293b" }} />
            </div>
          </div>
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Dark Theme</span>
            {theme === "dark" && <span className="text-xs font-medium text-cyan-400">Active</span>}
          </div>
        </button>

        <button
          onClick={() => setTheme("light")}
          className={`relative rounded-2xl border-2 p-1 text-left transition ${
            theme === "light"
              ? "border-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.15)]"
              : "border-transparent hover:border-black/10"
          }`}
        >
          {theme === "light" && (
            <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-cyan-500 flex items-center justify-center z-10">
              <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            </div>
          )}
          <div className="rounded-xl overflow-hidden mb-3" style={{ backgroundColor: "#f8fafc" }}>
            <div className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full" style={{ backgroundColor: "#e2e8f0" }} />
                <div className="h-2.5 rounded-full w-20" style={{ backgroundColor: "#e2e8f0" }} />
              </div>
              <div className="flex gap-2">
                <div className="h-8 rounded-lg flex-1" style={{ backgroundColor: "#f1f5f9" }} />
                <div className="h-8 rounded-lg flex-1" style={{ backgroundColor: "#f1f5f9" }} />
              </div>
              <div className="h-12 rounded-lg" style={{ backgroundColor: "#ffffff" }} />
              <div className="h-2 rounded-full w-3/4" style={{ backgroundColor: "#e2e8f0" }} />
              <div className="h-2 rounded-full w-1/2" style={{ backgroundColor: "#e2e8f0" }} />
            </div>
          </div>
          <div className="flex items-center justify-between px-1">
            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Light Theme</span>
            {theme === "light" && <span className="text-xs font-medium text-cyan-400">Active</span>}
          </div>
        </button>
      </div>
    </div>
  );
}
