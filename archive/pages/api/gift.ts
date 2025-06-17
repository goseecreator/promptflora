import type { NextApiRequest, NextApiResponse } from "next";
import { createGiftInvoice, recordGiftToFirestore } from "@/lib/aquifer/gift";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method allowed" });
  }

  const { amount, memo } = req.body;

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ error: "Missing or invalid amount" });
  }

  const tier = {
    label: resolveGiftTier(amount),
    amount,
  };

  try {
    const invoice = await createGiftInvoice(tier, "PromptFlora");

    // Optionally record gift to Firestore
    await recordGiftToFirestore({
      bolt11: invoice.bolt11,
      tier,
      project: "PromptFlora",
      blessing: memo,
    });

    return res.status(200).json({ paymentRequest: invoice.bolt11 });
  } catch (error: any) {
    console.error("❌ Gift creation failed:", error);
    return res.status(500).json({ error: error.message || "Unknown server error" });
  }
}

// Optional helper for tier naming
function resolveGiftTier(sats: number): string {
  if (sats >= 1000) return "Harvest 🌾";
  if (sats >= 500) return "Blossom 🌸";
  return "Seed 🌱";
}
