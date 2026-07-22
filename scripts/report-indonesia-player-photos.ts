/**
 * Generate Indonesian Pro Player photo target list from local snapshot.
 * Run: npm run report:player-photos:id
 * Generates: data/player-photo-indonesia-targets.json
 */
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const PLAYERS_FILE = path.join(ROOT, "data", "liquipedia", "players.json");
const OVERRIDES_FILE = path.join(ROOT, "src", "data", "playerPhotoOverrides.ts");
const PHOTOS_DIR = path.join(ROOT, "public", "player-photos");
const OUT_FILE = path.join(ROOT, "data", "player-photo-indonesia-targets.json");
const REPORT_FILE = path.join(ROOT, "reports", "player-photo-indonesia-photo-pack-report.md");

const POPULAR_TEAMS: Record<string, string[]> = {
  ONIC: ["onic", "onic esports"],
  RRQ: ["rrq", "rrq hoshi"],
  EVOS: ["evos", "evos legends"],
  BTR: ["bigetron", "bigetron alpha", "btr"],
  TLID: ["team liquid id", "team liquid indonesia", "tlid"],
  AE: ["alter ego", "ae"],
  GEEK: ["geek fam", "geek", "geekfam"],
  DEWA: ["dewa united", "dewa"],
  NAVI: ["natus vincere", "navi"],
};

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
    const matches = content.matchAll(/["']?([A-Za-z0-9_\- ]+)["']?\s*:\s*\{/g);
    for (const m of matches) {
      const key = m[1].trim();
      if (key && !["src", "scale", "offsetX", "offsetY", "objectPosition", "credit", "sourceUrl"].includes(key)) {
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
        if (/\.(png|jpg|jpeg|webp)$/i.test(f)) result.add(f.toLowerCase());
      }
    }
  } catch {}
  return result;
}

function matchTeam(teamRef: string | null, teamTemplate: string | null): string | null {
  const ref = (teamRef || "").toLowerCase();
  const tmpl = (teamTemplate || "").toLowerCase();
  for (const [short, aliases] of Object.entries(POPULAR_TEAMS)) {
    for (const alias of aliases) {
      if (ref.includes(alias) || tmpl.includes(alias)) return short;
    }
  }
  return null;
}

function main() {
  const players = readPlayers();
  const overrideNicknames = readOverrideNicknames();
  const photoFiles = readPhotoFiles();

  // Filter Indonesian players
  const indoPlayers = players.filter((p) => {
    const nat = (p.nationality || "").toLowerCase();
    return nat === "indonesia" || nat === "indonesian";
  });

  // Indonesian pro players
  const indoPro = indoPlayers.filter((p) =>
    p.roleCategory === "pro_player" || p.isProPlayer || p.roleCategory === "players"
  );

  // Indonesian staff/talent
  const indoStaff = indoPlayers.filter((p) =>
    p.roleCategory === "team_staff" || p.isTeamStaff || p.roleCategory === "staff"
  );
  const indoTalent = indoPlayers.filter((p) =>
    p.roleCategory === "broadcast_talent" || p.isBroadcastTalent || p.roleCategory === "talent"
  );

  // Build target list with priority
  const targets = indoPro.map((p) => {
    const team = matchTeam(p.teamReferenceReadable || p.teamReference, p.teamTemplate);
    const hasPhoto = overrideNicknames.has(p.nickname) || photoFiles.has(`${(p.nickname || "").toLowerCase()}.png`);
    const isActive = (p.status || "").toLowerCase() === "active";
    const hasHeroes = p.signatureHeroes && p.signatureHeroes.length > 0;

    let priority = 5;
    if (hasPhoto) priority = 0;
    else if (team && isActive) priority = 1;
    else if (team) priority = 2;
    else if (isActive && hasHeroes) priority = 3;
    else if (isActive) priority = 4;

    return {
      nickname: p.nickname,
      realName: p.realName || null,
      role: p.primaryRole || null,
      team: team || p.teamReferenceReadable || p.teamReference || null,
      status: p.status || null,
      hasPhoto,
      photoPath: hasPhoto ? `/player-photos/${p.nickname.toLowerCase()}.png` : null,
      priority,
    };
  }).sort((a, b) => a.priority - b.priority || a.nickname.localeCompare(b.nickname));

  // Write targets JSON
  if (!fs.existsSync(path.dirname(OUT_FILE))) fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, JSON.stringify(targets, null, 2), "utf8");

  const withPhoto = targets.filter((t) => t.hasPhoto).length;
  const missing = targets.filter((t) => !t.hasPhoto).length;

  // Write report
  const now = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" });
  const lines: string[] = [
    "# Indonesia Player Photo Pack Report",
    "",
    `**Generated:** ${now}`,
    "",
    "## Summary",
    "",
    "| Metric | Count |",
    "|---|---|",
    `| Total people in snapshot | ${players.length} |`,
    `| Indonesian people | ${indoPlayers.length} |`,
    `| Indonesian Pro Players | ${indoPro.length} |`,
    `| Indonesian Staff | ${indoStaff.length} |`,
    `| Indonesian Broadcast Talent | ${indoTalent.length} |`,
    `| Indonesian Pro Players with photo | ${withPhoto} |`,
    `| Indonesian Pro Players missing photo | ${missing} |`,
    "",
    "## Files",
    "",
    "| File | Path |",
    "|---|---|",
    "| Target list | `data/player-photo-indonesia-targets.json` |",
    "| Approved sources | `data/player-photo-sources-indonesia.json` |",
    "| Photo folder | `public/player-photos/` |",
    "| Override map | `src/data/playerPhotoOverrides.ts` |",
    "| This report | `reports/player-photo-indonesia-photo-pack-report.md` |",
    "",
    "## Existing Photo Mappings",
    "",
  ];

  const mapped = targets.filter((t) => t.hasPhoto);
  if (mapped.length > 0) {
    lines.push("| Nickname | Role | Team | Photo |");
    lines.push("|---|---|---|---|");
    for (const t of mapped) {
      lines.push(`| ${t.nickname} | ${t.role || "—"} | ${t.team || "—"} | ✅ |`);
    }
  } else {
    lines.push("No Indonesian pro player photos mapped yet.");
  }

  lines.push("");
  lines.push("## Missing Indonesian Pro Player Photos (first 100 by priority)");
  lines.push("");

  const missingList = targets.filter((t) => !t.hasPhoto);
  if (missingList.length > 0) {
    lines.push("| # | Priority | Nickname | Role | Team | Status |");
    lines.push("|---|---|---|---|---|---|");
    missingList.slice(0, 100).forEach((t, i) => {
      lines.push(`| ${i + 1} | P${t.priority} | ${t.nickname} | ${t.role || "—"} | ${t.team || "—"} | ${t.status || "—"} |`);
    });
    if (missingList.length > 100) {
      lines.push(`| ... | ... | ... | ... | ... | ... |`);
      lines.push(`| Total missing: ${missingList.length} | | | | | |`);
    }
  } else {
    lines.push("All Indonesian pro players have photos! 🎉");
  }

  lines.push("");
  lines.push("## Priority Legend");
  lines.push("");
  lines.push("| Priority | Description |");
  lines.push("|---|---|");
  lines.push("| P0 | Already has photo |");
  lines.push("| P1 | Popular Indonesian team + Active |");
  lines.push("| P2 | Popular Indonesian team |");
  lines.push("| P3 | Active + has signature heroes |");
  lines.push("| P4 | Active |");
  lines.push("| P5 | Other |");
  lines.push("");
  lines.push("## How to Add Photos");
  lines.push("");
  lines.push("1. Add approved image URLs to `data/player-photo-sources-indonesia.json`");
lines.push("2. Run `npm run sync:player-photos:id` to download");
  lines.push("3. Add override entries in `src/data/playerPhotoOverrides.ts`");
  lines.push("4. Run `npm run report:player-photos:id` to update this report");
  lines.push("");
  lines.push("## Commands");
  lines.push("");
  lines.push("| Command | Description |");
  lines.push("|---|---|");
  lines.push("| `npm run report:player-photos:id` | Generate Indonesia target list + coverage report |");
  lines.push("| `npm run sync:player-photos:id` | Download approved Indonesia photos |");
  lines.push("");

  fs.writeFileSync(REPORT_FILE, lines.join("\n"), "utf8");

  console.log(`[report] Wrote ${OUT_FILE}`);
  console.log(`[report] Wrote ${REPORT_FILE}`);
  console.log(`[report] Indonesian Pro Players: ${indoPro.length}, With photo: ${withPhoto}, Missing: ${missing}`);
}

main();
