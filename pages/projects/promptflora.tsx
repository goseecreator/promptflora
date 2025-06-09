import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PromptFloraProject() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900 via-black to-black text-white px-6 py-12 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center space-y-6 z-10 relative"
      >
        <h1 className="text-5xl font-extrabold text-lime-300">🌸 PromptFlora</h1>
        <p className="text-lg text-white/80 max-w-xl mx-auto">
          This is the living garden itself — the source and soil for portals, gifts, and sacred digital exchanges.
        </p>
        <p className="text-md text-green-200 max-w-xl mx-auto">
          Here you may walk among all that blooms. Root yourself in this architecture of mutual abundance.
        </p>
        <Link href="/">
          <a className="inline-block mt-6 px-6 py-3 bg-lime-600 hover:bg-lime-500 rounded-xl transition">
            Return to Garden
          </a>
        </Link>
      </motion.div>
    </div>
  );
}
