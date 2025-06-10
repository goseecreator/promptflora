import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/router";
import FloralForeground from "@/components/FloralForeground";
import Footer from "@/components/Footer";

export default function MooLanding() {
  const router = useRouter();

  const handleIntent = (intent: string) => {
    localStorage.setItem("lastIntent", intent);
    if (intent === "Give") router.push("/projects/promptflora");
    if (intent === "Receive") router.push("/register");
    if (intent === "Observe") router.push("/threads");
  };

  const options = [
    {
      key: "Give",
      label: "🌸 Offer a Gift",
      description: "To nourish a blooming vision",
    },
    {
      key: "Receive",
      label: "🌾 Open a Portal",
      description: "To welcome blessings into your space",
    },
    {
      key: "Observe",
      label: "🪶 Bear Witness",
      description: "To hold space for what’s unfolding",
    },
  ];

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-pink-100 via-lilac-100 to-white text-purple-800 px-6 py-12 overflow-hidden flex flex-col items-center justify-center">
      <FloralForeground />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center space-y-6"
      >
        <h1 className="text-5xl font-extrabold flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-pink-400 animate-ping-slow" />
          Welcome to PromptFlora
        </h1>
        <p className="text-lg text-purple-600 max-w-xl mx-auto">
          A sacred ecosystem for real-time gifting and project portals
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="relative z-10 mt-12 text-center space-y-4"
      >
        <p className="text-xl font-medium">Why are you here today?</p>
        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-4">
          {options.map(({ key, label, description }) => (
            <div key={key} className="flex flex-col items-center">
              <button
                onClick={() => handleIntent(key)}
                className="px-8 py-3 bg-purple-100 hover:bg-purple-300 text-purple-800 font-semibold rounded-lg shadow transition-all hover:scale-105"
              >
                {label}
              </button>
              <p className="text-sm text-purple-500 mt-2 italic">{description}</p>
            </div>
          ))}
        </div>
      </motion.div>
      <Footer />

    </div>
  );
}