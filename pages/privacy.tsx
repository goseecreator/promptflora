import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-lilac-50 to-pink-50 text-purple-800 px-6 py-16 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto space-y-8"
      >
        <h1 className="text-4xl font-extrabold text-center">🕊️ Privacy & Sacred Boundaries</h1>

        <p className="text-lg text-purple-700">
          PromptFlora is a digital garden built on sacred intention and energetic trust. This is not a surveillance site. We honor your presence and your boundaries.
        </p>

        <div className="space-y-4 text-md text-purple-600">
          <p><strong>🌿 What We Collect:</strong> If you register, we store your email, name, and selected archetypes. If you gift, we log the offering in Firestore. If you visit, we store your last intent (e.g., “Give”) in your browser’s localStorage.</p>

          <p><strong>🛑 What We Don’t Do:</strong> We do not track you across the internet. We do not sell your data. We do not run ads, pixels, or marketing scripts.</p>

          <p><strong>📍 Where Your Data Lives:</strong> All sacred data is stored in Firebase (Google Cloud infrastructure). Intent state is saved locally in your browser. No third-party analytics tools are integrated.</p>

          <p><strong>🙏 Consent & Participation:</strong> By registering or gifting, you’re consenting to us storing your sacred imprint. You may choose not to participate and simply bear witness — we welcome that too.</p>

          <p><strong>🧽 Deleting Your Presence:</strong> If you wish to delete your user data, simply email <a href="mailto:bugs@promptflora.org" className="underline">bugs@promptflora.org</a> with your request. We will honor it without delay or question.</p>
        </div>

        <p className="text-center italic text-purple-500 mt-6">This garden exists because we trust each other. Thank you for walking with care.</p>

        <div className="text-center mt-10">
          <Link href="/" className="inline-block px-6 py-3 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg transition">
            Return to Garden
          </Link>
        </div>
      </motion.div>
    </div>
  );
}