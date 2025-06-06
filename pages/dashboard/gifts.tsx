import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";

export default function GiftHistory() {
  const [user] = useAuthState(auth);
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchGifts = async () => {
      const q = query(collection(db, "gifts"), where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      const results = await Promise.all(snapshot.docs.map(async docSnap => {
        const data = docSnap.data();
        const portalRef = doc(db, "portals", data.portalId);
        const portalSnap = await getDoc(portalRef);
        return {
          ...data,
          portalName: portalSnap.exists() ? portalSnap.data().name : "Unknown",
          portalTags: portalSnap.exists() ? portalSnap.data().tags : []
        };
      }));
      setGifts(results);
      setLoading(false);
    };
    fetchGifts();
  }, [user]);

  if (!user || loading) {
    return <p className="text-white text-center mt-10">Loading your gifts...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto py-12 text-white">
      <h1 className="text-3xl font-bold mb-6">Your Gift Lineage</h1>
      {gifts.length === 0 ? (
        <p className="text-purple-300">You haven’t gifted any portals yet.</p>
      ) : (
        <ul className="space-y-4">
          {gifts.map((gift, i) => (
            <li key={i} className="bg-gray-900 border border-purple-800 p-4 rounded">
              <p className="text-lg font-semibold text-pink-400">{gift.portalName}</p>
              <p className="text-sm text-purple-300">Tier: {gift.tier}</p>
              <p className="text-sm text-gray-400">Tags: {gift.portalTags?.join(", ")}</p>
              <p className="text-xs text-gray-500 mt-1">Blessed at: {gift.giftedAt?.toDate?.().toLocaleString?.() || "Unknown time"}</p>
              <button className="mt-3 px-4 py-1 rounded bg-blue-700 hover:bg-blue-600 text-sm text-white">Let the Ripple Flow</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
