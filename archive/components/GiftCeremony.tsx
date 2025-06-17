import { useState } from "react";

export default function GiftCeremony() {
  const [invoice, setInvoice] = useState("");
  const [error, setError] = useState("");

  type Tier = { label: string; amount: number };
  const tiers: Tier[] = [
    { label: "Seed 🌱", amount: 100 },
    { label: "Blossom 🌸", amount: 500 },
    { label: "Harvest 🌾", amount: 1000 },
  ];

  const createGift = async (tier: Tier, selectedProject: string) => {
    try {
      const res = await fetch("/api/gift", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Removed Authorization header since it belongs in the server route
        },
        body: JSON.stringify({
          amount: tier.amount,
          memo: `Gift for ${selectedProject}`,
        }),
      });

      const data = await res.json();
      console.log("🧾 BTCPay response:", data);

      if (!res.ok) {
        console.error("❌ BTCPay error detail:", data);
        throw new Error(data.error || "Failed to generate invoice");
      }

      setInvoice(data.paymentRequest);
      setError("");
    } catch (err) {
      console.error("Error creating invoice:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error occurred.");
      }
    }
  };

  return (
    <div className="text-center space-y-6">
      <h2 className="text-2xl font-bold">Offer a Sacred Gift</h2>
      <p>Select a tier to generate a BTC invoice.</p>

      <div className="flex justify-center gap-4">
        {tiers.map((tier) => (
          <button
            key={tier.label}
            onClick={() => createGift(tier, "PromptFlora")}
            className="bg-purple-700 text-white px-4 py-2 rounded-full hover:bg-purple-800"
          >
            {tier.label} ({tier.amount} sats)
          </button>
        ))}
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {invoice && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded shadow">
          <p className="text-green-700 font-medium mb-2">Your invoice:</p>
          <code className="break-words text-sm">{invoice}</code>
        </div>
      )}
    </div>
  );
}
