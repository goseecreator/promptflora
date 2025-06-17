import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { useIntent } from "@/hooks/useIntent";
import { useArchetypeFromIntent } from "@/hooks/useArchetypeFromIntent";

const archetypeOptions = [
  { label: "Prompt Receiver", description: "Receives sacred offerings and support." },
  { label: "Project Holder", description: "Stewards a creative or spiritual project." },
  { label: "Event Weaver", description: "Hosts ceremonies, gatherings, or workshops." },
  { label: "Session Host", description: "Holds 1:1 or group sessions for growth." },
];

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [archetypes, setArchetypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const intent = useIntent();
  const prefillArchetype = useArchetypeFromIntent();

  useEffect(() => {
    if (prefillArchetype && archetypes.length === 0) {
      setArchetypes([prefillArchetype]);
    }
  }, [prefillArchetype, archetypes]);

  const toggleArchetype = (role: string) => {
    setArchetypes((prev) =>
      prev.includes(role) ? prev.filter((a) => a !== role) : [...prev, role]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      await setDoc(doc(db, "users", uid), {
        uid,
        email,
        name,
        archetypes,
        createdAt: serverTimestamp()
      });

      router.push("/dashboard");
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-lilac-100 via-pink-50 to-white flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/flora-layer2.png')] bg-repeat-x bg-bottom opacity-10 animate-parallax-slower z-0" />

      <div className="relative z-10 max-w-md w-full bg-white/90 border border-purple-200 rounded-xl shadow-lg p-8 space-y-6 text-purple-900">
        <h1 className="text-3xl font-extrabold text-center">🌸 Enter the Garden</h1>

        {intent && prefillArchetype && (
          <p className="text-sm text-purple-500 italic text-center">
            You&apos;re arriving as a <strong>{intent}</strong>. We&apos;ve selected a starting archetype.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-2 border rounded bg-purple-50 border-purple-300 placeholder-purple-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded bg-purple-50 border-purple-300 placeholder-purple-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded bg-purple-50 border-purple-300 placeholder-purple-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div>
            <p className="font-semibold mb-2">Choose Your Archetypes:</p>
            <div className="flex flex-col gap-3">
              {archetypeOptions.map(({ label, description }) => (
                <div key={label} className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => toggleArchetype(label)}
                    className={`px-3 py-1 rounded-full border text-left ${
                      archetypes.includes(label)
                        ? "bg-purple-200 border-purple-500 text-purple-800 font-semibold"
                        : "bg-white border-gray-300 text-gray-600"
                    }`}
                  >
                    {label}
                  </button>
                  <p className="text-xs text-purple-500 italic ml-2">{description}</p>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded hover:brightness-105 transition"
            disabled={loading}
          >
            {loading ? "Planting your seed..." : "Enter the Garden"}
          </button>
        </form>
      </div>
    </div>
  );
}