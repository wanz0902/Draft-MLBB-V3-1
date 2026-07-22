import { Tournament, DraftPlan, Lane, LANES, LANE_ORDER_BLUE, LANE_ORDER_RED, emptyLanes, emptyTournament } from "./draftTypes";

const STORAGE_KEY = "mlbb_tdp_v3";

interface StorageData {
  tournaments: Tournament[];
  selectedTourId: string | null;
  selectedDraftId: string | null;
}

function migrateOldDraft(d: any): DraftPlan {
  const result: any = { ...d };
  if (!result.blueLaneOrder) result.blueLaneOrder = [...LANE_ORDER_BLUE];
  if (!result.redLaneOrder) result.redLaneOrder = [...LANE_ORDER_RED];
  if (!result.pickOrder) result.pickOrder = "first";
  if (result.blueLanes && result.redLanes) return result as DraftPlan;
  const blueLanes = emptyLanes();
  const redLanes = emptyLanes();
  if (d.blueRoles) {
    for (const lane of LANES) {
      const old = d.blueRoles[lane];
      if (old) {
        blueLanes[lane] = {
          main: old.main || d.bluePicks?.[LANES.indexOf(lane)] || "",
          backups: [old.backup || "", ...Array(6 - 1).fill("")],
        };
      }
    }
  }
  if (d.redRoles) {
    for (const lane of LANES) {
      const old = d.redRoles[lane];
      if (old) {
        redLanes[lane] = {
          main: old.main || d.redPicks?.[LANES.indexOf(lane)] || "",
          backups: [old.backup || "", ...Array(6 - 1).fill("")],
        };
      }
    }
  }
  return {
    ...result,
    blueLanes,
    redLanes,
    blueBans: result.blueBans || Array(5).fill(""),
    redBans: result.redBans || Array(5).fill(""),
    notes: result.notes || "",
    blueLaneOrder: result.blueLaneOrder || [...LANE_ORDER_BLUE],
    redLaneOrder: result.redLaneOrder || [...LANE_ORDER_RED],
    pickOrder: result.pickOrder || "first",
  };
}

export function loadDraftData(): StorageData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      parsed.tournaments = parsed.tournaments.map((t: Tournament) => ({
        ...t,
        drafts: t.drafts.map(migrateOldDraft),
      }));
      return parsed;
    }
  } catch {}
  const t = emptyTournament();
  return { tournaments: [t], selectedTourId: t.id, selectedDraftId: t.drafts[0].id };
}

export function saveDraftData(tournaments: Tournament[], selectedTourId: string | null, selectedDraftId: string | null) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ tournaments, selectedTourId, selectedDraftId }));
  } catch {}
}

export function sanitizeFilename(s: string): string {
  return s.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase();
}
