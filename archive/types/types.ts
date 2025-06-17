// types/types.ts

export interface Project {
  id?: string;
  title: string;
  description: string;
  tags: string[];
  resonance: string;
  isPublic: boolean;
  createdAt?: Date | FirebaseFirestore.Timestamp;
  ownerId?: string;
  createdBy?: string; // Added createdBy property

}
  
  export type UserProfile = {
    uid: string;
    name: string;
    email: string;
    archetypes: string[];
    lightningAddress?: string;
    createdAt?: Date | FirebaseFirestore.Timestamp;
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
  