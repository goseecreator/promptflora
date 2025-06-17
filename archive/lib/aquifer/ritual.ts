import { db } from "@/lib/firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import type { Tier } from "@/lib/aquifer/gift";

export type RitualState = "init" | "pending" | "confirmed" | "blessed" | "archived";

export interface Ritual {
  id: string;
  tier: Tier;
  bolt11: string;
  state: RitualState;
  project: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  sender?: string;
  blessing?: string;
}

function generateRitualId(): string {
  return `ritual-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export async function startRitual(tier: Tier, project: string, sender?: string, blessing?: string): Promise<Ritual> {
  const { createGiftInvoice } = await import("@/lib/aquifer/gift");
  const { bolt11 } = await createGiftInvoice(tier, project);

  const ritual: Ritual = {
    id: generateRitualId(),
    tier,
    bolt11,
    project,
    state: "pending",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    sender,
    blessing,
  };

  await db.collection("rituals").doc(ritual.id).set(ritual);
  return ritual;
}

export async function advanceRitual(id: string, newState: RitualState): Promise<void> {
  await db.collection("rituals").doc(id).update({
    state: newState,
    updatedAt: Timestamp.now(),
  });
}

export async function getRitual(id: string): Promise<Ritual | null> {
  const doc = await db.collection("rituals").doc(id).get();
  return doc.exists ? (doc.data() as Ritual) : null;
}

export async function listRecentRituals(limit: number = 10): Promise<Ritual[]> {
  const snapshot = await db.collection("rituals")
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ritual));
}
