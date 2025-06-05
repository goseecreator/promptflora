// types/types.ts

export type Project = {
    title: string;
    description: string;
    tags: string[];
    resonance: "Open" | "Invite-only" | "Solo holding";
    isPublic: boolean;
    createdAt?: any;      // Optional if pulled from Firestore
    createdBy?: string;   // UID of creator
  };
  
  export type UserProfile = {
    uid: string;
    name: string;
    email: string;
    archetypes: string[];
    lightningAddress?: string;
    createdAt?: any;
  };
  
  export type Session = {
    id?: string;
    hostId: string;
    date: string;         // ISO string or timestamp
    duration: number;     // In minutes
    availability: string[]; // Time slots or ranges
    description?: string;
    isPublic: boolean;
    priceInSats?: number;
  };
  