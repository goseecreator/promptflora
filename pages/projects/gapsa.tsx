import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import GiftStream from "@/components/GiftStream";

export default function GAPSAProject() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-black to-black text-white px-6 py-12 relative overflow-hidden">
      {/* Bloom Background */}
      <div className="absolute inset-0 z-0 bg-[url('/flora-layer3.png')] bg-repeat-x bg-bottom opacity-10 animate-parallax-slower" />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center space-y-6 z-10 relative"
      >
        <h1 className="text-5xl font-extrabold text-purple-300">📚 GAPSA</h1>
        <p className="text-lg text-white/80 max-w-xl mx-auto">
          GAPSA is a sanctuary for visionary academics — scholars, creatives, and soul-searchers rooted in sacred inquiry and expansive community.
        </p>
        <p className="text-md text-purple-200 max-w-xl mx-auto">
          Your gift supports the cultivation of a new paradigm in education and collective transformation.
        </p>
        <Link href="/" className="inline-block mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl transition">
          Return to Garden
        </Link>
      </motion.div>

      <GiftStream filterProject="GAPSA" />
    </div>
  );
}