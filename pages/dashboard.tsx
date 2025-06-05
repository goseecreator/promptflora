// pages/dashboard.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [archetypes, setArchetypes] = useState<string[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/register");
        return;
      }

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name);
        setArchetypes(data.archetypes || []);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <p className="text-center mt-20 text-white">Loading your dashboard...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-12 px-6 space-y-6">
      <h1 className="text-3xl font-bold text-center text-white mb-6">
        Welcome back, {name} 🌸
      </h1>

      {archetypes.includes("Prompt Receiver") && (
        <section className="p-5 rounded-xl bg-purple-700 text-white shadow-lg hover:shadow-purple-500/50 transition">
          <h2 className="text-xl font-bold">🌼 Receive a Portal</h2>
          <p className="text-sm opacity-90">
            This is your place to receive prompts, blessings, or invitations. You don't need to give anything — just be here.
          </p>
          <button
            onClick={() => router.push("/portals")}
            className="mt-3 px-4 py-2 bg-white text-black font-medium rounded shadow hover:bg-opacity-90 transition"
          >
            Begin
          </button>
        </section>
      )}

      {archetypes.includes("Project Holder") && (
        <section className="p-5 rounded-xl bg-blue-700 text-white shadow-lg hover:shadow-blue-500/50 transition">
          <h2 className="text-xl font-bold">📁 Project Holder Tools</h2>
          <p className="text-sm opacity-90">
            Manage your sacred builds, collaborate, and invite resonance into your vision.
          </p>
          <button
            onClick={() => router.push("/projects/create")}
            className="mt-3 px-4 py-2 bg-white text-black font-medium rounded shadow hover:bg-opacity-90 transition"
          >
            Begin
          </button>
        </section>
      )}

      {archetypes.includes("Event Weaver") && (
        <section className="p-5 rounded-xl bg-yellow-600 text-white shadow-lg hover:shadow-yellow-400/50 transition">
          <h2 className="text-xl font-bold">🌀 Event Weaving</h2>
          <p className="text-sm opacity-90">
            Create and publish sacred temporal gatherings for others to join.
          </p>
          <button
            onClick={() => router.push("/events/create")}
            className="mt-3 px-4 py-2 bg-white text-black font-medium rounded shadow hover:bg-opacity-90 transition"
          >
            Begin
          </button>
        </section>
      )}

      {archetypes.includes("Session Host") && (
        <section className="p-5 rounded-xl bg-green-700 text-white shadow-lg hover:shadow-green-500/50 transition">
          <h2 className="text-xl font-bold">🕯 Session Hosting</h2>
          <p className="text-sm opacity-90">
            Set your availability, receive BTC ripples, and host 1:1 presence-based sessions.
          </p>
          <button
            onClick={() => router.push("/sessions/manage")}
            className="mt-3 px-4 py-2 bg-white text-black font-medium rounded shadow hover:bg-opacity-90 transition"
          >
            Begin
          </button>
        </section>
      )}

      {archetypes.includes("Witness Only") && (
        <section className="p-5 rounded-xl bg-gray-800 text-white shadow-lg hover:shadow-gray-400/40 transition">
          <h2 className="text-xl font-bold">👁 Gentle Witness</h2>
          <p className="text-sm opacity-90">
            You are not here to act or lead — just to observe, reflect, and hold space. That’s sacred.
          </p>
          <button
            onClick={() => router.push("/threads")}
            className="mt-3 px-4 py-2 bg-white text-black font-medium rounded shadow hover:bg-opacity-90 transition"
          >
            Enter
          </button>
        </section>
      )}
    </div>
  );
}
