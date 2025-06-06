import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";

export default function PortalsPage() {
  const [portals, setPortals] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const fetchPortals = async () => {
      const q = query(collection(db, "portals"), where("visibility", "==", "public"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPortals(data);
    };
    fetchPortals();
  }, []);

  const filteredPortals = filter
    ? portals.filter(p => p.tags?.includes(filter))
    : portals;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-black text-white px-6 py-12">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Explore live and upcoming portals</h1>
        <p className="text-purple-300 max-w-xl mx-auto">
          Invitations to subtle spaces. Gently step through.
        </p>
      </section>

      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {["grief alchemy", "inner child", "sovereignty", "creative fire"].map(tag => (
          <button
            key={tag}
            onClick={() => setFilter(tag === filter ? "" : tag)}
            className={`px-4 py-1 rounded-full border ${filter === tag ? "bg-purple-700" : "border-purple-500 text-purple-300"}`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPortals.map(({ id, name, description, tags, status }) => (
          <Link key={id} href={`/portals/${id}`} className="block">
            <div className={`bg-gray-900 border rounded-xl p-6 shadow hover:border-pink-500 transition ${status === "LIVE" ? "border-pink-500" : "border-purple-700"}`}>
              <h2 className="text-2xl font-semibold text-pink-400">{name}</h2>
              <p className="text-sm text-gray-300 mt-2 line-clamp-3">{description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {tags?.map((tag) => (
                  <span key={tag} className="px-2 py-1 text-xs bg-purple-800 rounded-full text-purple-100">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="text-sm mt-4">
                <span className={`font-medium ${status === "LIVE" ? "text-green-400" : "text-purple-400"}`}>
                  {status}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
