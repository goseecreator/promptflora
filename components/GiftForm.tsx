// components/GiftForm.tsx
import { addDoc, collection, db, serverTimestamp } from "@/lib/firebase";

const BTCPAY_URLS: Record<string, string> = {
  Seed: "https://yourbtcpay.com/invoice/seed123",
  Blossom: "https://yourbtcpay.com/invoice/blossom456",
  Harvest: "https://yourbtcpay.com/invoice/harvest789",
};

export default function GiftForm() {
  async function handleGift(tier: string, sats: number) {
    await addDoc(collection(db, "gifts"), {
      tier,
      sats,
      createdAt: serverTimestamp(),
    });
    window.location.href = BTCPAY_URLS[tier] || "/thanks";
  }

  return (
    <div className="space-y-4 text-center">
      <p>Select a tier to send sats:</p>
      <div className="flex justify-center gap-4">
        <button onClick={() => handleGift("Seed", 100)} className="bg-green-600 text-white px-4 py-2 rounded">Seed 🌱</button>
        <button onClick={() => handleGift("Blossom", 500)} className="bg-pink-600 text-white px-4 py-2 rounded">Blossom 🌸</button>
        <button onClick={() => handleGift("Harvest", 1000)} className="bg-yellow-600 text-white px-4 py-2 rounded">Harvest 🌾</button>
      </div>
    </div>
  );
}