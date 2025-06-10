import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase"; // uses pre-initialized app

const bloomEmojis = ["🌸", "🌼", "🌿", "💮", "🌷", "✨"];

type GiftEntry = {
  id: string;
  project: string;
  tier: string;
  amount: number;
  timestamp: number;
  bloom: string;
};

export default function GiftStream() {
  const [gifts, setGifts] = useState<GiftEntry[]>([]);

  useEffect(() => {
    const q = query(collection(db, "gifts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        bloom: bloomEmojis[Math.floor(Math.random() * bloomEmojis.length)],
      })) as GiftEntry[];
      setGifts(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="relative mt-12 space-y-4 max-w-xl mx-auto">
      <h3 className="text-2xl font-bold text-center text-green-300">
        🌼 Sacred Gift Stream
      </h3>

      <AnimatePresence>
        {gifts.map((gift, index) => (
          <motion.div
            key={gift.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-black/50 text-white p-4 rounded-xl shadow-lg overflow-hidden"
          >
            <p>
              <strong>{gift.project}</strong> received a{" "}
              <em>{gift.tier}</em> {gift.bloom}
            </p>
            <p className="text-sm text-white/60">
              {new Date(gift.timestamp).toLocaleString()}
            </p>

            {/* Bloom Trail Animation */}
            <motion.div
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: -80, opacity: 1 }}
              transition={{ duration: 3, delay: 0.2 * index }}
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-3xl pointer-events-none"
            >
              {gift.bloom}
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
