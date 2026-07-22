/**
 * Scrape a single player detail page from Liquipedia API.
 * Run: npx tsx scripts/scrape-player-detail.ts Butss
 *
 * Fetches parsed HTML from Liquipedia, extracts infobox/trivia/stats/achievements/awards,
 * saves to data/players_detail/{nickname}.json.
 */
import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "data", "players_detail");

interface PlayerDetail {
  nickname: string;
  fetchedAt: string;
  info: {
    realName: string | null;
    nationality: string | null;
    born: string | null;
    status: string | null;
    role: string | null;
    alternateIds: string[];
    totalWinnings: string | null;
    team: string | null;
    signatureHeroes: string[];
  };
  socialLinks: { platform: string; url: string }[];
  trivia: string[];
  statistics: string[];
  achievements: { date: string; place: string; tier: string; tournament: string; team: string; result: string; opponent: string; prize: string }[];
  awards: { date: string; tier: string; tournament: string; award: string; team: string; prize: string }[];
}

function clean(s: string): string {
  return (s || "").replace(/\s+/g, " ").replace(/\u00a0/g, " ").trim();
}

function fetchPage(page: string): Promise<string> {
  const url = `https://liquipedia.net/mobilelegends/api.php?action=parse&page=${encodeURIComponent(page)}&format=json&prop=text`;
  console.log(`[scrape] Fetching: ${page}`);
  return fetch(url, {
    headers: { "User-Agent": "MLBBDraftSimulator/1.0 (contact: admin@example.com)", "Accept": "application/json" },
  })
    .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then((j) => j?.parse?.text?.["*"] || "");
}

function parseInfobox($: cheerio.CheerioAPI): PlayerDetail["info"] {
  const box = $(".fo-nttax-infobox");
  const fields: Record<string, string> = {};

  // Each row is a div containing .infobox-description (label) and a sibling div (value)
  box.find("div").each((_, el) => {
    const $el = $(el);
    const desc = $el.find(".infobox-description").text().trim();
    if (!desc) return;
    // Value is the text content of the div after .infobox-description
    const valDiv = $el.find("div[style*='width:50%']").first();
    const val = valDiv.length ? clean(valDiv.text()) : clean($el.children().not(".infobox-description,.infobox-buttons,.infobox-icons,.infobox-header").text());
    if (val && val !== desc) fields[desc] = val;
  });

  // Signature heroes: extract alt text from images
  const heroes: string[] = [];
  const heroSection = box.find(".infobox-description").filter((_, el) => $(el).text().includes("Signature"));
  if (heroSection.length) {
    heroSection.parent().find("img").each((_, img) => {
      const alt = $(img).attr("alt") || "";
      if (alt && !heroes.includes(alt)) heroes.push(alt);
    });
  }

  return {
    realName: fields["Name:"] || fields["Full Name:"] || null,
    nationality: fields["Nationality:"] || fields["Country:"] || null,
    born: fields["Born:"] || null,
    status: fields["Status:"] || null,
    role: fields["Role:"] || null,
    alternateIds: fields["Alternate IDs:"] ? fields["Alternate IDs:"].split(/[,;]/).map((s) => s.trim()).filter(Boolean) : [],
    totalWinnings: fields["Approx. Total Winnings:"] || fields["Total Winnings:"] || null,
    team: fields["Team:"] || fields["Current Team:"] || null,
    signatureHeroes: heroes,
  };
}

function parseSocialLinks($: cheerio.CheerioAPI): PlayerDetail["socialLinks"] {
  const links: PlayerDetail["socialLinks"] = [];
  $(".fo-nttax-infobox a.external").each((_, el) => {
    const href = $(el).attr("href") || "";
    const iconClass = $(el).find("i").attr("class") || "";
    let platform = "link";
    if (iconClass.includes("instagram")) platform = "instagram";
    else if (iconClass.includes("tiktok")) platform = "tiktok";
    else if (iconClass.includes("youtube")) platform = "youtube";
    else if (iconClass.includes("twitter")) platform = "twitter";
    else if (iconClass.includes("facebook")) platform = "facebook";
    else if (iconClass.includes("twitch")) platform = "twitch";
    if (href) links.push({ platform, url: href });
  });
  return links;
}

function parseTrivia($: cheerio.CheerioAPI): string[] {
  const items: string[] = [];
  const triviaH = $("#Trivia").parent();
  // Find the next <ul> after the header
  let ul = triviaH.nextAll("ul").first();
  if (!ul.length) {
    // Try next sibling
    let next = triviaH.next();
    for (let i = 0; i < 3 && next.length; i++) {
      if (next.is("ul")) { ul = next; break; }
      ul = next.find("ul").first();
      if (ul.length) break;
      next = next.next();
    }
  }
  ul.find("li").each((_, li) => {
    const text = clean($(li).text());
    if (text) items.push(text);
  });
  return items;
}

function parseStatistics($: cheerio.CheerioAPI): string[] {
  const items: string[] = [];
  const statsH = $("#Statistics").parent();
  let ul = statsH.nextAll("ul").first();
  if (!ul.length) {
    let next = statsH.next();
    for (let i = 0; i < 3 && next.length; i++) {
      if (next.is("ul")) { ul = next; break; }
      ul = next.find("ul").first();
      if (ul.length) break;
      next = next.next();
    }
  }
  ul.find("li").each((_, li) => {
    const text = clean($(li).text());
    if (text) items.push(text);
  });
  return items;
}

function parseAchievements($: cheerio.CheerioAPI): PlayerDetail["achievements"] {
  const results: PlayerDetail["achievements"] = [];
  const achievH = $("#Achievements").parent();
  // The table is in a div.table2 wrapper
  const table = achievH.nextAll("div.table2,table").first();
  if (!table.length) return results;

  // Skip header row and empty rows
  table.find("tr").each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length < 4) return;
    const date = clean(cells.eq(0).text());
    if (!date || date === "Date") return;
    // Achievements: Date|Place|Tier|Empty|Tournament|Team|Result|Opponent|Prize
    // cells[0]=Date, [1]=Place, [2]=Tier, [3]=empty, [4]=Tournament, [5]=Team, [6]=Result, [7]=Opponent, [8]=Prize
    results.push({
      date: clean(cells.eq(0).text()),
      place: clean(cells.eq(1).text()),
      tier: clean(cells.eq(2).text()),
      tournament: cells.length >= 6 ? clean(cells.eq(4).text()) : "",
      team: cells.length >= 7 ? clean(cells.eq(5).text()) : "",
      result: cells.length >= 8 ? clean(cells.eq(6).text()) : "",
      opponent: cells.length >= 9 ? clean(cells.eq(7).text()) : "",
      prize: cells.length >= 10 ? clean(cells.eq(8).text()) : "",
    });
  });
  return results;
}

function parseAwards($: cheerio.CheerioAPI): PlayerDetail["awards"] {
  const results: PlayerDetail["awards"] = [];
  const awardsH = $("#Awards").parent();
  const table = awardsH.nextAll("div.table2,table").first();
  if (!table.length) return results;

  table.find("tr").each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length < 4) return;
    const date = clean(cells.eq(0).text());
    if (!date || date === "Date") return;
    if (/^\d{4}$/.test(date)) return;
    // Awards: Date|Tier|Empty|Tournament|Award|Team|Prize
    // cells[0]=Date, [1]=Tier, [2]=empty, [3]=Tournament, [4]=Award, [5]=Team, [6]=Prize
    results.push({
      date: clean(cells.eq(0).text()),
      tier: clean(cells.eq(1).text()),
      tournament: cells.length >= 5 ? clean(cells.eq(3).text()) : "",
      award: cells.length >= 6 ? clean(cells.eq(4).text()) : "",
      team: cells.length >= 7 ? clean(cells.eq(5).text()) : "",
      prize: cells.length >= 8 ? clean(cells.eq(6).text()) : "",
    });
  });
  return results;
}

async function main() {
  const nickname = process.argv[2];
  if (!nickname) {
    console.error("Usage: npx tsx scripts/scrape-player-detail.ts <Nickname>");
    process.exit(1);
  }

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  try {
    const html = await fetchPage(nickname);
    if (!html) {
      console.error(`[scrape] No HTML returned for ${nickname}`);
      process.exit(1);
    }

    const $ = cheerio.load(html);

    const info = parseInfobox($);
    const socialLinks = parseSocialLinks($);
    const trivia = parseTrivia($);
    const statistics = parseStatistics($);
    const achievements = parseAchievements($);
    const awards = parseAwards($);

    const detail: PlayerDetail = {
      nickname,
      fetchedAt: new Date().toISOString(),
      info,
      socialLinks,
      trivia,
      statistics,
      achievements,
      awards,
    };

    const outFile = path.join(OUT_DIR, `${nickname.toLowerCase()}.json`);
    fs.writeFileSync(outFile, JSON.stringify(detail, null, 2), "utf8");

    console.log(`[scrape] Saved ${outFile}`);
    console.log(`  Name: ${info.realName || "—"}`);
    console.log(`  Country: ${info.nationality || "—"}`);
    console.log(`  Status: ${info.status || "—"}`);
    console.log(`  Role: ${info.role || "—"}`);
    console.log(`  Heroes: ${info.signatureHeroes.join(", ") || "—"}`);
    console.log(`  Earnings: ${info.totalWinnings || "—"}`);
    console.log(`  Social: ${socialLinks.length} links`);
    console.log(`  Trivia: ${trivia.length} items`);
    console.log(`  Statistics: ${statistics.length} items`);
    console.log(`  Achievements: ${achievements.length} entries`);
    console.log(`  Awards: ${awards.length} entries`);
  } catch (err: any) {
    console.error(`[scrape] Error: ${err.message}`);
    process.exit(1);
  }
}

main();
