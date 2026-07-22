import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Ban,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Compass,
  Copy,
  Download,
  FileText,
  HelpCircle,
  Pencil,
  Plus,
  Swords,
  Target,
  Trash2,
  X,
} from "lucide-react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import FallbackImage from "./FallbackImage";
import { getHeroImageUrl } from "../lib/heroUtils";
import { HeroStats } from "../types";
import TdpOnboarding, { isTdpTutorialCompleted } from "./TdpOnboarding";
import TdpGuidedTour from "./TdpGuidedTour";
import heroesMaster from "../data/heroes_master.json";
import {
  LANES,
  LANE_LABEL,
  LANE_COLORS,
  type Lane,
  type LanePlan,
  type DraftPlan,
  type Tournament,
  type PickerTarget,
  emptyLanes,
  emptyPlan,
  emptyTournament,
} from "../lib/draftTypes";
import { loadDraftData, saveDraftData, sanitizeFilename } from "../lib/draftStorage";

const HERO_LANE_MAP: Record<string, string[]> = {};
(heroesMaster as any[]).forEach((h) => {
  const key = (h.hero_name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const lanes: string[] = [];
  if (h.lanes) {
    h.lanes.forEach((l: string) => {
      const lower = l.toLowerCase();
      if (lower.includes("exp")) lanes.push("EXP");
      else if (lower.includes("jungle") || lower.includes("jungler")) lanes.push("Jungle");
      else if (lower.includes("mid")) lanes.push("Mid");
      else if (lower.includes("gold")) lanes.push("Gold");
      else if (lower.includes("roam") || lower.includes("roamer") || lower.includes("support")) lanes.push("Roam");
    });
  }
  if (h.role && Array.isArray(h.role)) {
    h.role.forEach((r: string) => {
      const lower = r.toLowerCase();
      if (lower.includes("tank") && !lanes.includes("Roam")) lanes.push("Roam");
      if (lower.includes("support") && !lanes.includes("Roam")) lanes.push("Roam");
    });
  }
  if (lanes.length === 0 && key) {
    HERO_LANE_MAP[key] = ["EXP", "Jungle", "Mid", "Gold", "Roam"];
  } else if (key) {
    HERO_LANE_MAP[key] = [...new Set(lanes)];
  }
});

function exportDraftToPrint(selectedTour: Tournament | null, selectedDraft: DraftPlan) {
  const tourName = selectedTour?.name || "Tournament";
  const draftName = selectedDraft.name;
  const side = selectedDraft.side;
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const bansHtml = (bans: string[]) =>
    bans.map((h, i) => `<div style="display:flex;align-items:center;gap:8px;padding:4px 0;"><span style="font-weight:700;color:#666;width:20px;">${i + 1}.</span><span style="font-weight:600;">${h || "—"}</span></div>`).join("");

  const pickHtml = (lanes: Record<Lane, LanePlan>, laneOrder: Lane[]) =>
    laneOrder.map((lane) => {
      const plan = lanes[lane];
      const lc = LANE_COLORS[lane];
      return `<div style="display:flex;align-items:center;gap:10px;padding:6px 0;border-bottom:1px solid #eee;">
        <span style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:24px;border-radius:12px;font-size:10px;font-weight:800;letter-spacing:0.05em;color:${lc.hex};background:${lc.hex}15;border:1px solid ${lc.hex}30;">${LANE_LABEL[lane]}</span>
        <span style="font-weight:700;font-size:13px;">${plan.main || "—"}</span>
        ${plan.backups.filter(Boolean).length > 0 ? `<span style="font-size:10px;color:#888;margin-left:auto;">ALT: ${plan.backups.filter(Boolean).join(", ") || "—"}</span>` : ""}
      </div>`;
    }).join("");

  const notesHtml = selectedDraft.notes
    ? `<div style="margin-top:16px;padding:12px;border:1px solid #ddd;border-radius:8px;background:#f9fafb;"><div style="font-weight:700;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#555;margin-bottom:8px;">Coach Notes</div><div style="white-space:pre-wrap;font-size:12px;line-height:1.6;color:#333;">${selectedDraft.notes}</div></div>`
    : "";

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${sanitizeFilename(tourName)}-${sanitizeFilename(draftName)}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:32px;color:#111}.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #111}.header h1{font-size:22px;font-weight:900}.header .meta{text-align:right;font-size:11px;color:#666}.sides{display:grid;grid-template-columns:1fr 1fr;gap:24px}.side-section{border:1px solid #ddd;border-radius:8px;padding:16px}.side-header{display:flex;align-items:center;gap:8px;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid #eee}.side-dot{width:8px;height:8px;border-radius:50%}.side-title{font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:.15em}.section-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.12em;color:#888;margin:12px 0 6px}.footer{margin-top:24px;padding-top:12px;border-top:1px solid #ddd;font-size:9px;color:#999;text-align:center;text-transform:uppercase;letter-spacing:.1em}@media print{body{padding:16px}}</style></head><body><div class="header"><div><h1>MLBB DRAFT PLAN</h1><div style="font-size:12px;color:#444;margin-top:4px;">${tourName} / ${draftName}</div></div><div class="meta"><div style="font-size:11px;font-weight:700;color:${side === "BLUE" ? "#3b82f6" : "#ef4444"};">${side === "BLUE" ? "BLUE SIDE" : "RED SIDE"}</div><div style="margin-top:2px;">${date}</div></div></div><div class="sides"><div class="side-section"><div class="side-header"><div class="side-dot" style="background:#3b82f6;"></div><span class="side-title" style="color:#3b82f6;">Blue Side</span>${side === "BLUE" ? '<span style="font-size:9px;font-weight:800;padding:2px 6px;border-radius:4px;background:#3b82f615;color:#3b82f6;border:1px solid #3b82f630;">OURS</span>' : ""}</div><div class="section-label">Bans</div>${bansHtml(selectedDraft.blueBans)}<div class="section-label">Picks</div>${pickHtml(selectedDraft.blueLanes, selectedDraft.blueLaneOrder)}</div><div class="side-section"><div class="side-header"><div class="side-dot" style="background:#ef4444;"></div><span class="side-title" style="color:#ef4444;">Red Side</span>${side === "RED" ? '<span style="font-size:9px;font-weight:800;padding:2px 6px;border-radius:4px;background:#ef444415;color:#ef4444;border:1px solid #ef444430;">OURS</span>' : ""}</div><div class="section-label">Bans</div>${bansHtml(selectedDraft.redBans)}<div class="section-label">Picks</div>${pickHtml(selectedDraft.redLanes, selectedDraft.redLaneOrder)}</div></div>${notesHtml}<div class="footer">Generated by MLBB Draft Coach Toolkit</div></body></html>`;

  const w = window.open("", "_blank");
  if (w) { w.document.write(html); w.document.close(); setTimeout(() => w.print(), 400); }
}

interface TeamDraftPlannerProps {
  heroes: HeroStats[];
  heroAssets: Record<string, string>;
}

export default function TeamDraftPlanner({ heroes, heroAssets }: TeamDraftPlannerProps) {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);
  const [pickerSlot, setPickerSlot] = useState<PickerTarget | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [laneFilter, setLaneFilter] = useState<string>("All");
  const [exporting, setExporting] = useState(false);
  const [showTutorial, setShowTutorial] = useState(() => !isTdpTutorialCompleted());
  const [showGuidedTour, setShowGuidedTour] = useState(false);
  const [showReplayConfirm, setShowReplayConfirm] = useState(false);
  const [showReminder, setShowReminder] = useState(() => isTdpTutorialCompleted());
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showTourMenu, setShowTourMenu] = useState(false);
  const [exportMenuPos, setExportMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [renamingTour, setRenamingTour] = useState(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const exportBtnRef = useRef<HTMLButtonElement>(null);
  const exportDropdownRef = useRef<HTMLDivElement>(null);
  const tourMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const d = loadDraftData();
    setTournaments(d.tournaments);
    setSelectedTourId(d.selectedTourId);
    setSelectedDraftId(d.selectedDraftId);
  }, []);

  // Escape key closes menus
  useEffect(() => {
    if (!showExportMenu && !showTourMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowExportMenu(false);
        setShowTourMenu(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showExportMenu, showTourMenu]);

  // Tour menu click-outside
  useEffect(() => {
    if (!showTourMenu) return;
    const close = (e: MouseEvent) => {
      if (tourMenuRef.current && !tourMenuRef.current.contains(e.target as Node)) {
        setShowTourMenu(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [showTourMenu]);

  const persist = useCallback((tours: Tournament[], tourId: string | null, draftId: string | null) => {
    saveDraftData(tours, tourId, draftId);
  }, []);

  const selectedTour = tournaments.find((t) => t.id === selectedTourId) || null;
  const selectedDraft = selectedTour?.drafts.find((d) => d.id === selectedDraftId) || null;

  const updateDraft = useCallback(
    (updater: (d: DraftPlan) => DraftPlan) => {
      if (!selectedTourId || !selectedDraftId) return;
      setTournaments((prev) => {
        const next = prev.map((t) =>
          t.id !== selectedTourId ? t : { ...t, drafts: t.drafts.map((d) => (d.id !== selectedDraftId ? d : { ...updater(d), updatedAt: Date.now() })) }
        );
        persist(next, selectedTourId, selectedDraftId);
        return next;
      });
    },
    [selectedTourId, selectedDraftId, persist]
  );

  const createTournament = () => {
    const t = emptyTournament(`Tournament ${tournaments.length + 1}`);
    setTournaments((prev) => { const next = [...prev, t]; persist(next, t.id, t.drafts[0].id); return next; });
    setSelectedTourId(t.id);
    setSelectedDraftId(t.drafts[0].id);
  };

  const createDraft = () => {
    if (!selectedTourId) return;
    const d = emptyPlan(`Draft ${(selectedTour?.drafts.length || 0) + 1}`);
    setTournaments((prev) => { const next = prev.map((t) => (t.id !== selectedTourId ? t : { ...t, drafts: [...t.drafts, d] })); persist(next, selectedTourId, d.id); return next; });
    setSelectedDraftId(d.id);
  };

  const duplicateDraft = () => {
    if (!selectedTourId || !selectedDraft) return;
    const copy: DraftPlan = { ...selectedDraft, id: `draft_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, name: `${selectedDraft.name} (copy)`, createdAt: Date.now(), updatedAt: Date.now(), pickOrder: selectedDraft.pickOrder || "first", blueLanes: JSON.parse(JSON.stringify(selectedDraft.blueLanes)), redLanes: JSON.parse(JSON.stringify(selectedDraft.redLanes)) };
    setTournaments((prev) => { const next = prev.map((t) => (t.id !== selectedTourId ? t : { ...t, drafts: [...t.drafts, copy] })); persist(next, selectedTourId, copy.id); return next; });
    setSelectedDraftId(copy.id);
  };

  const deleteDraft = (tourId: string, draftId: string) => {
    setTournaments((prev) => {
      const next = prev.map((t) => (t.id !== tourId ? t : { ...t, drafts: t.drafts.filter((d) => d.id !== draftId) }));
      if (selectedDraftId === draftId) { const tour = next.find((t) => t.id === tourId); setSelectedDraftId(tour?.drafts[0]?.id || null); }
      persist(next, tourId, selectedDraftId === draftId ? next.find((t) => t.id === tourId)?.drafts[0]?.id || null : selectedDraftId);
      return next;
    });
  };

  const deleteTournament = (tourId: string) => {
    setTournaments((prev) => {
      const next = prev.filter((t) => t.id !== tourId);
      const newTour = next[0] || null;
      setSelectedTourId(newTour?.id || null);
      setSelectedDraftId(newTour?.drafts[0]?.id || null);
      persist(next, newTour?.id || null, newTour?.drafts[0]?.id || null);
      return next;
    });
  };

  const setBan = (side: "BLUE" | "RED", index: number, value: string) => {
    updateDraft((d) => { const key = side === "BLUE" ? "blueBans" : "redBans"; const arr = [...d[key]]; arr[index] = value; return { ...d, [key]: arr }; });
  };

  const setLaneMain = (side: "BLUE" | "RED", lane: Lane, value: string) => {
    updateDraft((d) => { const key = side === "BLUE" ? "blueLanes" : "redLanes"; return { ...d, [key]: { ...d[key], [lane]: { ...d[key][lane], main: value } } }; });
  };

  const setLaneBackup = (side: "BLUE" | "RED", lane: Lane, backupIndex: number, value: string) => {
    updateDraft((d) => { const key = side === "BLUE" ? "blueLanes" : "redLanes"; const backups = [...d[key][lane].backups]; backups[backupIndex] = value; return { ...d, [key]: { ...d[key], [lane]: { ...d[key][lane], backups } } }; });
  };

  const clearSlot = (target: PickerTarget) => {
    if (target.type === "ban") setBan(target.side, target.index, "");
    else if (target.type === "pick") setLaneMain(target.side, target.lane, "");
    else setLaneBackup(target.side, target.lane, target.backupIndex, "");
  };

  const swapLane = (side: "BLUE" | "RED", fromIdx: number, toIdx: number) => {
    updateDraft((d) => { const key = side === "BLUE" ? "blueLaneOrder" : "redLaneOrder"; const order = [...d[key]]; const t = order[fromIdx]; order[fromIdx] = order[toIdx]; order[toIdx] = t; return { ...d, [key]: order }; });
  };

  const applyPick = (target: PickerTarget, heroName: string) => {
    if (target.type === "ban") setBan(target.side, target.index, heroName);
    else if (target.type === "pick") setLaneMain(target.side, target.lane, heroName);
    else setLaneBackup(target.side, target.lane, target.backupIndex, heroName);
  };

  const usedHeroes = useMemo(() => {
    if (!selectedDraft) return new Set<string>();
    const s = new Set<string>();
    [...selectedDraft.blueBans, ...selectedDraft.redBans].forEach((h) => { if (h) s.add(h); });
    for (const lanes of [selectedDraft.blueLanes, selectedDraft.redLanes]) {
      for (const lane of LANES) { if (lanes[lane].main) s.add(lanes[lane].main); for (const b of lanes[lane].backups) { if (b) s.add(b); } }
    }
    return s;
  }, [selectedDraft]);

  const heroRosterCount = heroes.length >= 100 ? heroes.length : heroesMaster.length;

  const filteredHeroes = useMemo(() => {
    const q = searchQuery.toLowerCase();
    let list: HeroStats[] = heroes.length >= 100 ? heroes : (heroesMaster as any[]).map((m: any) => ({
      hero_name: m.hero_name, picks_total: "0", picks_win: "0", picks_loss: "0", winrate: "0%", tournament_presence: "0%",
      blue_side_picks: "0", blue_side_win: "0", blue_side_loss: "0", blue_side_wr: "0%",
      red_side_picks: "0", red_side_win: "0", red_side_loss: "0", red_side_wr: "0%",
      bans_total: "0", bans_presence: "0", picks_bans_total: "0", picks_bans_presence: "0",
    } as HeroStats));
    if (q) list = list.filter((h) => h.hero_name.toLowerCase().includes(q));
    if (laneFilter !== "All") list = list.filter((h) => { const key = h.hero_name.toLowerCase().replace(/[^a-z0-9]/g, ""); const hl = HERO_LANE_MAP[key]; return hl && hl.includes(laneFilter); });
    return list;
  }, [heroes, searchQuery, laneFilter]);

  const progress = useMemo(() => {
    if (!selectedDraft) return { bans: 0, picks: 0, pct: 0 };
    const allBans = [...selectedDraft.blueBans, ...selectedDraft.redBans].filter(Boolean);
    const allMains = [selectedDraft.blueLanes, selectedDraft.redLanes].flatMap((l) => LANES.map((lane) => l[lane].main)).filter(Boolean);
    const filled = allBans.length + allMains.length;
    return { bans: allBans.length, picks: allMains.length, pct: Math.round((filled / 20) * 100) };
  }, [selectedDraft]);

  const openPicker = (target: PickerTarget) => {
    setPickerSlot(target);
    setSearchQuery("");
    if (target.type === "pick" || target.type === "backup") setLaneFilter(target.lane);
    else setLaneFilter("All");
  };

  const handleExportPng = async () => {
    if (!boardRef.current || !selectedDraft || exporting) return;
    setShowExportMenu(false);
    setExporting(true);
    try {
      const el = boardRef.current;
      const dataUrl = await toPng(el, {
        backgroundColor: "#0f172a",
        pixelRatio: 2,
        cacheBust: true,
        filter: (node: Element) => {
          if (node instanceof HTMLElement && node.dataset?.noexport) return false;
          return true;
        },
      });
      const ts = Date.now();
      const filename = `${sanitizeFilename(selectedTour?.name || "draft")}-${sanitizeFilename(selectedDraft.name)}-${ts}.png`;
      const link = document.createElement("a");
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export PNG failed:", err);
      alert("Export PNG gagal. Coba lagi atau gunakan Export PDF.");
    } finally {
      setExporting(false);
    }
  };

  const handleExportPdf = async () => {
    if (!boardRef.current || !selectedDraft || exporting) return;
    setShowExportMenu(false);
    setExporting(true);
    try {
      const dataUrl = await toPng(boardRef.current, {
        backgroundColor: "#0f172a",
        pixelRatio: 2,
        cacheBust: true,
        filter: (node: Element) => {
          if (node instanceof HTMLElement && node.dataset?.noexport) return false;
          return true;
        },
      });

      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => { img.onload = resolve; });

      const imgW = img.width;
      const imgH = img.height;
      const isLandscape = imgW > imgH;
      const baseW = 297;
      const pdfW = baseW;
      const pdfH = (imgH * baseW) / imgW;
      const pdf = new jsPDF({ orientation: isLandscape ? "landscape" : "portrait", unit: "mm", format: [pdfW, pdfH] });
      pdf.addImage(dataUrl, "PNG", 0, 0, pdfW, pdfH);

      const tourName = sanitizeFilename(selectedTour?.name || "tournament");
      const draftName = sanitizeFilename(selectedDraft.name);
      pdf.save(`${tourName}-${draftName}.pdf`);
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("Export PDF gagal. Coba lagi.");
    } finally {
      setExporting(false);
    }
  };

  const openExportMenu = () => {
    if (exportBtnRef.current) {
      const rect = exportBtnRef.current.getBoundingClientRect();
      const menuW = 192;
      let left = rect.right - menuW;
      if (left < 8) left = 8;
      if (left + menuW > window.innerWidth - 8) left = window.innerWidth - menuW - 8;
      setExportMenuPos({ top: rect.bottom + 6, left });
    }
    setShowExportMenu(true);
    setShowTourMenu(false);
  };

  return (
    <>
    {showTutorial && <TdpOnboarding onComplete={() => { setShowTutorial(false); setShowReminder(true); }} onStartTour={() => { setShowTutorial(false); setTimeout(() => setShowGuidedTour(true), 300); }} heroAssets={heroAssets} />}
    {showGuidedTour && <TdpGuidedTour onComplete={() => { setShowGuidedTour(false); setShowReminder(true); }} onSkip={() => setShowGuidedTour(false)} />}

    <div className="flex flex-col h-[calc(100vh-56px)] bg-[#0f172a]">

      {/* ═══ HEADER ═══ */}
      <header className="shrink-0 border-b border-slate-700/60 bg-slate-900/80 backdrop-blur-sm">
        {/* Row 1: Title + Tournament controls */}
        <div className="flex items-center gap-3 px-5 py-3">
          <div className="flex items-center gap-2 shrink-0">
            <Swords className="h-4 w-4 text-blue-400" />
            <h1 className="text-sm font-black text-white tracking-tight font-display">MLBB Draft Coach Toolkit</h1>
          </div>

          <div className="w-px h-5 bg-slate-700/40 shrink-0 mx-1" />

          {selectedTour ? (
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              {/* Tournament group */}
              <select
                value={selectedTourId || ""}
                onChange={(e) => {
                  const tid = e.target.value;
                  setSelectedTourId(tid);
                  const tour = tournaments.find((t) => t.id === tid);
                  setSelectedDraftId(tour?.drafts[0]?.id || null);
                }}
                className="bg-slate-800 border border-slate-600/40 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-200 outline-none focus:border-blue-500/50 cursor-pointer max-w-[160px] truncate"
              >
                {tournaments.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              {renamingTour ? (
                <input
                  autoFocus
                  defaultValue={selectedTour.name}
                  onBlur={(e) => { setRenamingTour(false); if (e.target.value.trim()) setTournaments((prev) => { const next = prev.map((t) => t.id === selectedTourId ? { ...t, name: e.target.value.trim() } : t); persist(next, selectedTourId, selectedDraftId); return next; }); }}
                  onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); if (e.key === "Escape") setRenamingTour(false); }}
                  className="bg-slate-800 border border-blue-500/40 rounded-lg px-2 py-1.5 text-xs text-white outline-none w-28"
                />
              ) : (
                <button onClick={() => setRenamingTour(true)} className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 transition cursor-pointer" title="Rename Tournament">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
              <button onClick={() => { if (tournaments.length > 1) deleteTournament(selectedTourId!); else createTournament(); }} className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition cursor-pointer" title="Delete Tournament">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <button onClick={createTournament} className="p-1.5 rounded-lg text-slate-500 hover:text-green-400 hover:bg-green-500/10 border border-transparent hover:border-green-500/20 transition cursor-pointer" title="New Tournament">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex-1" />
          )}

          <div className="relative shrink-0" data-noexport ref={tourMenuRef}>
            <button onClick={(e) => { e.stopPropagation(); setShowTourMenu(!showTourMenu); setShowExportMenu(false); }} className="p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/20 transition cursor-pointer" title="Help & Tutorial">
              <HelpCircle className="h-4 w-4" />
            </button>
            {showTourMenu && (
              <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-xl border border-slate-600/50 bg-slate-800 shadow-2xl overflow-hidden">
                <button onClick={() => { setShowTourMenu(false); setShowReplayConfirm(true); }} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[11px] font-bold text-slate-200 hover:bg-slate-700 transition cursor-pointer">
                  <BookOpen className="h-3.5 w-3.5 text-cyan-400" /> Ulangi Tutorial
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Draft tabs + Progress + Export */}
        {selectedTour && (
          <div className="flex items-center gap-3 px-5 py-2 border-t border-slate-700/30 overflow-x-auto">
            {/* Draft tabs group */}
            <div className="flex items-center gap-1 min-w-0">
              {selectedTour.drafts.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelectedDraftId(d.id)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                    d.id === selectedDraftId ? "bg-blue-600/20 text-blue-300 border border-blue-500/30" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800 border border-transparent"
                  }`}
                >
                  {d.name}
                  {selectedTour.drafts.length > 1 && (
                    <span onClick={(e) => { e.stopPropagation(); deleteDraft(selectedTour.id, d.id); }} className="ml-0.5 text-slate-600 hover:text-rose-400"><X className="h-2.5 w-2.5" /></span>
                  )}
                </button>
              ))}
              <button onClick={createDraft} className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-dashed border-slate-600/40 text-[10px] font-bold text-slate-500 hover:text-blue-400 hover:border-blue-500/30 transition cursor-pointer">
                <Plus className="h-2.5 w-2.5" /> Add
              </button>
            </div>

            <div className="flex-1" />

            {/* Side selection */}
            {selectedDraft && (
              <div className="flex items-center gap-1 shrink-0" data-noexport>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider mr-1">Our Side:</span>
                <button
                  onClick={() => updateDraft((d) => ({ ...d, side: "BLUE", pickOrder: "first" }))}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold transition cursor-pointer ${
                    selectedDraft.side === "BLUE"
                      ? "bg-blue-600 text-white shadow-[0_0_8px_rgba(59,130,246,0.3)]"
                      : "text-slate-500 hover:text-blue-400 border border-slate-600/40 hover:border-blue-500/30"
                  }`}
                >
                  Blue{selectedDraft.side === "BLUE" && <span className="ml-1 text-[8px] text-white/70 font-bold">US</span>}
                </button>
                <button
                  onClick={() => updateDraft((d) => ({ ...d, side: "RED", pickOrder: "second" }))}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold transition cursor-pointer ${
                    selectedDraft.side === "RED"
                      ? "bg-rose-600 text-white shadow-[0_0_8px_rgba(239,68,68,0.3)]"
                      : "text-slate-500 hover:text-rose-400 border border-slate-600/40 hover:border-rose-500/30"
                  }`}
                >
                  Red{selectedDraft.side === "RED" && <span className="ml-1 text-[8px] text-white/70 font-bold">US</span>}
                </button>
              </div>
            )}

            {/* Progress */}
            {selectedDraft && (
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[10px] font-mono text-slate-400">Bans <span className="text-white font-bold">{progress.bans}</span>/10</span>
                <span className="text-[10px] font-mono text-slate-400">Picks <span className="text-white font-bold">{progress.picks}</span>/10</span>
                <span className="text-[10px] font-mono text-slate-400">Complete <span className={`font-bold ${progress.pct === 100 ? "text-green-400" : "text-blue-400"}`}>{progress.pct}%</span></span>
              </div>
            )}

            <div className="w-px h-5 bg-slate-700/40 shrink-0" />

            {/* Export button */}
            <div className="relative shrink-0" data-noexport>
              <button
                ref={exportBtnRef}
                onClick={(e) => {
                  e.stopPropagation();
                  if (showExportMenu) {
                    setShowExportMenu(false);
                  } else {
                    openExportMenu();
                  }
                }}
                disabled={exporting || !selectedDraft}
                data-tour-target="tour-save-btn"
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-3 py-1.5 text-[11px] font-bold text-white transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download className="h-3.5 w-3.5" />
                {exporting ? "Exporting..." : "Export"}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Reminder banner */}
      {showReminder && selectedDraft && (
        <div className="flex items-center justify-center gap-3 bg-blue-600/[0.06] border-b border-blue-500/10 px-4 py-2 shrink-0">
          <span className="text-[10px] text-blue-400/70">Butuh bantuan?</span>
          <button onClick={() => { setShowReminder(false); setShowReplayConfirm(true); }} className="flex items-center gap-1.5 rounded-lg border border-blue-500/25 bg-blue-500/15 px-3 py-1.5 text-[10px] font-bold text-blue-300 hover:bg-blue-500/25 transition cursor-pointer">
            <BookOpen className="h-3.5 w-3.5" /> Buka Tutorial
          </button>
          <button onClick={() => setShowReminder(false)} className="text-[10px] text-slate-600 hover:text-slate-400 cursor-pointer">✕</button>
        </div>
      )}

      {/* ═══ BOARD (SIDE-BY-SIDE) ═══ */}
      {selectedDraft ? (
        <div className="flex-1 overflow-y-auto">
          <div ref={boardRef} className="px-6 py-6 flex flex-col gap-6">

            {/* ═══ BLUE + RED SIDE-BY-SIDE ═══ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              {/* BLUE SIDE */}
              <SidePanel
                side="BLUE"
                draft={selectedDraft}
                heroAssets={heroAssets}
                openPicker={openPicker}
                clearSlot={clearSlot}
                isOurSide={selectedDraft.side === "BLUE"}
              />
              {/* RED SIDE */}
              <SidePanel
                side="RED"
                draft={selectedDraft}
                heroAssets={heroAssets}
                openPicker={openPicker}
                clearSlot={clearSlot}
                isOurSide={selectedDraft.side === "RED"}
              />
            </div>

            {/* ═══ COACH NOTES (CHANGE 8: expanded) ═══ */}
            <section className="border border-slate-700/40 rounded-xl bg-slate-800/30 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-700/30">
                <BookOpen className="h-4 w-4 text-slate-500" />
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">Coach Notes</span>
                <span className="ml-auto text-[9px] font-mono text-slate-600">{selectedDraft.notes.length} chars</span>
              </div>
              <textarea
                value={selectedDraft.notes}
                onChange={(e) => updateDraft((d) => ({ ...d, notes: e.target.value }))}
                className="w-full min-h-[120px] bg-transparent px-4 py-3 text-sm text-slate-200 outline-none resize-none placeholder:text-slate-600"
                placeholder="Strategy notes — ban priorities, win condition, key matchups, rotations, tempo..."
              />
            </section>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Compass className="mx-auto h-12 w-12 text-slate-700 mb-3" />
            <div className="text-sm font-bold text-slate-500">No draft selected</div>
            <p className="mt-1 text-xs text-slate-600">Create a tournament and draft from the header</p>
          </div>
        </div>
      )}
    </div>

    {/* ═══ HERO PICKER MODAL ═══ */}
    {pickerSlot && selectedDraft && (
      <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[10vh] bg-black/70 backdrop-blur-sm" onClick={() => setPickerSlot(null)}>
        <div className="w-full max-w-lg rounded-2xl border border-slate-600/50 bg-slate-900 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-3 border-b border-slate-700/50 px-4 py-3">
            <Swords className="h-4 w-4 text-slate-500 shrink-0" />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {pickerSlot.type === "ban" ? `Ban — ${pickerSlot.side === "BLUE" ? "Blue" : "Red"}` : pickerSlot.type === "pick" ? `${pickerSlot.lane} Main — ${pickerSlot.side === "BLUE" ? "Blue" : "Red"}` : `${pickerSlot.lane} Alt #${pickerSlot.backupIndex + 1} — ${pickerSlot.side === "BLUE" ? "Blue" : "Red"}`}
            </span>
            <span className="text-[9px] font-mono text-slate-600 ml-1">{filteredHeroes.length}/{heroRosterCount}</span>
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search hero..." className="ml-auto flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-600 text-right" autoFocus />
            <button onClick={() => setPickerSlot(null)} className="p-1 text-slate-500 hover:text-white cursor-pointer"><X className="h-4 w-4" /></button>
          </div>
          <div className="flex gap-1 px-4 py-2 border-b border-slate-700/30 overflow-x-auto">
            {["All", "EXP", "Jungle", "Mid", "Gold", "Roam"].map((lf) => (
              <button key={lf} onClick={() => setLaneFilter(lf)} className={`shrink-0 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition cursor-pointer ${
                laneFilter === lf ? (lf === "All" ? "bg-white/10 text-white border border-white/20" : lf === "EXP" ? "bg-rose-500/20 text-rose-300 border border-rose-500/30" : lf === "Jungle" ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : lf === "Mid" ? "bg-slate-400/15 text-slate-300 border border-slate-400/30" : lf === "Gold" ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30" : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30")
                : "text-slate-600 border border-transparent hover:text-slate-400 hover:bg-white/[0.03]"
              }`}>{lf}</button>
            ))}
          </div>
          <div className="max-h-[50vh] overflow-y-auto p-2 grid grid-cols-4 sm:grid-cols-5 gap-1.5">
            {filteredHeroes.map((h) => {
              const isUsed = usedHeroes.has(h.hero_name);
              return (
                <button key={h.hero_name} onClick={() => { applyPick(pickerSlot, h.hero_name); setPickerSlot(null); setSearchQuery(""); }} className={`relative flex flex-col items-center gap-1 rounded-xl p-2 transition cursor-pointer ${isUsed ? "opacity-45 hover:opacity-70" : "hover:bg-white/[0.06]"}`}>
                  <div className={`h-10 w-10 overflow-hidden rounded-lg border bg-slate-800 ${isUsed ? "border-slate-700" : "border-slate-600"}`}>
                    <FallbackImage src={getHeroImageUrl(h.hero_name, heroAssets)} fallbackText={h.hero_name} alt={h.hero_name} className="h-full w-full object-cover" containerClassName="h-full w-full text-[6px]" />
                  </div>
                  <span className={`text-[9px] truncate w-full text-center ${isUsed ? "text-slate-600" : "text-slate-400"}`}>{h.hero_name}</span>
                  {isUsed && <span className="absolute top-1 right-1 rounded bg-slate-700/50 px-1 py-[1px] text-[6px] font-bold uppercase text-slate-400 leading-none">Used</span>}
                </button>
              );
            })}
            {filteredHeroes.length === 0 && <div className="col-span-full py-6 text-center text-xs text-slate-500">No heroes found.</div>}
          </div>
        </div>
      </div>
    )}

    {/* ═══ REPLAY CONFIRMATION MODAL ═══ */}
    {showReplayConfirm && (
      <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowReplayConfirm(false)}>
        <div className="w-full max-w-sm mx-4 rounded-2xl border border-slate-600/50 bg-slate-900 shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-base font-black text-white font-display mb-2">Buka Tutorial TDP?</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-5">Pilih jenis panduan yang mau kamu ulang.</p>
          <div className="flex flex-col gap-2">
            <button onClick={() => { setShowReplayConfirm(false); setShowTutorial(true); }} className="w-full px-4 py-2.5 rounded-lg bg-blue-600/20 border border-blue-500/30 text-xs font-bold text-blue-300 hover:bg-blue-600/30 transition cursor-pointer">Ulangi Intro</button>
            <button onClick={() => { setShowReplayConfirm(false); setShowGuidedTour(true); }} className="w-full px-4 py-2.5 rounded-lg bg-green-600/15 border border-green-500/25 text-xs font-bold text-green-300 hover:bg-green-600/25 transition cursor-pointer">Tur Interface</button>
            <button onClick={() => setShowReplayConfirm(false)} className="w-full px-4 py-2.5 rounded-lg border border-slate-600/40 text-xs font-bold text-slate-400 hover:text-white hover:border-slate-500 transition cursor-pointer">Batal</button>
          </div>
        </div>
      </div>
    )}
    {/* ═══ EXPORT DROPDOWN (PORTAL) ═══ */}
    {showExportMenu && selectedDraft && createPortal(
      <>
        <div
          className="fixed inset-0 z-[9998]"
          onClick={() => setShowExportMenu(false)}
        />
        <div
          ref={exportDropdownRef}
          data-noexport
          className="fixed z-[9999] w-48 rounded-xl border border-slate-600/50 bg-slate-900 shadow-2xl overflow-hidden"
          style={{ top: exportMenuPos.top, left: exportMenuPos.left }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => { setShowExportMenu(false); handleExportPdf(); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[11px] font-bold text-slate-200 hover:bg-slate-700/80 transition cursor-pointer"
          >
            <FileText className="h-3.5 w-3.5 text-amber-400" /> Download PDF
          </button>
          <button
            onClick={() => { setShowExportMenu(false); handleExportPng(); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[11px] font-bold text-slate-200 hover:bg-slate-700/80 transition cursor-pointer border-t border-slate-700/50"
          >
            <Download className="h-3.5 w-3.5 text-cyan-400" /> Download PNG
          </button>
        </div>
      </>,
      document.body
    )}
    </>
  );
}

/* ═══ SIDE PANEL ═══ */
function SidePanel({ side, draft, heroAssets, openPicker, clearSlot, isOurSide }: {
  side: "BLUE" | "RED";
  draft: DraftPlan;
  heroAssets: Record<string, string>;
  openPicker: (t: PickerTarget) => void;
  clearSlot: (t: PickerTarget) => void;
  isOurSide: boolean;
}) {
  const isBlue = side === "BLUE";
  const bans = isBlue ? draft.blueBans : draft.redBans;
  const lanes = isBlue ? draft.blueLanes : draft.redLanes;
  const laneOrder = isBlue ? draft.blueLaneOrder : draft.redLaneOrder;
  const borderColor = isBlue ? "border-blue-500/30" : "border-rose-500/30";
  const accentText = isBlue ? "text-blue-300" : "text-rose-300";
  const accentDot = isBlue ? "bg-blue-400" : "bg-rose-400";
  const headerBg = isBlue ? "bg-blue-950/30" : "bg-rose-950/30";

  return (
    <div className={`flex flex-col gap-5 rounded-xl border-l-4 ${borderColor} bg-slate-800/20 p-5`}>
      {/* Side Header */}
      <div className={`flex items-center gap-3 pb-3 border-b border-slate-700/30 ${headerBg} -mx-5 -mt-5 px-5 pt-4 rounded-t-xl relative`}>
        <div className={`h-2.5 w-2.5 rounded-full ${accentDot}`} />
        <span className={`text-[11px] font-black uppercase tracking-[0.18em] ${accentText}`}>
          {isBlue ? "Blue Side" : "Red Side"}
        </span>
        <span className={`rounded px-2 py-0.5 text-[8px] font-black uppercase tracking-wider ${isBlue ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : "bg-rose-500/20 text-rose-300 border border-rose-500/30"} ${isOurSide ? "visible" : "invisible"}`}>
          OURS
        </span>
      </div>

      {/* Bans */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Ban className="h-3.5 w-3.5 text-rose-400/70" />
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-rose-400/70">Bans</span>
          <span className="text-[9px] font-mono text-slate-600 ml-0.5">({bans.filter(Boolean).length}/5)</span>
        </div>
        <div className="flex gap-2">
          {bans.map((h, i) => (
            <BanRectSlot key={i} hero={h} heroAssets={heroAssets} label={`B${i + 1}`} onClick={() => openPicker({ type: "ban", side, index: i })} onClear={() => clearSlot({ type: "ban", side, index: i })} />
          ))}
        </div>
      </section>

      {/* Picks */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Swords className="h-3.5 w-3.5 text-blue-400/70" />
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-blue-400/70">Picks</span>
        </div>
        <div className="flex gap-2">
          {laneOrder.map((lane, idx) => {
            const plan = lanes[lane];
            const lc = LANE_COLORS[lane];
            return (
              <PickRectSlot
                key={lane}
                hero={plan.main}
                heroAssets={heroAssets}
                lane={lane}
                label={`${LANE_LABEL[lane]}  P${idx + 1}`}
                lc={lc}
                alts={plan.backups.slice(0, 2)}
                onClickMain={() => openPicker({ type: "pick", side, lane })}
                onClearMain={() => clearSlot({ type: "pick", side, lane })}
                onClickAlt={(bi) => openPicker({ type: "backup", side, lane, backupIndex: bi })}
                onClearAlt={(bi) => clearSlot({ type: "backup", side, lane, backupIndex: bi })}
              />
            );
          })}
        </div>
      </section>

      {/* Backup Heroes */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Target className="h-3.5 w-3.5 text-green-400/70" />
          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-green-400/70">Backup Heroes</span>
        </div>
        <div className="flex gap-2">
          {laneOrder.map((lane) => {
            const plan = lanes[lane];
            const lc = LANE_COLORS[lane];
            return (
              <div key={lane} className="flex-1 min-w-0">
                <div className={`inline-flex items-center gap-1 rounded-full border ${lc.border} ${lc.bg} px-1.5 py-0.5 mb-1.5`}>
                  <span className={`text-[8px] font-black uppercase tracking-wider ${lc.text}`}>{LANE_LABEL[lane]}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {plan.backups.map((b, bi) => (
                    <MiniSlot key={bi} hero={b} heroAssets={heroAssets} ring={isBlue ? "border-blue-500/20" : "border-rose-500/20"} onClick={() => openPicker({ type: "backup", side, lane, backupIndex: bi })} onClear={() => clearSlot({ type: "backup", side, lane, backupIndex: bi })} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

/* ═══ BAN RECT SLOT ═══ */
function BanRectSlot({ hero, heroAssets, label, onClick, onClear }: {
  hero: string; heroAssets: Record<string, string>; label: string; onClick: () => void; onClear: () => void;
}) {
  const empty = !hero;
  return (
    <button onClick={onClick} className={`relative w-16 h-16 rounded-xl border-2 flex flex-col items-center justify-center gap-0.5 transition cursor-pointer hover:-translate-y-0.5 hover:shadow-lg ${
      empty ? "border-dashed border-rose-500/25 bg-rose-500/[0.04]" : "border-rose-500/40 bg-rose-500/[0.08]"
    }`}>
      <span className="absolute top-1 left-1.5 text-[7px] font-black text-rose-400/50 uppercase">{label}</span>
      {hero ? (
        <>
          <div className="h-8 w-8 overflow-hidden rounded-lg border border-rose-500/20 bg-slate-800">
            <FallbackImage src={getHeroImageUrl(hero, heroAssets)} fallbackText={hero} alt={hero} className="h-full w-full object-cover" containerClassName="h-full w-full text-[5px]" />
          </div>
          <span className="text-[7px] text-rose-300/70 font-bold truncate max-w-full px-1">{hero}</span>
          <span onClick={(e) => { e.stopPropagation(); onClear(); }} className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-500 hover:text-rose-400 transition cursor-pointer"><X className="h-2 w-2" /></span>
        </>
      ) : (
        <div className="flex flex-col items-center gap-0.5">
          <Ban className="h-3.5 w-3.5 text-rose-500/30" />
          <span className="text-[6px] text-rose-500/30 font-bold">+ Ban</span>
        </div>
      )}
    </button>
  );
}

/* ═══ PICK RECT SLOT (CHANGE 4: horizontal row card) ═══ */
function PickRectSlot({ hero, heroAssets, lane, label, lc, alts, onClickMain, onClearMain, onClickAlt, onClearAlt }: {
  hero: string; heroAssets: Record<string, string>; lane: string; label: string;
  lc: { bg: string; text: string; border: string; hex: string };
  alts: string[]; onClickMain: () => void; onClearMain: () => void;
  onClickAlt: (i: number) => void; onClearAlt: (i: number) => void;
}) {
  const empty = !hero;
  return (
    <div className="flex-1 flex flex-col">
      <div className={`inline-flex items-center gap-1 rounded-full border ${lc.border} ${lc.bg} px-2 py-0.5 mb-2 self-start`}>
        <span className={`text-[9px] font-black uppercase tracking-wider ${lc.text}`}>{lane}</span>
      </div>
      <button onClick={onClickMain} className={`relative w-full h-[80px] max-w-[80px] rounded-xl border-2 flex items-center justify-center transition cursor-pointer hover:-translate-y-0.5 hover:shadow-lg ${
        empty ? "border-dashed border-slate-600/40 bg-slate-800/30" : "border-slate-500/40 bg-slate-800/60"
      }`}>
        <span className="absolute top-1.5 left-2 text-[7px] font-black text-slate-500 uppercase">{label}</span>
        {hero ? (
          <>
            <div className="h-10 w-10 overflow-hidden rounded-lg border border-slate-600/40 bg-slate-900">
              <FallbackImage src={getHeroImageUrl(hero, heroAssets)} fallbackText={hero} alt={hero} className="h-full w-full object-cover" containerClassName="h-full w-full text-[5px]" />
            </div>
            <span className="absolute bottom-1 text-[7px] text-slate-300 font-bold truncate max-w-[90%]">{hero}</span>
            <span onClick={(e) => { e.stopPropagation(); onClearMain(); }} className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-500 hover:text-rose-400 transition cursor-pointer"><X className="h-2 w-2" /></span>
          </>
        ) : (
          <div className="flex flex-col items-center gap-0.5">
            <Swords className="h-4 w-4 text-slate-600" />
            <span className="text-[7px] text-slate-600 font-bold">+ Pick</span>
          </div>
        )}
      </button>
      <div className="flex gap-1 mt-1.5 justify-center">
        {alts.map((a, bi) => (
          <MiniSlot key={bi} hero={a} heroAssets={heroAssets} ring={`border-slate-600/30`} onClick={() => onClickAlt(bi)} onClear={() => onClearAlt(bi)} />
        ))}
      </div>
    </div>
  );
}

/* ═══ MINI SLOT (small backup) ═══ */
function MiniSlot({ hero, heroAssets, ring, onClick, onClear }: {
  hero: string; heroAssets: Record<string, string>; ring: string; onClick: () => void; onClear: () => void;
}) {
  const empty = !hero;
  return (
    <button onClick={onClick} className={`relative h-9 w-9 rounded-lg border ${empty ? "border-dashed border-slate-700/40 bg-slate-800/20" : `${ring} bg-slate-800/40`} flex items-center justify-center transition cursor-pointer hover:scale-110`}>
      {hero ? (
        <>
          <div className="h-7 w-7 overflow-hidden rounded-md border border-slate-600/30 bg-slate-900">
            <FallbackImage src={getHeroImageUrl(hero, heroAssets)} fallbackText={hero} alt={hero} className="h-full w-full object-cover" containerClassName="h-full w-full text-[3px]" />
          </div>
          <span onClick={(e) => { e.stopPropagation(); onClear(); }} className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-600 hover:text-rose-400 transition cursor-pointer"><X className="h-2 w-2" /></span>
        </>
      ) : <span className="text-[10px] text-slate-700">+</span>}
    </button>
  );
}
