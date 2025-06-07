import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { useIntent } from "@/hooks/useIntent";
import { useArchetypeFromIntent } from "@/hooks/useArchetypeFromIntent";

const archetypeOptions = [
  "Prompt Receiver",
  "Project Holder",
  "Event Weaver",
  "Session Host",
  "Witness Only"
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
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-xl shadow text-white">
      <h1 className="text-2xl font-bold mb-4 text-center">Join PromptFlora 🌸</h1>

      {intent && prefillArchetype && (
        <p className="text-sm text-purple-300 italic mb-4">
          You’re arriving as a <strong>{intent}</strong>. We’ve selected a starting archetype for you.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-2 border rounded text-white bg-gray-900 placeholder-gray-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded text-white bg-gray-900 placeholder-gray-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded text-white bg-gray-900 placeholder-gray-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div>
          <p className="font-medium mb-2">Choose Your Archetypes:</p>
          <div className="flex flex-wrap gap-3 mb-4">
            {archetypeOptions.map((role) => (
              <label key={role} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={archetypes.includes(role)}
                  onChange={() => toggleArchetype(role)}
                />
                <span
                  className={`${
                    prefillArchetype === role
                      ? "border-pink-500 bg-gray-800 px-2 py-1 rounded"
                      : ""
                  }`}
                >
                  {role}
                </span>
              </label>
            ))}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          disabled={loading}
        >
          {loading ? "Creating..." : "Enter the Garden"}
        </button>
      </form>
    </div>
  );
}
