export const DEMO_HEROES = [
  "Fanny", "Zhuxin", "Martis", "Luo Yi", "Beatrix",
  "Tigreal", "Atlas", "Valentina", "Fredrinn", "Miya",
  "Hayabusa", "Kagura",
] as const;

export const AI_COACH_LINES = [
  "> Enemy ban detected: Fanny",
  "> Signal: early jungle pressure denied",
  "> Recommended: preserve EXP flex pick",
  "> Noise ban available: hide real plan",
  "> Risk: weak late-game front-to-back",
];

export const BAN_PICK_PHASES = [
  {
    phaseNumber: 1,
    action: "ban" as const,
    side: "red" as const,
    heroName: "Fanny",
    commentary: [
      "Enemy removing early jungle pressure.",
      "Signal: they fear aggression, not rotation.",
    ],
  },
  {
    phaseNumber: 2,
    action: "ban" as const,
    side: "blue" as const,
    heroName: "Zhuxin",
    commentary: [
      "Real ban. Removes anti-dive control.",
      "Protects your late-game carry window.",
    ],
  },
  {
    phaseNumber: 3,
    action: "ban" as const,
    side: "blue" as const,
    heroName: "Harith",
    commentary: [
      "Noise ban. Looks like gold concern.",
      "Real plan: hiding jungle route from enemy.",
    ],
  },
  {
    phaseNumber: 4,
    action: "pick" as const,
    side: "red" as const,
    heroName: "Fredrinn",
    commentary: [
      "Enemy locked slow objective core.",
      "Danger: they play for Turtle control.",
    ],
  },
  {
    phaseNumber: 5,
    action: "pick" as const,
    side: "blue" as const,
    heroName: "Martis",
    commentary: [
      "Pivot activated.",
      "Punish slow setup through mid pressure.",
      "New win condition: Turtle 1 snowball.",
    ],
  },
];

export const FEATURE_GRID_DATA = [
  { id: "draft", title: "Draft War Room", description: "5v5 ban/pick simulator dengan AI reading setiap move.", ctaLabel: "Open Draft", ctaTargetTab: "draft" },
  { id: "heroes", title: "Hero Intelligence", description: "132 hero database: counters, draft value, skill context.", ctaLabel: "Explore Heroes", ctaTargetTab: "intelligence" },
  { id: "stats", title: "MPL Hero Stats", description: "Pro tournament presence, winrate, dan pick/ban heatmap.", ctaLabel: "View Stats", ctaTargetTab: "heroes" },
  { id: "catalog", title: "Data Catalog", description: "Items, emblems, dan battle spells dengan filter lengkap.", ctaLabel: "Open Catalog", ctaTargetTab: "items" },
  { id: "profile", title: "Hero Deep Profile", description: "Portrait, skill detail, video preview, build path context.", ctaLabel: "View Profiles", ctaTargetTab: "heroes" },
  { id: "teams", title: "Team Analytics", description: "MPL ID S17 team standings, match history, player data.", ctaLabel: "Analyze Teams", ctaTargetTab: "teams" },
  { id: "planner", title: "Team Draft Planner", description: "Tournament-grade draft board dengan role slot dan backup hero.", ctaLabel: "Open Planner", ctaTargetTab: "tdp" },
  { id: "macro", title: "Macro Map Planner", description: "Turtle, Lord, split push strategy dengan annotasi map.", ctaLabel: "Plan Macro", ctaTargetTab: "macro" },
];

export const ROADMAP_MODES = [
  { name: "Manual Draft", desc: "Control every ban, pick, and role slot yourself. Full draft board. Zero restriction.", status: "active" as const },
  { name: "Assisted Coach", desc: "AI reads signals, suggests counters, flags risks, and explains every move.", status: "active" as const },
  { name: "Pro War Room", desc: "Team scouting, deception draft, multi-player session, and full tournament prep mode.", status: "roadmap" as const },
];

export const SHOWCASE_CARDS = [
  { name: "Draft War Room", desc: "5v5 ban/pick simulator dengan AI reading setiap move.", tab: "draft" },
  { name: "Hero Intelligence", desc: "132 hero database: counters, draft value, skill context.", tab: "intelligence" },
  { name: "MPL Hero Stats", desc: "Pro tournament presence, winrate, pick/ban heatmap.", tab: "heroes" },
  { name: "Data Catalog", desc: "Items, emblems, dan battle spells.", tab: "items" },
  { name: "Team Analytics", desc: "Standings, match history, player data.", tab: "teams" },
  { name: "Draft Planner", desc: "Tournament draft board.", tab: "tdp" },
  { name: "Macro Planner", desc: "Objective routing.", tab: "macro" },
];
