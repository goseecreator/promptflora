import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { UserProfile } from "../../types/types";

const archetypeOptions = [
  "Prompt Receiver",
  "Project Holder",
  "Event Weaver",
  "Session Host",
  "Witness Only"
];

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [lightningAddress, setLightningAddress] = useState("");
  const [archetypes, setArchetypes] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/register");
        return;
      }

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        setProfile(data);
        setName(data.name);
        setLightningAddress(data.lightningAddress || "");
        setArchetypes(data.archetypes || []);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const toggleArchetype = (role: string) => {
    setArchetypes((prev) =>
      prev.includes(role)
        ? prev.filter((a) => a !== role)
        : [...prev, role]
    );
  };

  const handleSave = async () => {
    if (!profile) return;

    await updateDoc(doc(db, "users", profile.uid), {
      name,
      lightningAddress,
      archetypes
    });

    alert("Profile updated.");
  };

  if (loading) return <p className="text-white text-center mt-10">Loading settings...</p>;

  return (
    <div className="max-w-xl mx-auto mt-12 px-6 text-white">
      <h1 className="text-3xl font-bold mb-6">🧬 Edit Your Profile</h1>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Display Name</label>
          <input
            className="w-full p-2 rounded bg-white text-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">⚡ Lightning Address</label>
          <input
            className="w-full p-2 rounded bg-white text-black"
            placeholder="you@zbd.gg"
            value={lightningAddress}
            onChange={(e) => setLightningAddress(e.target.value)}
          />
          <p className="text-xs text-purple-300 mt-1">
            Used to receive sacred microgifts via BTC.
          </p>
        </div>

        <div>
          <label className="block mb-1 font-medium">Archetypes</label>
          <div className="flex flex-wrap gap-3">
            {archetypeOptions.map((role) => (
              <label key={role} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={archetypes.includes(role)}
                  onChange={() => toggleArchetype(role)}
                />
                <span>{role}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full py-2 mt-4 bg-green-600 hover:bg-green-700 text-white rounded font-semibold"
        >
          Save Changes
        </button>

        <a href="/dashboard" className="block mt-6 text-blue-300 underline">
          ← Back to Dashboard
        </a>
      </div>
    </div>
  );
}
