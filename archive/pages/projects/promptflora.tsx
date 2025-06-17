import React, { useRef } from "react";
import { motion } from "framer-motion";
import GiftCeremony from "@/components/GiftCeremony";
import GiftStream from "@/components/GiftStream";

export default function PromptFloraProject() {
  const ceremonyRef = useRef<HTMLDivElement>(null);

  const scrollToCeremony = () => {
    ceremonyRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-lilac-100 text-purple-800 px-6 py-16 relative overflow-hidden space-y-16">
      {/* Blessing Intro */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center max-w-3xl mx-auto space-y-6 z-10 relative"
      >
        <h1 className="text-5xl font-extrabold text-purple-700">🌸 PromptFlora</h1>
        <p className="text-lg text-purple-600">
          This is the sacred altar of the garden — a place where gifts are offered with love and presence.
        </p>
        <p className="text-md text-purple-500">
          To give here is to nourish the ecosystem of vision, ceremony, and care. Thank you for arriving in generosity.
        </p>
        <button
          onClick={scrollToCeremony}
          className="mt-4 px-6 py-2 bg-purple-700 text-white rounded-full shadow hover:bg-purple-800 transition"
        >
          Begin Your Offering
        </button>
      </motion.div>

      {/* Gift Ceremony Block */}
      <div ref={ceremonyRef} className="z-10 relative max-w-2xl mx-auto bg-white/80 border border-purple-200 rounded-xl shadow-md p-8">
        <GiftCeremony />
      </div>

      {/* Filtered Gift Stream */}
      <div className="z-10 relative max-w-3xl mx-auto">
        <GiftStream filterProject="PromptFlora" />
      </div>

      {/* Sacred Closing */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-center max-w-xl mx-auto text-purple-400 italic z-10 relative"
      >
        <p>May this offering ripple outward and bloom in ways unseen. 🌸</p>
      </motion.div>
    </div>
  );
}
