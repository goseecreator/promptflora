import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "react-qr-code";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";
// Removed incomplete import statement
// Remove incomplete import statement

// Gift options
const giftTiers = [
  { label: "Seed 🌱", amount: 100 },
  { label: "Blossom 🌸", amount: 500 },
  { label: "Harvest 🌾", amount: 1000 },
];

// Target projects
const projectTargets = ["PromptFlora", "GAPSA", "Calm Parents Confident Kids"];

export default function GiftCeremony() {
  const [selectedTier, setSelectedTier] = useState<{ label: string; amount: number } | null>(null);
  const [selectedProject, setSelectedProject] = useState("PromptFlora");
  const [invoice, setInvoice] = useState("");
  const [gifted, setGifted] = useState(false);
  const [loading, setLoading] = useState(false);

  const logGift = httpsCallable(functions, "logGift");

  // 🔄 Step 1: Create invoice via API
  const createInvoice = async (tier: { label: string; amount: number }) => {
    setLoading(true);
    setSelectedTier(tier);
    setGifted(false);
    setInvoice("");

    try {
      const res = await fetch("/api/gift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: tier.amount,
          memo: `${tier.label} for ${selectedProject}`,
        }),
      });
      const data = await res.json();
      setInvoice(data.paymentRequest);
    } catch (err) {
      console.error("Error creating invoice:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Step 2: Mark gift as complete + log to Firebase
  const handleGifted = async () => {
    if (!selectedTier) return;
    try {
      await logGift({
        project: selectedProject,
        tier: selectedTier.label,
        amount: selectedTier.amount,
        timestamp: Date.now(),
      });
      setGifted(true);
    } catch (err) {
      console.error("Failed to log gift:", err);
    } finally {
      setTimeout(() => {
        setGifted(false);
        setInvoice("");
        setSelectedTier(null);
      }, 5000);
    }
  };

  return (
    <div className="text-center mt-20 space-y-8">
      <h2 className="text-2xl font-bold">Offer a Sacred Gift</h2>

      {/* Project Selector */}
      <div className="text-white mb-4">
        <label className="block mb-2 text-lg">Choose a project to gift:</label>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="px-4 py-2 rounded-md bg-black border border-white text-white"
        >
          {projectTargets.map((project) => (
            <option key={project} value={project}>
              {project}
            </option>
          ))}
        </select>
      </div>

      {/* Gift Tier Buttons */}
      <div className="flex justify-center gap-4">
        {giftTiers.map((tier) => (
          <button
            key={tier.label}
            onClick={() => createInvoice(tier)}
            disabled={loading}
            className="px-4 py-2 bg-purple-700 hover:bg-purple-500 rounded-lg text-white transition"
          >
            {tier.label}
          </button>
        ))}
      </div>

      {/* Invoice Display + Confirmation */}
      <AnimatePresence>
        {invoice && !gifted && (
          <motion.div
            key="invoice"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="mt-10 bg-black/70 p-6 rounded-xl inline-block"
          >
            <p className="mb-4">Scan or pay this Lightning invoice:</p>
            <QRCode value={invoice} size={200} />
            <button
              onClick={handleGifted}
              className="block mt-4 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg transition"
            >
              I’ve sent the gift
            </button>
          </motion.div>
        )}

        {/* Gift Acknowledgment */}
        {gifted && (
          <motion.div
            key="thankyou"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-10 text-green-300 text-xl font-semibold"
          >
            🌸 Gift received in gratitude for {selectedProject}.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
