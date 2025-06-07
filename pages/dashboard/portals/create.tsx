import {  useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

type Tier = {
  name: string;
  description: string;
  amount: number;
};

export default function CreatePortal() {
  const [user] = useAuthState(auth);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [overview, setOverview] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [status, setStatus] = useState("UPCOMING");
  const [visibility, setVisibility] = useState("public");
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [saving, setSaving] = useState(false);

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const addTier = () => {
    setTiers((prev) => [...prev, { name: "", description: "", amount: 0 }]);
  };

  const updateTier = (
    index: number,
    field: keyof Tier,
    value: string | number
  ) => {
    setTiers((prev) =>
      prev.map((tier, i) =>
        i === index ? { ...tier, [field]: value } : tier
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      await addDoc(collection(db, "portals"), {
        name,
        description,
        overview,
        tags,
        status,
        visibility,
        keeperId: user.uid,
        keeperName: user.displayName || "Anonymous",
        createdAt: serverTimestamp(),
        tiers: tiers.filter((t) => t.name && t.description),
      });

      alert("Portal created successfully.");
      setName("");
      setDescription("");
      setOverview("");
      setTags([]);
      setStatus("UPCOMING");
      setVisibility("public");
      setTiers([]);
    } catch (err) {
      console.error("Failed to create portal", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 text-white">
      <h1 className="text-2xl font-bold mb-6">🌸 Create a Portal</h1>

      {user && (
        <button
          onClick={() => auth.signOut()}
          className="absolute top-4 right-4 text-sm text-pink-300 underline"
        >
          Logout
        </button>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded text-black"
          placeholder="Portal Name"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded text-black"
          placeholder="Short description"
        />
        <textarea
          value={overview}
          onChange={(e) => setOverview(e.target.value)}
          className="w-full p-2 rounded text-black"
          placeholder="Overview / intention"
        />

        <div className="flex gap-2 flex-wrap">
          {["grief alchemy", "inner child", "sovereignty", "creative fire"].map((tag) => (
            <button
              type="button"
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full border ${
                tags.includes(tag) ? "bg-pink-500 border-pink-500" : "border-gray-500"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 rounded text-black"
        >
          <option value="UPCOMING">Upcoming</option>
          <option value="LIVE">Live</option>
          <option value="PRIVATE">Private</option>
        </select>

        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="w-full p-2 rounded text-black"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>

        <div>
          <h3 className="font-semibold mb-2">🎁 Gifting Tiers</h3>
          {tiers.map((tier, i) => (
            <div key={i} className="space-y-2 mb-4 border-b border-purple-700 pb-4">
              <input
                className="w-full p-2 rounded text-black"
                value={tier.name}
                placeholder="Tier Name"
                onChange={(e) => updateTier(i, "name", e.target.value)}
              />
              <input
                className="w-full p-2 rounded text-black"
                value={tier.description}
                placeholder="Tier Description"
                onChange={(e) => updateTier(i, "description", e.target.value)}
              />
              <input
                className="w-full p-2 rounded text-black"
                value={tier.amount}
                type="number"
                placeholder="Amount (USD)"
                onChange={(e) => updateTier(i, "amount", parseFloat(e.target.value))}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addTier}
            className="bg-pink-600 hover:bg-pink-700 px-4 py-1 rounded"
          >
            + Add Tier
          </button>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded"
        >
          {saving ? "Sending..." : "Open the Portal"}
        </button>
      </form>
    </div>
  );
}
