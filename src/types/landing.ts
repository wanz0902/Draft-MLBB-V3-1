export interface DraftSlot {
  id: string;
  hero: { name: string; portraitPath: string } | null;
  side: 'blue' | 'red';
  type: 'ban' | 'pick';
  isActive: boolean;
}

export interface BanPickPhase {
  phaseNumber: number;
  action: 'ban' | 'pick';
  side: 'blue' | 'red';
  heroName: string;
  heroPortrait: string;
  aiCommentary: string[];
}

export interface FeatureCardData {
  id: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaTargetTab: string;
}
