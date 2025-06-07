import { useState } from "react";
import { Portal } from "@/types/portal";

type Props = {
  portal: Portal;
};

export default function PortalGiftingSection({ portal }: Props) {
  const [selectedTier, setSelectedTier] = useState<Portal["tiers"][0] | null>(null);

  const handleGift = async () => {
    if (!selectedTier) return;
    alert(`You’ve chosen to gift the ${selectedTier.name} tier. 🌱`);
    setSelectedTier(null);
  };

  return (
    <div className="p-6 bg-black/20 rounded-lg text-white space-y-6">
      <h2 className="text-xl font-semibold mb-4">Choose a Tier</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {portal.tiers.map((tier) => (
          <button
            key={tier.name}
            onClick={() => setSelectedTier(tier)}
            className={`p-4 rounded border transition ${
              selectedTier?.name === tier.name
                ? "border-pink-500 bg-purple-900"
                : "border-white/20 hover:border-purple-500"
            }`}
          >
            <h3 className="font-bold">{tier.name}</h3>
            <p className="text-sm text-purple-200">{tier.description}</p>
            <p className="text-sm text-gray-400">${tier.amount}</p>
          </button>
        ))}
      </div>

      {selectedTier && (
        <>
          <button
            onClick={handleGift}
            className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
          >
            Gift & Open the Portal
          </button>

          <p className="text-xs text-purple-300 italic mt-2">
            A portion of each gift ripples toward futures not yet voiced.
          </p>
        </>
      )}
    </div>
  );
}
