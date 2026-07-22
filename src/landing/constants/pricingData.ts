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
    id: "starter",
    name: "Starter",
    price: "Rp49.000",
    period: "/bulan",
    highlighted: false,
    features: [
      "Basic Draft War Room access",
      "Hero Intelligence access",
      "MPL Hero Stats access",
      "Limited AI draft analysis",
      "Basic Data Catalog access",
    ],
    ctaLabel: "Start Basic",
    ctaTarget: "draft",
    testId: "cta-pricing-starter",
  },
  {
    id: "pro",
    name: "Pro",
    price: "Rp99.000",
    period: "/bulan",
    badge: "Most Popular",
    highlighted: true,
    features: [
      "Everything in Starter",
      "Full AI Draft Analysis",
      "Team Analytics access",
      "Team Draft Planner access",
      "Macro Map Planner access",
      "Unlimited saved analysis",
      "Priority draft workflow",
    ],
    ctaLabel: "Go Pro",
    ctaTarget: "draft",
    testId: "cta-pricing-pro",
  },
  {
    id: "elite",
    name: "Elite War Room",
    price: "Rp179.000",
    period: "/bulan",
    highlighted: false,
    features: [
      "Everything in Pro",
      "Deepest AI analysis mode",
      "Full feature unlock",
      "Advanced draft planning tools",
      "Premium scouting & extended support",
      "Priority experience",
      "Team collaboration tools",
    ],
    ctaLabel: "Enter War Room",
    ctaTarget: "intelligence",
    testId: "cta-pricing-elite",
  },
];
