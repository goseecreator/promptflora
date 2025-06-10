import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-lilac-100 text-purple-800 px-6 py-16 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl mx-auto space-y-8 text-center"
      >
        <h1 className="text-4xl font-extrabold">🐞 Found a Bug?</h1>
        <p className="text-lg text-purple-700">
          We don’t do customer support, contact forms, or follow-ups. But we do care deeply about the flow of this sacred space.
        </p>
        <p className="text-md text-purple-600">
          If something’s broken, glitched, or behaving in a non-consensual way, please send us a simple email:
        </p>
        <p className="text-lg font-semibold text-purple-800">
          <a href="mailto:bugs@promptflora.org" className="underline hover:text-purple-500">
            bugs@promptflora.org
          </a>
        </p>
        <p className="text-sm italic text-purple-500">
          Bless you for helping the Garden stay in bloom.
        </p>
        <Link href="/" className="inline-block mt-6 px-6 py-3 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg transition">
          Return to Garden
        </Link>
      </motion.div>
    </div>
  );
}