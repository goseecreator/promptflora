// components/GiftStream.tsx
import { useEffect, useState } from "react";

type Gift = {
  id: string;
  type: string;
  label?: string;
  timestamp?: string | number | Date;
  [key: string]: unknown;
};

export default function GiftStream() {
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const res = await fetch("/api/get-seed-gifts");
        const data = await res.json();

        if (!Array.isArray(data.gifts)) {
          throw new Error("Response format incorrect: 'gifts' is not an array");
        }

        setGifts(data.gifts);
        setError("");
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("❌ Error loading gifts:", err);
          setError(err.message);
        } else {
          console.error("❌ Error loading gifts:", err);
          setError("Unknown error");
        }
      }
    };

    fetchGifts();
  }, []);

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Recently Offered Seed Gifts 🌱</h3>
      {gifts.length === 0 ? (
        <p>No gifts yet — be the first to offer one!</p>
      ) : (
        <ul className="space-y-2">
          {gifts.map((gift) => (
            <li key={gift.id} className="p-2 border rounded bg-white shadow-sm">
              <div>🌸 {gift.label || "Unnamed Seed"}</div>
              <div className="text-xs text-gray-500">
                {new Date(gift.timestamp || "").toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
