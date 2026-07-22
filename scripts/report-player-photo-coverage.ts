/**
 * Compare local snapshot players with photo overrides.
 * Run: npm run report:player-photos
 * Generates: reports/player-photo-coverage-report.md
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const PLAYERS_FILE = path.join(ROOT, "data", "liquipedia", "players.json");
const OVERRIDES_FILE = path.join(ROOT, "src", "data", "playerPhotoOverrides.ts");
const PHOTOS_DIR = path.join(ROOT, "public", "player-photos");
const REPORT_FILE = path.join(ROOT, "reports", "player-photo-coverage-report.md");

function readPlayers(): any[] {
  try {
    if (!fs.existsSync(PLAYERS_FILE)) return [];
    return JSON.parse(fs.readFileSync(PLAYERS_FILE, "utf8"));
  } catch { return []; }
}

function readOverrideNicknames(): Set<string> {
  const result = new Set<string>();
  try {
    if (!fs.existsSync(OVERRIDES_FILE)) return result;
    const content = fs.readFileSync(OVERRIDES_FILE, "utf8");
    // Match keys like: Butss: { or "Butss": {
    const matches = content.matchAll(/["']?([A-Za-z0-9_\- ]+)["']?\s*:\s*\{/g);
    for (const m of matches) {
      const key = m[1].trim();
      if (key && key !== "src" && key !== "scale" && key !== "offsetX" && key !== "offsetY" && key !== "objectPosition" && key !== "credit" && key !== "sourceUrl") {
        result.add(key);
      }
    }
  } catch {}
  return result;
}

function readPhotoFiles(): Set<string> {
  const result = new Set<string>();
  try {
    if (fs.existsSync(PHOTOS_DIR)) {
      for (const f of fs.readdirSync(PHOTOS_DIR)) {
        if (/\.(png|jpg|jpeg|webp)$/i.test(f)) result.add(f);
      }
    }
  } catch {}
  return result;
}

function main() {
  const countryArg = process.argv.find((a) => a.startsWith("--country="));
  const countryFilter = countryArg ? countryArg.split("=")[1] : null;

  const allPlayers = readPlayers();
  const overrideNicknames = readOverrideNicknames();
  const photoFiles = readPhotoFiles();

  // Apply country filter if provided
  const players = countryFilter
    ? allPlayers.filter((p) => (p.nationality || "").toLowerCase() === countryFilter.toLowerCase())
    : allPlayers;

  const proPlayers = players.filter((p) => p.roleCategory === "pro_player" || p.isProPlayer || p.roleCategory === "players");
  const staff = players.filter((p) => p.roleCategory === "team_staff" || p.isTeamStaff || p.roleCategory === "staff");
  const talent = players.filter((p) => p.roleCategory === "broadcast_talent" || p.isBroadcastTalent || p.roleCategory === "talent");
  const needsReview = players.filter((p) => p.roleCategory === "needs_review" || p.isNeedsReview || p.roleCategory === "unknown");

  const playersWithPhoto = players.filter((p) => overrideNicknames.has(p.nickname));
  const proPlayersWithPhoto = proPlayers.filter((p) => overrideNicknames.has(p.nickname));
  const missingProPlayers = proPlayers.filter((p) => !overrideNicknames.has(p.nickname));

  const now = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });

  const lines: string[] = [
    "# Player Photo Coverage Report",
    "",
    `**Generated:** ${now}`,
    countryFilter ? `**Country filter:** ${countryFilter}` : "**Scope:** All countries",
    "",
    "## Summary",
    "",
    "| Metric | Count |",
    "|---|---|",
    `| Total people in snapshot | ${players.length} |`,
    `| Pro Players | ${proPlayers.length} |`,
    `| Team Staff | ${staff.length} |`,
    `| Broadcast Talent | ${talent.length} |`,
    `| Needs Review | ${needsReview.length} |`,
    `| Players with photo override | ${playersWithPhoto.length} |`,
    `| Pro Players with photo | ${proPlayersWithPhoto.length} |`,
    `| Pro Players missing photo | ${missingProPlayers.length} |`,
    `| Photo files in public/player-photos/ | ${photoFiles.size} |`,
    "",
    "## Existing Photo Mappings",
    "",
  ];

  if (overrideNicknames.size > 0) {
    lines.push("| Nickname | Photo File |");
    lines.push("|---|---|");
    for (const nick of [...overrideNicknames].sort()) {
      const p = players.find((x) => x.nickname === nick);
      const role = p?.primaryRole || "—";
      lines.push(`| ${nick} (${role}) | ✅ Mapped |`);
    }
  } else {
    lines.push("No photo overrides mapped yet.");
  }

  lines.push("");
  lines.push("## Missing Pro Player Photos (first 100)");
  lines.push("");

  if (missingProPlayers.length > 0) {
    lines.push("| # | Nickname | Real Name | Role | Team |");
    lines.push("|---|---|---|---|---|");
    missingProPlayers.slice(0, 100).forEach((p, i) => {
      const team = p.teamReferenceReadable || p.teamReference || "—";
      const role = p.primaryRole || "—";
      lines.push(`| ${i + 1} | ${p.nickname} | ${p.realName || "—"} | ${role} | ${team} |`);
    });
    if (missingProPlayers.length > 100) {
      lines.push(`| ... | ... | ... | ... | ... |`);
      lines.push(`| Total missing: ${missingProPlayers.length} | | | | |`);
    }
  } else {
    lines.push("All pro players have photo overrides! 🎉");
  }

  lines.push("");
  lines.push("## How to Add a Player Photo");
  lines.push("");
  lines.push("1. Add image file to `public/player-photos/<nickname>.png`");
  lines.push("2. Add entry in `src/data/playerPhotoOverrides.ts`:");
  lines.push("   ```ts");
  lines.push('   "Nickname": { src: "/player-photos/nickname.png", scale: 1.3, offsetY: 12 },');
  lines.push("   ```");
  lines.push("3. Run `npm run report:player-photos` to update this report.");
  lines.push("");
  lines.push("## How to Add Approved Photo Sources");
  lines.push("");
  lines.push("1. Edit `data/player-photo-sources.json` with approved URLs");
  lines.push("2. Run `npm run sync:player-photos` to download");
  lines.push("3. Do NOT add unapproved/copyrighted images");
  lines.push("");
  lines.push("## Paths");
  lines.push("");
  lines.push("- Photo folder: `public/player-photos/`");
  lines.push("- Override map: `src/data/playerPhotoOverrides.ts`");
  lines.push("- Sources manifest: `data/player-photo-sources.json`");
  lines.push("");

  if (!fs.existsSync(path.dirname(REPORT_FILE))) fs.mkdirSync(path.dirname(REPORT_FILE), { recursive: true });
  fs.writeFileSync(REPORT_FILE, lines.join("\n"), "utf8");
  console.log(`[report] Wrote ${REPORT_FILE}`);
  console.log(`[report] Total: ${players.length}, Pro: ${proPlayers.length}, With photo: ${playersWithPhoto.length}, Missing: ${missingProPlayers.length}`);
}

main();
