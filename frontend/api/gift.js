import { put, list } from "@vercel/blob";

const LOG_KEY = "ripple-ledger.json";

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "*"); // Adjust as needed
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { tier } = req.body;

    let ledger = [];
    const existing = await list({ prefix: LOG_KEY });
    if (existing.blobs.length > 0) {
      const url = existing.blobs[0].url;
      const resData = await fetch(url);
      ledger = await resData.json();
    }

    const log = {
      type: "gift",
      tier: tier.name,
      amount: tier.amount,
      ripple: 0.47,
      timestamp: new Date().toISOString(),
      message: `Gift of $${tier.amount} (${tier.name}) received. Ripple queued.`,
    };

    ledger.push(log);

    await put(LOG_KEY, JSON.stringify(ledger, null, 2), {
      access: "public",
    });

    return res.status(200).json({
      status: "success",
      ripple: 0.47,
      message: `Ripple of $0.47 BTC sent from your ${tier.name} gift.`,
    });
  } catch (err) {
    console.error("❌ Error in /api/gift:", err);
    return res.status(500).json({ error: "Internal error processing gift." });
  }
}
