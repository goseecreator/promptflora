import { db } from "@/lib/firebase-admin"; // Firestore Admin
import { Timestamp } from "firebase-admin/firestore";

export type Tier = {
  label: string;
  amount: number; // in sats
};

export async function createGiftInvoice(tier: Tier, project: string) {
  const { BTCPAY_API_KEY, BTCPAY_STORE_ID, BTCPAY_HOST } = process.env;

  if (!BTCPAY_API_KEY || !BTCPAY_STORE_ID || !BTCPAY_HOST) {
    throw new Error("Missing BTCPay credentials");
  }

  const token = Buffer.from(`${BTCPAY_API_KEY}:`).toString("base64");

  const btcAmount = tier.amount / 100_000_000; // sats → BTC

  const res = await fetch(`${BTCPAY_HOST}/api/v1/stores/${BTCPAY_STORE_ID}/invoices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${token}`,
    },
    body: JSON.stringify({
      amount: btcAmount,
      currency: "BTC",
      metadata: {
        project,
        tier: tier.label,
        ritual: "PromptFlora Gift",
        timestamp: new Date().toISOString(),
      },
    }),
  });

  const data = await res.json();

  if (!res.ok || !data.paymentRequests?.[0]?.bolt11) {
    console.error("❌ BTCPay error:", data);
    throw new Error(data.message || "Failed to create BTCPay invoice");
  }

  return {
    bolt11: data.paymentRequests[0].bolt11,
    metadata: data.metadata,
  };
}

export async function recordGiftToFirestore({
  bolt11,
  tier,
  project,
  sender,
  blessing,
}: {
  bolt11: string;
  tier: Tier;
  project: string;
  sender?: string;
  blessing?: string;
}) {
  const doc = {
    type: "seed",
    label: tier.label,
    amount: tier.amount,
    project,
    sender: sender || "anonymous-mystic",
    blessing: blessing || "May your line run long and clear.",
    bolt11,
    timestamp: Timestamp.now(),
  };

  const ref = await db.collection("gifts").add(doc);
  return { id: ref.id, ...doc };
}
