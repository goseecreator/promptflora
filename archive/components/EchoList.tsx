import useSWR from "swr";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SeedRipple from "./SeedRipple";
import { staggerContainer } from "@/components/motion/variants";
import type { Gift } from "@/types/gift";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function EchoList() {
  const { data: gifts, error } = useSWR<Gift[]>("/api/get-seed-gifts", fetcher);
  const [playChime, setPlayChime] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("playChime");
    if (stored !== null) setPlayChime(stored === "true");
  }, []);

  const toggleChime = () => {
    const next = !playChime;
    setPlayChime(next);
    localStorage.setItem("playChime", String(next));
  };

  return (
    <>
      <div className="text-sm text-purple-300 mb-4 text-center">
        🔔 Chime on new ripple:
        <button
          onClick={toggleChime}
          className="ml-2 px-2 py-1 border rounded text-white border-purple-500 hover:bg-purple-900"
        >
          {playChime ? "On" : "Off"}
        </button>
      </div>

      <motion.div
        className="space-y-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {error && <p className="text-red-500">Failed to load echoes</p>}
        {!gifts ? (
          <p className="text-purple-400">Listening for echoes...</p>
        ) : (
          gifts.map((gift) => (
            <SeedRipple key={gift.id} gift={gift} playChime={playChime} />
          ))
        )}
      </motion.div>
    </>
  );
}
