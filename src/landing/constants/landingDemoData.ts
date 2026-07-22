export const DEMO_HEROES = [
  "Fanny", "Zhuxin", "Martis", "Beatrix", "Tigreal",
  "Atlas", "Valentina", "Fredrinn", "Miya", "Hayabusa",
  "Kagura", "Lancelot",
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
    commentary: ["Enemy removing early jungle pressure.", "Signal: they fear aggression, not rotation."],
  },
  {
    phaseNumber: 2,
    action: "ban" as const,
    side: "blue" as const,
    heroName: "Zhuxin",
    commentary: ["This ban protects your anti-dive setup.", "Zhuxin controls space too well in teamfights."],
  },
  {
    phaseNumber: 3,
    action: "ban" as const,
    side: "blue" as const,
    heroName: "Badang",
    commentary: ["Noise ban: looks like gold lane concern.", "Hides your real jungle plan behind misdirection."],
  },
  {
    phaseNumber: 4,
    action: "pick" as const,
    side: "red" as const,
    heroName: "Fredrinn",
    commentary: ["Enemy picked slow objective core.", "They want extended fights and Turtle control."],
  },
  {
    phaseNumber: 5,
    action: "pick" as const,
    side: "blue" as const,
    heroName: "Lancelot",
    commentary: ["AI pivots the plan.", "Punish Turtle setup through mid pressure and fast rotation."],
  },
] as const;

export const FEATURE_CARDS: Array<{ id: string; title: string; description: string; ctaLabel: string; ctaTargetTab: string; testId: string }> = [
  { id: "draft", title: "Draft War Room", description: "Simulate 5v5 drafts with AI coaching in real-time.", ctaLabel: "Open Draft", ctaTargetTab: "draft", testId: "cta-open-warroom" },
  { id: "intel", title: "Hero Intelligence", description: "Deep analysis for every hero: counters, synergies, and draft value.", ctaLabel: "Explore Heroes", ctaTargetTab: "intelligence", testId: "cta-explore-heroes" },
  { id: "stats", title: "MPL Hero Stats", description: "Tournament-grade pick/ban analytics from MPL ID S17.", ctaLabel: "View Stats", ctaTargetTab: "heroes", testId: "cta-view-mpl" },
  { id: "catalog", title: "Data Catalog", description: "Items, emblems, and battle spells with full stat breakdowns.", ctaLabel: "Open Catalog", ctaTargetTab: "items", testId: "cta-open-catalog" },
  { id: "teams", title: "Team Analytics", description: "Team compositions, win conditions, and match scouting.", ctaLabel: "Analyze Teams", ctaTargetTab: "teams", testId: "cta-analyze-teams" },
  { id: "planner", title: "Team Draft Planner", description: "Plan tournament drafts with team-specific strategies.", ctaLabel: "Open Planner", ctaTargetTab: "tdp", testId: "cta-open-planner" },
  { id: "macro", title: "Macro Map Planner", description: "Visualize rotations, objectives, and lane assignments.", ctaLabel: "Open Map", ctaTargetTab: "macro", testId: "cta-plan-macro" },
];

export const ROADMAP_MODES = [
  { id: "manual", name: "Manual Draft", description: "Full control. You ban, you pick, you plan.", status: "live" as const },
  { id: "coach", name: "Assisted Coach", description: "AI suggests counters, reads hidden plans, flags risks.", status: "live" as const },
  { id: "pro", name: "Pro War Room", description: "Team prep, scouting, deception logic, meta sync.", status: "coming" as const },
];

export const META_STATS = [
  { value: "132+", label: "Heroes Analyzed" },
  { value: "82", label: "MPL Tournament Heroes" },
  { value: "171+", label: "Draft Series Tracked" },
  { value: "6", label: "MPL ID S17 Teams" },
  { value: "144", label: "Items Cataloged" },
  { value: "7", label: "Emblem Systems" },
];

export const HOW_IT_WORKS_STEPS = [
  { num: "01", title: "Enemy signals appear", description: "Bans and picks reveal intentions. Every choice tells a story about their strategy." },
  { num: "02", title: "AI reads the draft", description: "The engine detects patterns, counter-strategies, and hidden win conditions." },
  { num: "03", title: "You pick with intent", description: "Counter-picks, flex picks, and synergy suggestions based on real data." },
];

export const AI_ANALYSIS_PREVIEW = {
  teamBlue: "ONIC Esports",
  teamRed: "Natus Vincere",
  compositionIdentity: ["Engage", "Pickoff"],
  winCondition: "Force Turtle 1-2, snowball through mid control. Prioritize early fight over farm.",
  riskDistribution: { early: 30, mid: 50, late: 20 },
  laneRead: [
    { lane: "EXP", status: "slight win", color: "emerald" },
    { lane: "JGL", status: "neutral", color: "gray" },
    { lane: "MID", status: "safe", color: "cyan" },
    { lane: "GOLD", status: "danger", color: "red" },
    { lane: "ROAM", status: "flexible", color: "amber" },
  ],
  targetPriority: ["Gold Lane", "Roamer", "Jungler"],
  macroTimeline: ["Turtle 1", "Turtle 2", "Lord Setup", "Teamfight Window"],
  draftWarning: "Low sustain if fight extends past 14 minutes.",
  aiCoachNote: "Do not fight front-to-back after minute 14. Use pick-offs and rotations.",
};
