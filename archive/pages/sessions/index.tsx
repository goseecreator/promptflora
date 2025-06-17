
import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

type SessionMeta = {
  name: string;
  description: string;
  type: string;
  welcomeMessage: string;
};

type AvailabilityData = {
  uid: string;
  duration: number;
  slots: Record<string, string[]>;
  meta?: SessionMeta;
};

const SESSION_TYPES = ["All", "Reflection", "Co-Creation", "Guidance", "Integration"];

export default function PublicSessionsPage() {
  const [availabilityData, setAvailabilityData] = useState<AvailabilityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "availability"));
      const sessions = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const uid = docSnap.id;
          const data = docSnap.data();
          const metaSnap = await getDoc(doc(db, "sessionsMeta", uid));
          const meta = metaSnap.exists() ? (metaSnap.data() as SessionMeta) : undefined;
          return {
            uid,
            duration: data.duration,
            slots: data.slots,
            meta,
          };
        })
      );
      setAvailabilityData(sessions);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredData = filterType === "All"
    ? availabilityData
    : availabilityData.filter(d => d.meta?.type === filterType);

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 text-white">
      <h1 className="text-3xl font-bold mb-6">🌐 Book a Session</h1>

      <div className="mb-6">
        <label className="block text-sm font-semibold mb-1">Filter by Session Type</label>
        <select
          className="p-2 rounded bg-white text-black"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          {SESSION_TYPES.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-white text-center">Loading sessions...</p>
      ) : (
        filteredData.map((session) => (
          <div key={session.uid} className="mb-8 p-4 border rounded-lg shadow text-white bg-gray-800">
            <h2 className="text-xl font-bold mb-1">{session.meta?.name || "Untitled Session"}</h2>
            <p className="text-purple-300 text-sm mb-2">Type: {session.meta?.type || "Unknown"}</p>
            <p className="mb-2">{session.meta?.welcomeMessage || "Welcome to this session space."}</p>

            {Object.entries(session.slots).map(([date, times]) => (
              <div key={date} className="mb-3">
                <p className="font-medium text-blue-300">{date}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {times.map((time) => (
                    <button
                      key={time}
                      onClick={() => alert(`Session requested with ${session.uid} on ${date} at ${time}`)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}
