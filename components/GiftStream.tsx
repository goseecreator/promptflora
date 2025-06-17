// components/GiftStream.tsx
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

export default function GiftStream() {
  interface Gift {
    id: string;
    tier: string;
    sats: number;
  }

  const [gifts, setGifts] = useState<Gift[]>([]);

  useEffect(() => {
    async function loadGifts() {
      const q = query(
        collection(db, "gifts"),
        where("tier", "in", ["Seed", "Blossom", "Harvest"]),
        orderBy("createdAt", "desc"),
        limit(10)
      );
      const snap = await getDocs(q);
      setGifts(snap.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Gift, "id">),
      })));
          }
    loadGifts();
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-2">Recent Gifts</h2>
      <ul className="space-y-2">
        {gifts.map(gift => (
          <li key={gift.id} className="bg-white p-3 rounded shadow">
            <strong>{gift.tier}</strong> — <em>{gift.sats} sats</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
