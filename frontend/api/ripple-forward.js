import { put, list } from "@vercel/blob";

const LOG_KEY = "ripple-ledger.json";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { tier } = req.body;

    // Fetch existing ledger
    let ledger = [];
    const existing = await list({ prefix: LOG_KEY });
    if (existing.blobs.length > 0) {
      const url = existing.blobs[0].url;
      const resData = await fetch(url);
      ledger = await resData.json();
    }

    // Append new ripple forward log
    const log = {
      type: "ripple_forward",
      tier: tier.name,
      timestamp: new Date().toISOString(),
      message: `Ripple of $0.47 from ${tier.name} sent forward.`,
    };
    ledger.push(log);

    // Upload updated ledger
    await put(LOG_KEY, JSON.stringify(ledger, null, 2), {
      access: "public",
    });

    return res.status(200).json({ status: "success", ripple: 0.47 });
  } catch (err) {
    console.error("❌ Error in /api/ripple-forward:", err);
    return res.status(500).json({ error: "Internal error forwarding ripple." });
  }
}
