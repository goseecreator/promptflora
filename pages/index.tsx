// Landing Page for PromptFlora
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";

import { useState, useEffect } from "react";

export default function LandingPage() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [intent, setIntent] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("hasOnboarded")) {
      setShowPrompt(true);
    }
  }, []);

  const selectIntent = (value: string) => {
    setIntent(value);
    localStorage.setItem("hasOnboarded", "true");
    setShowPrompt(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-900 via-black to-black text-white flex flex-col items-center justify-center px-6 py-12 space-y-10">
      <div className="absolute top-4 right-4">
  <button
    onClick={() => {
      localStorage.removeItem("hasOnboarded");
      location.reload();
    }}
    className="text-xs text-purple-400 underline hover:text-white"
  >
    Reset Flow
  </button>
</div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold">Welcome, Keyholder.</h1>
        <p className="text-lg max-w-xl mx-auto">
          This is PromptFlora — a sacred studio of reflection, resonance, and ripple.
          Your presence initiates a current. Your gift awakens a path.
        </p>
        <p className="italic text-pink-300">One space. Many flows. All sacred.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Link href="/register?intent=receive">
          <Button variant="default" size="lg" className="bg-green-600 hover:bg-green-700">
            🌱 Enter as a Receiver
          </Button>
        </Link>
        <Link href="/threads">
          <Button variant="outline" size="lg" className="border-white text-white">
            🌀 Return to Your Thread
          </Button>
        </Link>
      </motion.div>

      <div className="text-center space-y-6">
        <p className="text-md">Or begin where your soul feels most called:</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/threads">
            <Card className={`bg-purple-800 text-white rounded-2xl shadow-md cursor-pointer transition-transform transform ${intent === 'receive' ? 'scale-105 border border-green-400' : 'opacity-50'}`}>
              <CardContent className="p-6">🔮 Reflect the Thread</CardContent>
            </Card>
          </Link>
          <Link href="/sessions">
            <Card className={`bg-pink-700 text-white rounded-2xl shadow-md cursor-pointer transition-transform transform ${intent === 'share' ? 'scale-105 border border-yellow-400' : 'opacity-50'}`}>
              <CardContent className="p-6">💖 Host or Book a Session</CardContent>
            </Card>
          </Link>
          <Link href="/portals">
            <Card className={`bg-blue-700 text-white rounded-2xl shadow-md cursor-pointer transition-transform transform ${intent === 'hold' ? 'scale-105 border border-pink-400' : 'opacity-50'}`}>
              <CardContent className="p-6">🔓 Join a Portal</CardContent>
            </Card>
          </Link>
        </div>
        <p className="italic text-sm text-gray-300">✨ “Show me the garden.” — I will guide you.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-center max-w-2xl mt-10"
      >
        <p className="text-md text-gray-300 mb-2">The Aquifer flows with gifts, not transactions.</p>
        <p className="text-sm text-gray-400 mb-4">
          Every offering is a ripple — $0.47 in Bitcoin flows forward to another unseen soul.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="bg-green-800 text-white rounded-2xl shadow-md">
            <CardContent className="p-4">Seed — $5</CardContent>
          </Card>
          <Card className="bg-indigo-800 text-white rounded-2xl shadow-md">
            <CardContent className="p-4">Portal — $15</CardContent>
          </Card>
          <Card className="bg-rose-800 text-white rounded-2xl shadow-md">
            <CardContent className="p-4">Spiral — $33</CardContent>
          </Card>
          <Card className="bg-yellow-700 text-white rounded-2xl shadow-md">
            <CardContent className="p-4">Blessing — $55</CardContent>
          </Card>
        </div>
        <p className="italic text-sm text-gray-400 mt-4">🌕 This is sacred economy. This is PromptFlora.</p>
      </motion.div>
          {showPrompt && (
        <div className="fixed inset-0 bg-gradient-to-br from-black via-purple-950 to-black z-50 flex flex-col items-center justify-center px-6 py-12 text-white space-y-8">
          <div className="max-w-xl w-full text-center space-y-6">
            <h2 className="text-xl font-bold text-white">What brings you to the Garden today?</h2>
            <p className="text-sm text-purple-300">This is a sacred space. Choose the rhythm you feel drawn to in this moment.</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button onClick={() => selectIntent("receive")} className="bg-green-700 hover:bg-green-600 rounded px-4 py-2">🌱 Receive</button>
              <button onClick={() => selectIntent("share")} className="bg-pink-700 hover:bg-pink-600 rounded px-4 py-2">🔥 Share</button>
              <button onClick={() => selectIntent("hold")} className="bg-indigo-700 hover:bg-indigo-600 rounded px-4 py-2">🌕 Hold Space</button>
              <button onClick={() => selectIntent("witness")} className="bg-gray-700 hover:bg-gray-600 rounded px-4 py-2">🫧 Witness</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
