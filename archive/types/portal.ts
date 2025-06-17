export type Tier = {
  name: string;
  description: string;
  amount: number;
};

export type Portal = {
  id?: string;
  name: string;
  description: string;
  overview: string;
  tags: string[];
  status: string;          // ✅ added for portal card + profile views
  visibility?: string;
  keeperId?: string;
  keeperName?: string;
  createdAt?: Date;
  tiers: Tier[];
};
