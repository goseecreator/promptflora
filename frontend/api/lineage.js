import { list } from "@vercel/blob";

const LOG_KEY = "ripple-ledger.json";

export default async function handler(req, res) {
  try {
    const existing = await list({ prefix: LOG_KEY });
    if (existing.blobs.length === 0) {
      return res.status(200).json([]);
    }

    const url = existing.blobs[0].url;
    const response = await fetch(url);
    const ledger = await response.json();

    return res.status(200).json(ledger);
  } catch (err) {
    console.error("❌ Error in /api/lineage:", err);
    return res.status(500).json({ error: "Internal error fetching lineage." });
  }
}
