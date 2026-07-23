import { useState, useMemo } from "react";
import { useAuth } from "../../lib/auth";
import { apiUrl } from "../../lib/api";
import heroesMaster from "../../data/heroes_master.json";
import { Save, CheckCircle, Search } from "lucide-react";

const ROLES = [
  { id: "Jungler", label: "Jungler", icon: "⚔️" },
  { id: "Roamer", label: "Roamer", icon: "🛡️" },
  { id: "EXP Lane", label: "EXP Lane", icon: "🔥" },
  { id: "Gold Lane", label: "Gold Lane", icon: "💰" },
  { id: "Mid Lane", label: "Mid Lane", icon: "✨" },
  { id: "Flex", label: "Flex", icon: "🔄" },
];

const BANNERS = [
  { id: "default", label: "MVP Draft", gradient: "linear-gradient(135deg, #0a111f 0%, #0d1a2d 50%, #111f35 100%)" },
  { id: "dark-command-center", label: "Dark Command Center", gradient: "linear-gradient(135deg, #0f0f23 0%, #1a0a2e 50%, #2d1b69 100%)" },
  { id: "cyan-arena", label: "Cyan Arena", gradient: "linear-gradient(135deg, #0a1a1f 0%, #0d2d33 50%, #0f3d44 100%)" },
  { id: "purple-esports", label: "Purple Esports", gradient: "linear-gradient(135deg, #1a0a2e 0%, #2e1065 50%, #4c1d95 100%)" },
  { id: "showcase-hero", label: "Showcase Hero", gradient: "linear-gradient(135deg, #1e3a5f 0%, #0f172a 50%, #0a111f 100%)" },
];

type HeroEntry = { hero_name: string; role: string[] };

const heroes = heroesMaster as HeroEntry[];

export default function SettingsProfile() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [favoriteRole, setFavoriteRole] = useState(user?.favorite_role || "");
  const [showcaseHero, setShowcaseHero] = useState(user?.showcase_hero || "");
  const [profileBanner, setProfileBanner] = useState(user?.profile_banner || "default");
  const [heroSearch, setHeroSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const filteredHeroes = useMemo(() => {
    if (!heroSearch.trim()) return heroes.slice(0, 20);
    const q = heroSearch.toLowerCase();
    return heroes.filter(
      (h) =>
        h.hero_name.toLowerCase().includes(q) ||
        h.role.some((r) => r.toLowerCase().includes(q))
    );
  }, [heroSearch]);

  const previewBanner = BANNERS.find((b) => b.id === profileBanner) || BANNERS[0];

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch(apiUrl("/api/profile"), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          bio: bio.trim(),
          favorite_role: favoriteRole,
          showcase_hero: showcaseHero,
          profile_banner: profileBanner,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Failed to save profile.");
        return;
      }
      await refreshUser();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Cannot reach server.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Profile Settings</h2>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Customize your public profile.</p>
      </div>

      <div
        className="rounded-2xl overflow-hidden border"
        style={{ borderColor: "var(--border)", background: previewBanner.gradient }}
      >
        <div className="p-5">
          <div className="flex items-center gap-4">
            <div
              className="h-14 w-14 rounded-full border-2 flex items-center justify-center text-xl font-bold shrink-0"
              style={{ borderColor: "var(--border-strong)", backgroundColor: "var(--bg-card)", color: "var(--text-primary)" }}
            >
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="" className="h-14 w-14 rounded-full object-cover" />
              ) : (
                (name || "U").charAt(0).toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <p className="text-base font-bold text-white truncate">{name || "Your Name"}</p>
              <p className="text-xs text-white/60 truncate">{bio || "No bio yet."}</p>
              <div className="flex gap-2 mt-1.5">
                {favoriteRole && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/80 font-medium">
                    {ROLES.find((r) => r.id === favoriteRole)?.icon} {favoriteRole}
                  </span>
                )}
                {showcaseHero && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-medium">
                    {showcaseHero}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border p-6 space-y-5" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-card)" }}>
        <div>
          <label className="block text-[10px] uppercase tracking-wider mb-1.5 font-semibold" style={{ color: "var(--text-muted)" }}>Display Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your display name"
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-muted)" }}>Bio</label>
            <span className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>{bio.length}/300</span>
          </div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 300))}
            placeholder="Tell us about yourself..."
            rows={3}
            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition resize-none"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }}
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Favorite Role</label>
          <div className="flex flex-wrap gap-2">
            {ROLES.map((role) => (
              <button
                key={role.id}
                onClick={() => setFavoriteRole(favoriteRole === role.id ? "" : role.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border transition"
                style={{
                  borderColor: favoriteRole === role.id ? "var(--accent)" : "var(--border)",
                  backgroundColor: favoriteRole === role.id ? "var(--accent-bg)" : "var(--bg-input)",
                  color: favoriteRole === role.id ? "var(--accent)" : "var(--text-secondary)",
                }}
              >
                {role.icon} {role.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Showcase Hero</label>
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
              placeholder="Search heroes..."
              className="w-full rounded-lg border pl-9 pr-3 py-2.5 text-sm outline-none transition"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-input)", color: "var(--text-primary)" }}
            />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-52 overflow-y-auto pr-1">
            {filteredHeroes.map((h) => (
              <button
                key={h.hero_name}
                onClick={() => setShowcaseHero(showcaseHero === h.hero_name ? "" : h.hero_name)}
                className="rounded-lg border p-2.5 text-left transition"
                style={{
                  borderColor: showcaseHero === h.hero_name ? "var(--accent)" : "var(--border)",
                  backgroundColor: showcaseHero === h.hero_name ? "var(--accent-bg)" : "var(--bg-input)",
                }}
              >
                <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>{h.hero_name}</p>
                <p className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>{h.role.join(", ")}</p>
              </button>
            ))}
            {filteredHeroes.length === 0 && (
              <p className="col-span-full text-xs text-center py-4" style={{ color: "var(--text-muted)" }}>No heroes found.</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wider mb-2 font-semibold" style={{ color: "var(--text-muted)" }}>Profile Banner</label>
          <div className="grid grid-cols-5 gap-2">
            {BANNERS.map((b) => (
              <button
                key={b.id}
                onClick={() => setProfileBanner(b.id)}
                className="relative rounded-xl overflow-hidden h-16 border-2 transition"
                style={{
                  borderColor: profileBanner === b.id ? "var(--accent)" : "transparent",
                  background: b.gradient,
                }}
              >
                {profileBanner === b.id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <CheckCircle className="h-4 w-4 text-cyan-400" />
                  </div>
                )}
              </button>
            ))}
          </div>
          <p className="text-[10px] mt-1.5" style={{ color: "var(--text-muted)" }}>
            {previewBanner.label}
          </p>
        </div>
      </div>

      {error && (
        <p className="text-xs rounded-lg px-3 py-2" style={{ color: "var(--danger)", backgroundColor: "var(--danger-bg)" }}>{error}</p>
      )}
      {success && (
        <div className="flex items-center gap-2 text-xs rounded-lg px-3 py-2" style={{ color: "var(--success)", backgroundColor: "var(--success-bg)" }}>
          <CheckCircle className="h-4 w-4" /> Profile updated successfully.
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50 active:scale-[0.98]"
        style={{ backgroundColor: "var(--accent)" }}
      >
        <Save className="h-4 w-4" />
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
