export const LANES = ["EXP", "Jungle", "Mid", "Gold", "Roam"] as const;
export type Lane = (typeof LANES)[number];

export const LANE_ORDER_BLUE: Lane[] = ["EXP", "Jungle", "Mid", "Gold", "Roam"];
export const LANE_ORDER_RED: Lane[] = ["Roam", "Gold", "Mid", "Jungle", "EXP"];

export const LANE_LABEL: Record<Lane, string> = {
  EXP: "EXP",
  Jungle: "JGL",
  Mid: "MID",
  Gold: "GOLD",
  Roam: "ROAM",
};

export const LANE_COLORS: Record<Lane, { bg: string; text: string; border: string; hex: string }> = {
  EXP: { bg: "bg-rose-500/20", text: "text-rose-300", border: "border-rose-500/30", hex: "#ef4444" },
  Jungle: { bg: "bg-blue-500/20", text: "text-blue-300", border: "border-blue-500/30", hex: "#3b82f6" },
  Mid: { bg: "bg-slate-400/15", text: "text-slate-300", border: "border-slate-400/30", hex: "#94a3b8" },
  Gold: { bg: "bg-yellow-500/20", text: "text-yellow-300", border: "border-yellow-500/30", hex: "#eab308" },
  Roam: { bg: "bg-emerald-500/20", text: "text-emerald-300", border: "border-emerald-500/30", hex: "#06b6d4" },
};

export const BACKUP_COUNT = 6;

export interface LanePlan {
  main: string;
  backups: string[];
}

export interface DraftPlan {
  id: string;
  name: string;
  side: "BLUE" | "RED";
  pickOrder: "first" | "second";
  createdAt: number;
  updatedAt: number;
  blueBans: string[];
  redBans: string[];
  blueLanes: Record<Lane, LanePlan>;
  redLanes: Record<Lane, LanePlan>;
  blueLaneOrder: Lane[];
  redLaneOrder: Lane[];
  notes: string;
}

export interface Tournament {
  id: string;
  name: string;
  drafts: DraftPlan[];
}

export type PickerTarget =
  | { type: "ban"; side: "BLUE" | "RED"; index: number }
  | { type: "pick"; side: "BLUE" | "RED"; lane: Lane }
  | { type: "backup"; side: "BLUE" | "RED"; lane: Lane; backupIndex: number };

export function emptyLanePlan(): LanePlan {
  return { main: "", backups: Array(BACKUP_COUNT).fill("") };
}

export function emptyLanes(): Record<Lane, LanePlan> {
  const r: any = {};
  for (const lane of LANES) r[lane] = emptyLanePlan();
  return r;
}

export function emptyPlan(name?: string): DraftPlan {
  return {
    id: `draft_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: name || "Draft 1",
    side: "BLUE",
    pickOrder: "first",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    blueBans: Array(5).fill(""),
    redBans: Array(5).fill(""),
    blueLanes: emptyLanes(),
    redLanes: emptyLanes(),
    blueLaneOrder: [...LANE_ORDER_BLUE],
    redLaneOrder: [...LANE_ORDER_RED],
    notes: "",
  };
}

export function emptyTournament(name?: string): Tournament {
  return {
    id: `tour_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: name || "Tournament 1",
    drafts: [emptyPlan("Draft 1")],
  };
}
