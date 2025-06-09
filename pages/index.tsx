import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles } from "lucide-react";

const projectList = [
  {
    name: "GAPSA",
    slug: "gapsa",
    tagline: "A sanctuary for visionary academics",
    accentColor: "purple-500",
    icon: "📚",
    bgImage: "bg-gradient-to-br from-purple-800 to-violet-600"
  },
  {
    name: "Calm Parents, Confident Kids",
    slug: "calm-parents-confident-kids",
    tagline: "Empowering sacred family rhythms",
    accentColor: "pink-500",
    icon: "👨‍👩‍👧‍👦",
    bgImage: "bg-gradient-to-br from-pink-700 to-pink-400"
  },
  {
    name: "PromptFlora",
    slug: "promptflora",
    tagline: "The sacred garden of gifting and portals",
    accentColor: "green-500",
    icon: "🌸",
    bgImage: "bg-gradient-to-br from-green-700 to-lime-500"
  },
];

export default function LandingPage() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [intent, setIntent] = useState<string | null>(null);

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
    <div className="min-h-screen bg-gradient-to-b from-violet-900 via-black to-black text-white px-6 py-12 relative overflow-hidden">
      
      <div className="absolute inset-0 z-0">
  <div className="w-full h-full bg-[url('/flora-layer2.png')] bg-repeat-x bg-bottom opacity-20 animate-parallax-slow" />
</div>
      <div className="parallax-layer absolute w-full h-full bg-[url('/flora-layer3.png')] bg-repeat-x bg-bottom opacity-10 animate-parallax-slower"></div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 text-center space-y-6"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-purple-300 animate-ping-slow" /> Welcome to PromptFlora
        </h1>
        <p className="text-lg text-white/70">A sacred ecosystem for real-time gifting and project portals</p>
      </motion.div>

      {/* Onboarding Intention Prompt */}
      {showPrompt && !intent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="relative z-10 mt-12 text-center space-y-4"
        >
          <p className="text-xl">Why are you here today?</p>
          <div className="flex justify-center gap-4">
            {['Give', 'Receive', 'Observe'].map((i) => (
              <button
                key={i}
                onClick={() => selectIntent(i)}
                className="px-6 py-2 bg-purple-700 hover:bg-purple-500 rounded-lg transition"
              >
                {i}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Portals Section */}
      {intent && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="relative z-10 mt-20 grid md:grid-cols-2 gap-8 text-center"
        >
          {projectList.map(({ name, slug, tagline, accentColor, icon, bgImage }) => (
            <Link href={`/projects/${slug}`} key={slug} passHref>
            <motion.a
              whileHover={{ scale: 1.08, rotate: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 10 }}
              className={`p-6 ${bgImage} bg-opacity-40 border-2 border-${accentColor} rounded-2xl shadow-xl cursor-pointer`}
            >
              <div className="text-4xl mb-2">{icon}</div>
              <h2 className="text-2xl font-bold">{name}</h2>
              <p className="text-white/70 mt-2">{tagline}</p>
            </motion.a>
          </Link>
          
          ))}
        </motion.div>
      )}
    </div>
  );
}
