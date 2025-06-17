export type Gift = {
  id: string;
  project: string;
  tier: string;
  amount: number;
  wallet: string;
  timestamp: number;
  portalName?: string;
  portalTags?: string[];
  blessing?: string; // 
};
