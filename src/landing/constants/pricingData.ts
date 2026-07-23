import { TabId } from "../integration";

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  badge?: string;
  highlighted: boolean;
  features: string[];
  ctaLabel: string;
  ctaTarget: TabId;
  testId: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "basic",
    name: "Basic",
    price: "Rp19.000",
    period: "/bulan",
    highlighted: false,
    features: [
      "Basic Draft War Room access",
      "Hero Intelligence access",
      "MPL Hero Stats access",
      "Limited AI Draft Analysis",
      "Basic Data Catalog access",
      "Limited saved drafts",
    ],
    ctaLabel: "Choose Basic",
    ctaTarget: "draft",
    testId: "cta-pricing-basic",
  },
  {
    id: "elite",
    name: "Elite",
    price: "Rp49.000",
    period: "/bulan",
    badge: "Most Popular",
    highlighted: true,
    features: [
      "Everything in Basic",
      "Full AI Draft Analysis",
      "Team Analytics access",
      "Team Draft Planner access",
      "Macro Map Planner access",
      "More saved analysis",
      "PNG/PDF export",
      "Priority draft workflow",
    ],
    ctaLabel: "Go Elite",
    ctaTarget: "draft",
    testId: "cta-pricing-elite",
  },
  {
    id: "pro",
    name: "Pro",
    price: "Rp99.000",
    period: "/bulan",
    highlighted: false,
    features: [
      "Everything in Elite",
      "Deepest AI Analysis mode",
      "Full feature unlock",
      "Advanced draft planning tools",
      "Premium scouting",
      "Unlimited saved analysis",
      "Team collaboration tools",
      "Priority support",
    ],
    ctaLabel: "Unlock Pro",
    ctaTarget: "intelligence",
    testId: "cta-pricing-pro",
  },
];
