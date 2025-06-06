import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const tagOptions = ["grief alchemy", "inner child", "sovereignty", "creative fire"];

export default function CreatePortalForm() {
  const [user] = useAuthState(auth);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [overview, setOverview] = useState("");
  const [tags, setTags] = useState([]);
  const [status, setStatus] = useState("UPCOMING");
  const [visibility, setVisibility] = useState("public");
  const [tiers, setTiers] = useState([]);
  const [saving, setSaving] = useState(false);

  const toggleTag = (tag) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const addTier = () => {
    setTiers(prev => [...prev, { name: "", description: "", amount: "" }]);
  };

  const updateTier = (index, field, value) => {
    setTiers(prev => prev.map((tier, i) => i === index ? { ...tier, [field]: value } : tier));
  };

  const handleSubmit = async (e) => {
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
        tiers: tiers.filter(t => t.name && t.description)
      });
      alert("Portal created successfully.");
      setName(""); setDescription(""); setOverview(""); setTags([]); setStatus("UPCOMING"); setVisibility("public"); setTiers([]);
    } catch (err) {
      console.error("Failed to create portal", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-12 text-white">
      <h1 className="text-2xl font-bold mb-4">🌸 Create a Portal</h1>
      {user && (
        <button onClick={() => auth.signOut()} className="absolute top-4 right-6 text-sm text-pink-300 underline">Logout</button>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Portal Name" className="w-full p-2 rounded bg-gray-800 text-white" required />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description" className="w-full p-2 rounded bg-gray-800 text-white" rows={2} required />
        <textarea value={overview} onChange={e => setOverview(e.target.value)} placeholder="Overview / intention" className="w-full p-2 rounded bg-gray-800 text-white" rows={4} />

        <div>
          <p className="text-sm text-purple-300 mb-2">Tags</p>
          <div className="flex flex-wrap gap-2">
            {tagOptions.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full border ${tags.includes(tag) ? "bg-purple-600" : "border-purple-400 text-purple-300"}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <select value={status} onChange={e => setStatus(e.target.value)} className="bg-gray-800 text-white rounded p-2">
            <option value="UPCOMING">Upcoming</option>
            <option value="LIVE">Live</option>
            <option value="PRIVATE">Private</option>
          </select>

          <select value={visibility} onChange={e => setVisibility(e.target.value)} className="bg-gray-800 text-white rounded p-2">
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>

        <div>
          <h2 className="text-lg font-semibold mt-6 mb-2">🎁 Gifting Tiers</h2>
          <button type="button" onClick={addTier} className="mb-4 px-4 py-1 bg-pink-700 rounded">+ Add Tier</button>
          {tiers.map((tier, index) => (
            <div key={index} className="space-y-2 mb-4 bg-gray-800 p-4 rounded">
              <input value={tier.name} onChange={e => updateTier(index, "name", e.target.value)} placeholder="Tier Name (e.g. Seed)" className="w-full p-2 rounded bg-gray-900 text-white" />
              <textarea value={tier.description} onChange={e => updateTier(index, "description", e.target.value)} placeholder="Tier Description" className="w-full p-2 rounded bg-gray-900 text-white" rows={2} />
              <input value={tier.amount} onChange={e => updateTier(index, "amount", e.target.value)} placeholder="Suggested Gift (optional)" type="number" className="w-full p-2 rounded bg-gray-900 text-white" />
            </div>
          ))}
        </div>

        <button type="submit" disabled={saving} className="w-full bg-pink-600 py-2 rounded hover:bg-pink-500">
          {saving ? "Creating..." : "Open the Portal"}
        </button>
      </form>
      <div className="mt-12 text-sm text-purple-300">
        <h2 className="text-lg font-semibold text-white mb-2">What is a Portal?</h2>
        <p className="mb-2">
          A Portal is a threshold into a shared energetic experience. It may be a gathering, a project, a ritual container, or a poetic field — held gently by its Keeper.
        </p>
        <p className="mb-2">
          Portals can be public or private, live or upcoming. Visitors may gift to enter, hold a chalice to return, or simply witness the presence offered.
        </p>
        <p>
          Portals are not events. They are invitations — into rhythm, resonance, and reflective communion.
        </p>
      </div>
    </div>
  );
}
