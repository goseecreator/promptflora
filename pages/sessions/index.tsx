// pages/sessions/index.tsx
import { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";

export default function PublicSessionsPage() {
  const [availabilityData, setAvailabilityData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/register");
      }
    });
  }, [router]);

  useEffect(() => {
    const fetchAllAvailability = async () => {
      const snapshot = await getDocs(collection(db, "availability"));
      const data = snapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      }));
      setAvailabilityData(data);
      setLoading(false);
    };

    fetchAllAvailability();
  }, []);

  const requestSession = async (hostId: string, date: string, time: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        router.push("/register");
        return;
      }

      await addDoc(collection(db, "sessionRequests"), {
        hostId,
        date,
        time,
        requesterId: user.uid,
        requesterEmail: user.email || "unverified",
        requestedAt: new Date().toISOString(),
        status: "pending" // default for hosts to accept or decline later
      });

      alert(`Session requested with ${hostId} on ${date} at ${time}`);
    } catch (error) {
      console.error("Error requesting session:", error);
      alert("Failed to request session.");
    }
  };

  if (loading) {
    return <p className="text-white text-center mt-10">Loading sessions...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-6 text-white">
      <h1 className="text-3xl font-bold mb-6">📆 Available Sessions</h1>
      {availabilityData.map(({ uid, duration, slots }) => (
        <div key={uid} className="mb-6 p-4 border rounded-lg bg-gray-900">
          <h2 className="text-xl font-semibold mb-2">Host: {uid}</h2>
          <p className="text-sm text-purple-300 mb-1">Duration: {duration} minutes</p>
          <div className="space-y-2">
            {Object.entries(slots).map(([date, times]) => (
              <div key={date}>
                <p className="text-sm font-medium">{date}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {(times as string[]).map((time) => (
                    <button
                      key={time}
                      onClick={() => requestSession(uid, date, time)}
                      className="bg-green-700 hover:bg-green-800 text-white text-sm px-3 py-1 rounded-full"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
