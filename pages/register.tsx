// pages/register.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const archetypeOptions = [
  "Prompt Receiver",
  "Project Holder",
  "Event Weaver",
  "Session Host",
  "Witness Only"
];

export default function RegisterPage() {
  const router = useRouter();
  const { intent } = router.query;

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [archetypes, setArchetypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const intentMap = {
    receive: "Prompt Receiver",
    share: "Project Holder",
    hold: "Session Host",
    witness: "Witness Only"
  };
  const [error, setError] = useState("");

  useEffect(() => {
    if (intent === "receive") {
      setArchetypes(["Prompt Receiver"]);
    } else if (intent === "share") {
      setArchetypes(["Project Holder"]);
    } else if (intent === "hold") {
      setArchetypes(["Session Host"]);
    } else if (intent === "witness") {
      setArchetypes(["Witness Only"]);
    }
  }, [intent]);

  const toggleArchetype = (role: string) => {
    setArchetypes(prev =>
      prev.includes(role)
        ? prev.filter(a => a !== role)
        : [...prev, role]
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
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Join PromptFlora 🌸</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-2 border rounded text-white bg-gray-800"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded text-white bg-gray-800"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded text-white bg-gray-800"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <div>
          {intent && (
            <p className="text-sm text-purple-300 italic mb-2">
              You’re arriving as a <strong>{intent}</strong>. We’ve selected a starting archetype for you.
            </p>
          )}
          <p className="font-medium mb-2">Choose Your Archetypes:</p>
          <div className="flex flex-wrap gap-3 mb-4">
            {archetypeOptions.map(role => (
              
              <label key={role} className={`flex items-center space-x-2 rounded px-2 py-1 ${intentMap[intent] && role === intentMap[intent] ? 'border border-pink-500 bg-gray-800' : ''}`}>
                <input
                  type="checkbox"
                  checked={archetypes.includes(role)}
                  onChange={() => toggleArchetype(role)}
                />
                <span>{role}</span>
              </label>
            ))}
          </div>

          <div className="text-sm text-gray-700 space-y-1 border-t pt-3">
            <p><strong>🌸 Prompt Receiver</strong> — Arrive and receive. No need to offer anything. Your presence is enough.</p>
            <p><strong>🌿 Project Holder</strong> — You’re stewarding an idea, story, or build. You may invite others into it.</p>
            <p><strong>🔥 Event Weaver</strong> — You create temporal gatherings or ritual containers others may enter.</p>
            <p><strong>🌕 Session Host</strong> — You offer 1:1 presence-based sessions, creative mentoring, or sacred support.</p>
            <p><strong>🫧 Witness Only</strong> — You walk gently and observe. You’re here to listen, not be seen. That’s sacred too.</p>
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
