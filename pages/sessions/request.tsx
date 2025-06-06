import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../lib/firebase";
import { collection, query, where, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";

export default function SessionRequestsPage() {
  const [user] = useAuthState(auth);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    if (!user) return;
    const q = query(collection(db, "sessionRequests"), where("hostId", "==", user.uid));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "sessionRequests", id), { status });
    fetchRequests();
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Incoming Session Requests</h1>
      {requests.length === 0 && <p>No session requests.</p>}
      {requests.map((req) => (
        <div key={req.id} className="border p-4 rounded mb-4">
          <p><strong>Date:</strong> {req.day}</p>
          <p><strong>Time:</strong> {req.time}</p>
          <p><strong>Status:</strong> {req.status}</p>
          {req.status === "pending" && (
            <div className="flex gap-2 mt-2">
              <button onClick={() => updateStatus(req.id, "accepted")} className="bg-green-600 text-white px-3 py-1 rounded">Accept</button>
              <button onClick={() => updateStatus(req.id, "declined")} className="bg-red-600 text-white px-3 py-1 rounded">Decline</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
