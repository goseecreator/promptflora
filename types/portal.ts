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
    tiers: Tier[];
  };
  