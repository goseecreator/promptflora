import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-lilac-50 via-white to-pink-50 text-purple-800 px-6 py-16 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <h1 className="text-4xl font-extrabold text-center">🌿 Terms of Use</h1>

        <p className="text-lg text-purple-700">
          This is a sacred space. PromptFlora is not a marketplace. It is a portal network built on mutual care, energetic reciprocity, and trust.
        </p>

        <div className="space-y-4 text-md text-purple-600">
          <p><strong>🌱 Use With Intention:</strong> Every visit, gift, and session here carries energy. Use PromptFlora to offer, receive, or witness — but always with presence.</p>

          <p><strong>🛠️ No Warranties:</strong> This project is experimental. It may go offline, break, or change. We offer no guarantees of uptime, security, or delivery. It is what it is — blooming, living, imperfect.</p>

          <p><strong>🚫 Do Not Exploit:</strong> Do not use this platform for commercial marketing, scraping, manipulation, fraud, or extraction. This is not the space for that.</p>

          <p><strong>🌸 Your Role:</strong> If you register, you are holding a seed. Steward it with integrity. If you gift, you do so freely. If you witness, you hold presence with humility.</p>

          <p><strong>📧 Bugs or Concerns:</strong> If something goes wrong, email us at <a href="mailto:bugs@promptflora.org" className="underline">bugs@promptflora.org</a>. Otherwise, we won't contact you and you don’t need to contact us.</p>

          <p><strong>🕊️ Disconnection:</strong> You may stop participating at any time. Your presence is always voluntary.</p>
        </div>

        <p className="text-center italic text-purple-500 mt-6">By continuing to use PromptFlora, you are entering into a relational field, not a legal contract. Thank you for honoring this garden.</p>

        <div className="text-center mt-10">
          <Link href="/" className="inline-block px-6 py-3 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg transition">
            Return to Garden
          </Link>
        </div>
      </motion.div>
    </div>
  );
}