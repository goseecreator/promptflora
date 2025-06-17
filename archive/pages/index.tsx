import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Eye, Gift, DoorOpen } from "lucide-react";
import { useRouter } from "next/router";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import FloralForeground from "@/components/FloralForeground";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/firebase";

export default function LandingPage() {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [showPreview, setShowPreview] = useState(false);

  const handleIntent = (intent: string) => {
    localStorage.setItem("lastIntent", intent);
    if (intent === "Give") router.push("/projects/promptflora");
    else if (intent === "Observe") router.push("/threads");
    else if (intent === "Receive") router.push("/receive");
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user && !showPreview) router.push("/dashboard");
  }, [user]);

  const options = [
    { key: "Give", label: "Offer a Gift", icon: <Gift className="w-8 h-8" />, description: "To nourish a blooming vision" },
    { key: "Receive", label: "Open a Portal", icon: <DoorOpen className="w-8 h-8" />, description: "To welcome blessings into your space" },
    { key: "Observe", label: "Bear Witness", icon: <Eye className="w-8 h-8" />, description: "To hold space for what’s unfolding" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-lilac-100 to-white text-purple-800 px-4 sm:px-6 py-12 overflow-hidden flex flex-col items-center relative">
      <FloralForeground />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10 text-center space-y-6 max-w-2xl px-4"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-pink-400 animate-ping-slow" />
          Welcome to PromptFlora
        </h1>
        <p className="text-base sm:text-lg text-purple-600">
          A sacred ecosystem for real-time gifting and project portals
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 z-10 w-full max-w-6xl px-4"
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.15 }}
      >
        {options.map(({ key, label, description, icon }) => (
          <motion.div
            key={key}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl p-6 shadow-xl cursor-pointer hover:shadow-2xl text-left space-y-3"
            onClick={() => handleIntent(key)}
          >
            <div className="text-purple-500">{icon}</div>
            <h3 className="text-lg sm:text-xl font-semibold">{label}</h3>
            <p className="text-sm text-purple-500">{description}</p>
          </motion.div>
        ))}
      </motion.div>

      <p className="text-sm text-purple-400 mt-8 z-10 px-4 text-center">
        Not sure where to begin? You can also
        <button
          onClick={() => setShowPreview(true)}
          className="ml-1 underline hover:text-purple-600"
        >
          preview as a guest
        </button>
        .
      </p>

      {!user && !showPreview && (
        <div className="mt-10 z-10 px-4">
          <Button onClick={handleGoogleLogin} className="w-full sm:w-auto px-6 py-3 text-lg rounded-full shadow bg-purple-700 text-white hover:bg-purple-800">
            Continue with Google
          </Button>
        </div>
      )}

      {/* Floating glyph background */}
      <div className="absolute top-20 left-10 opacity-10 blur-xl animate-pulse">🌺</div>
      <div className="absolute bottom-20 right-20 opacity-10 blur-xl animate-pulse">🌿</div>

      {/* Footer glyphline */}
      <footer className="mt-20 text-xs text-purple-300 text-center z-10">
        © {new Date().getFullYear()} PromptFlora — a glyph of Go See Online Stellar Designs LLC🌌
      </footer>
    </div>
  );
}
