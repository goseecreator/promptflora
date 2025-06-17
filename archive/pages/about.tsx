import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-lilac-100 text-purple-800 px-6 py-16 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto space-y-8 text-center"
      >
        <h1 className="text-4xl font-extrabold">🌸 About PromptFlora</h1>
        <p className="text-lg text-purple-700">
          PromptFlora is a living digital garden—a sacred ecosystem of giving, receiving, and observing. It connects visionary projects, ceremonies, and sessions through real-time microgifting using Bitcoin Lightning and sacred digital UX.
        </p>
        <p className="text-md text-purple-600">
          Our mission is to restore energetic reciprocity, build trust-based digital temples, and honor intentions with beautiful, intuitive flows.
        </p>
        <p className="text-md text-purple-600">
          Whether you&apos;re offering a gift, planting a vision, or simply bearing witness, PromptFlora welcomes you with presence, grace, and bloom.
        </p>
        <Link href="/" className="inline-block mt-8 px-6 py-3 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg transition">
          Return to Garden
        </Link>
      </motion.div>
    </div>
  );
}