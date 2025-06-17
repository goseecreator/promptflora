import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/router";
import {
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import LogoutButton from "@/components/LogoutButton";

type Portal = {
  id: string;
  title: string;
  type: string;
  status: string;
};

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [portals, setPortals] = useState<Portal[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<{ title: string; type: string; id: string | null }>({ title: "", type: "project", id: null });
  const router = useRouter();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await loadPortals(currentUser.uid);
      } else {
        router.push("/register");
      }
    });
    return () => unsubscribe();
  }, [auth, router]);

  const loadPortals = async (uid: string) => {
    try {
      const q = query(collection(db, "portals"), where("uid", "==", uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Portal[];
      setPortals(data);
    } catch (error) {
      console.error("Error loading portals:", error);
    } finally {
      setLoading(false);
    }
  };

  const archivePortal = async (portalId: string) => {
    await updateDoc(doc(db, "portals", portalId), { status: "archived" });
    setPortals((prev) => prev.map((p) => (p.id === portalId ? { ...p, status: "archived" } : p)));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;

    const data = {
      uid: user?.uid || "",
      title: form.title,
      type: form.type,
      status: "active",
      createdAt: serverTimestamp(),
    };

    if (form.id) {
      await updateDoc(doc(db, "portals", form.id), data);
      setPortals((prev) => prev.map((p) => (p.id === form.id ? { ...p, ...data } : p)));
    } else {
      const docRef = await addDoc(collection(db, "portals"), data);
      setPortals((prev) => [...prev, { ...data, id: docRef.id } as Portal]);
    }

    setForm({ title: "", type: "project", id: null });
  };

  const handleEdit = (portal: Portal) => {
    setForm({ title: portal.title, type: portal.type, id: portal.id });
  };

  if (!user) {
    return <div className="text-center py-20 text-purple-600">Loading your garden...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 text-purple-800 px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-extrabold">🌱 Your Dashboard</h1>
          <LogoutButton />
        </div>

        <p className="text-lg">Welcome back, <strong>{user.displayName || user.email}</strong>.</p>

        <div className="bg-white/80 border border-purple-200 rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold">Create or Edit Portal</h2>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Portal Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full p-2 border rounded bg-purple-50 border-purple-300 placeholder-purple-400"
              required
            />
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full p-2 border rounded bg-purple-50 border-purple-300 text-purple-800"
            >
              <option value="project">Project</option>
              <option value="session">Session</option>
              <option value="event">Event</option>
            </select>
            <button
              type="submit"
              className="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
            >
              {form.id ? "Update Portal" : "Create Portal"}
            </button>
          </form>
        </div>

        <div className="bg-white/80 border border-purple-200 rounded-xl shadow p-6 space-y-4">
          <h2 className="text-xl font-semibold">Your Portals</h2>
          {loading ? (
            <p className="text-purple-400 italic">Fetching your portals...</p>
          ) : portals.length === 0 ? (
            <p className="text-purple-400 italic">You haven’t opened any portals yet.</p>
          ) : (
            <ul className="space-y-4">
              {portals.map((portal) => (
                <li
                  key={portal.id}
                  className={`border p-4 rounded-xl shadow-sm ${
                    portal.status === "archived" ? "bg-purple-50 text-purple-400" : "bg-purple-100"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">{portal.title}</h3>
                      <p className="text-sm">{portal.type}</p>
                      <p className="text-xs italic">Status: {portal.status}</p>
                    </div>
                    <div className="flex gap-2">
                      {portal.status !== "archived" && (
                        <>
                          <button
                            onClick={() => handleEdit(portal)}
                            className="px-3 py-1 text-sm bg-purple-400 hover:bg-purple-500 rounded-md transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => archivePortal(portal.id)}
                            className="px-3 py-1 text-sm bg-purple-300 hover:bg-purple-400 rounded-md transition"
                          >
                            Archive
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}