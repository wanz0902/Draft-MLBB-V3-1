export interface MembershipPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  monthlyPriceLabel: string;
  description: string;
  badge?: string;
  recommended: boolean;
  features: MembershipFeature[];
  ctaLabel: string;
}

export interface MembershipFeature {
  text: string;
  status: "available" | "limited" | "coming-soon";
}

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: "basic",
    name: "Basic",
    monthlyPrice: 19000,
    monthlyPriceLabel: "Rp19.000",
    description: "Mulai menjelajahi fitur MVP Draft.",
    recommended: false,
    features: [
      { text: "Basic Draft War Room access", status: "available" },
      { text: "Hero Intelligence access", status: "available" },
      { text: "MPL Hero Stats access", status: "available" },
      { text: "Limited AI Draft Analysis", status: "limited" },
      { text: "Basic Data Catalog access", status: "available" },
      { text: "Limited saved drafts", status: "limited" },
    ],
    ctaLabel: "Choose Basic",
  },
  {
    id: "elite",
    name: "Elite",
    monthlyPrice: 49000,
    monthlyPriceLabel: "Rp49.000",
    description: "Untuk pemain aktif, streamer, dan content creator.",
    badge: "MOST POPULAR",
    recommended: true,
    features: [
      { text: "Everything in Basic", status: "available" },
      { text: "Full AI Draft Analysis", status: "available" },
      { text: "Team Analytics access", status: "available" },
      { text: "Team Draft Planner access", status: "available" },
      { text: "Macro Map Planner access", status: "available" },
      { text: "More saved analysis", status: "available" },
      { text: "PNG/PDF export", status: "available" },
      { text: "Priority draft workflow", status: "available" },
    ],
    ctaLabel: "Go Elite",
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 99000,
    monthlyPriceLabel: "Rp99.000",
    description: "Untuk coach, analyst, competitive team, dan power user.",
    recommended: false,
    features: [
      { text: "Everything in Elite", status: "available" },
      { text: "Deepest AI Analysis mode", status: "available" },
      { text: "Full feature unlock", status: "available" },
      { text: "Advanced draft planning tools", status: "available" },
      { text: "Premium scouting", status: "available" },
      { text: "Unlimited saved analysis", status: "available" },
      { text: "Team collaboration tools", status: "available" },
      { text: "Priority support", status: "available" },
    ],
    ctaLabel: "Unlock Pro",
  },
];
