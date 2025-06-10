import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import GiftStream from "@/components/GiftStream";

export default function CalmParentsProject() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-800 via-black to-black text-white px-6 py-12 relative overflow-hidden">
      {/* Bloom Background */}
      <div className="absolute inset-0 z-0 bg-[url('/flora-layer2.png')] bg-repeat-x bg-bottom opacity-10 animate-parallax-slower" />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center space-y-6 z-10 relative"
      >
        <h1 className="text-5xl font-extrabold text-pink-300">👨‍👩‍👧‍👦 Calm Parents, Confident Kids</h1>
        <p className="text-lg text-white/80 max-w-xl mx-auto">
          This portal supports the rewilding of the family — reconnecting parents and children to rhythms of trust, spaciousness, and sacred relational care.
        </p>
        <p className="text-md text-pink-200 max-w-xl mx-auto">
          Your gift nourishes communities of presence, play, and deep listening.
        </p>
        <Link href="/" className="inline-block mt-6 px-6 py-3 bg-pink-600 hover:bg-pink-500 rounded-xl transition">
          Return to Garden
        </Link>
      </motion.div>

      <GiftStream filterProject="Calm Parents Confident Kids" />
    </div>
  );
}