import { useEffect, useState } from "react";
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../../lib/firebase";
import { Toaster, toast } from "react-hot-toast";

export default function SentSessionRequestsPage() {
  type SessionRequest = {
    id: string;
    hostId: string;
    requesterId: string;
    day: string;     // ✅ Add this line
    time: string;
    status: string;
  };
  
  
  const [requests, setRequests] = useState<SessionRequest[]>([]);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const q = query(collection(db, "sessionRequests"), where("requesterId", "==", user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => {
        const raw = doc.data() as Omit<SessionRequest, "id">;
        return { id: doc.id, ...raw };
      });
            setRequests(data);
      setLoading(false);
    });
  }, []);

  const cancelRequest = async (id: string) => {
    try {
      await deleteDoc(doc(db, "sessionRequests", id));
      setRequests((prev) => prev.filter((req) => req.id !== id));
      toast.success("Your request has been cancelled.");
    } catch (error) {
      console.error("Cancel error:", error);
      toast.error("Oops—something went wrong cancelling this.");
    }
    
  };

  if (loading) return <p className="text-white text-center mt-10">Loading your requests...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 px-6 text-white">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold mb-6">📤 My Session Requests</h1>
      {requests.length === 0 ? (
        <p className="text-purple-300">You haven&apos;t sent any session requests yet.</p>
      ) : (
        <div className="space-y-4">
          {requests.map(({ id, hostId, day, time, status }) => (
            <div key={id} className="p-4 border rounded bg-gray-800">
              <p className="font-medium">Host: {hostId}</p>
              <p className="text-sm">Date: {day} at {time}</p>
              <p className="text-sm">Status: <span className="font-bold text-green-300">{status}</span></p>
              {status === "pending" && (
                <button
                  onClick={() => cancelRequest(id)}
                  className="mt-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Cancel Request
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
