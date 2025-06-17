import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getDoc,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  collection,
  query,
  orderBy,
  limit,
  where,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/router";
import type { Gift } from "@/types/gift";
import { format } from "date-fns";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);
  const [roles, setRoles] = useState<{ [key: string]: boolean }>({});
  const [recentGifts, setRecentGifts] = useState<Gift[]>([]);
  const [tierFilter, setTierFilter] = useState<string | null>(null);
  const [aquiferTotal, setAquiferTotal] = useState<number | null>(null);
  const [overflowReleased, setOverflowReleased] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
      router.push("/register");
      return;
    }
      setUid(firebaseUser.uid);
      console.log("🔎 Checking admin role path:", ["roles", "admins", firebaseUser?.uid]);
      const ref = doc(db, "roles", "admins", firebaseUser.uid);
      const snapshot = await getDoc(ref);
      if (!snapshot.exists()) {
        console.warn("🛑 No admin record found at:", ref.path);
      }
      if (snapshot.exists()) setIsAdmin(true);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleRoleChange = async (role: string, assign: boolean) => {
    if (!uid) return;
    const ref = doc(db, "roles", role, uid);
    if (assign) {
      await setDoc(ref, {});
    } else {
      await deleteDoc(ref);
    }
    setRoles((prev) => ({ ...prev, [role]: assign }));
  };

  useEffect(() => {
    const fetchRoles = async () => {
      if (!uid) return;
      const roleNames = ["admins", "aquiferGuardians", "rippleAgents"];
      const roleStatus: { [key: string]: boolean } = {};
      for (const role of roleNames) {
        const ref = doc(db, "roles", role, uid);
        const snapshot = await getDoc(ref);
        roleStatus[role] = snapshot.exists();
      }
      setRoles(roleStatus);
    };
    if (isAdmin) fetchRoles();
  }, [uid, isAdmin]);

  useEffect(() => {
    const fetchRecentGifts = async () => {
      const baseQuery = query(collection(db, "gifts"), orderBy("timestamp", "desc"), limit(10));
      const filteredQuery = tierFilter
        ? query(baseQuery, where("tier", "==", tierFilter))
        : baseQuery;
      const snapshot = await getDocs(filteredQuery);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Gift[];
      setRecentGifts(data);
    };
    if (isAdmin) fetchRecentGifts();
  }, [isAdmin, tierFilter]);

  useEffect(() => {
    const fetchAquiferStatus = async () => {
      const ref = doc(db, "aquifer", "giftFlow");
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setAquiferTotal(data?.totalReceived ?? null);
        setOverflowReleased(data?.overflowReleased ?? false);
      }
    };
    if (isAdmin) fetchAquiferStatus();
  }, [isAdmin]);

  const handleOverflowRelease = async () => {
    const ref = doc(db, "aquifer", "giftFlow");
    await updateDoc(ref, {
      overflowReleased: true,
      overflowReleasedAt: serverTimestamp(),
      releasedBy: uid,
    });
    setOverflowReleased(true);
  };

  if (loading) return <p className="p-4">Loading admin access...</p>;
  if (!isAdmin) return <p className="p-4 text-red-600">You are not an admin. Access denied.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🌿 Admin Dashboard</h1>

      <div className="space-y-4">
        {/* UID & Role Management */}
        <div className="border rounded p-4 bg-gray-50">
          <h2 className="font-semibold">Your UID:</h2>
          <p className="text-sm text-gray-600 break-all">{uid}</p>
        </div>

        <div className="border rounded p-4">
          <h2 className="font-semibold mb-2">Role Management</h2>
          <div className="space-y-2">
            {Object.entries(roles).map(([role, assigned]) => (
              <div key={role} className="flex justify-between items-center">
                <span className="capitalize">{role}</span>
                <button
                  className={`px-3 py-1 rounded text-white ${assigned ? "bg-red-600" : "bg-green-600"}`}
                  onClick={() => handleRoleChange(role, !assigned)}
                >
                  {assigned ? "Revoke" : "Assign"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Aquifer Threshold + Release */}
        <div className="border rounded p-4">
          <h2 className="font-semibold mb-2">Aquifer Status</h2>
          <p className="text-sm text-blue-700">
            Total Seed Gifts Logged: <strong>{aquiferTotal ?? "Loading..."}</strong>
          </p>
          {aquiferTotal !== null && aquiferTotal >= 33 && !overflowReleased && (
            <button
              onClick={handleOverflowRelease}
              className="mt-2 px-4 py-2 bg-purple-700 text-white rounded hover:bg-purple-800"
            >
              🌊 Release Overflow
            </button>
          )}
          {overflowReleased && <p className="text-green-600 mt-2">Overflow already released for this cycle.</p>}
        </div>

        {/* Recent Gifts + Tier Filter */}
        <div className="border rounded p-4">
          <h2 className="font-semibold mb-2">Recent Gifts</h2>
          <div className="mb-2">
            <label className="text-sm text-gray-700 mr-2">Filter by Tier:</label>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={tierFilter ?? ""}
              onChange={(e) => setTierFilter(e.target.value || null)}
            >
              <option value="">All</option>
              <option value="Seed">Seed</option>
              <option value="Blessing">Blessing</option>
              <option value="Spiral">Spiral</option>
              <option value="Ripple">Ripple</option>
            </select>
          </div>
          <ul className="text-sm space-y-1">
            {recentGifts.map(gift => (
              <li key={gift.id} className="text-gray-700">
                <strong>{gift.tier}</strong> — {gift.project} — {gift.wallet.slice(0, 8)}... @ {new Date(gift.timestamp).toLocaleString()}
              </li>
            ))}
            {recentGifts.length === 0 && <li className="text-gray-400">No gifts logged yet.</li>}
          </ul>
        </div>

        {/* Ripple Chain Preview */}
        <div className="border rounded p-4">
          <h2 className="font-semibold mb-2">Ripple Chain Preview</h2>
          <ul className="text-sm text-purple-700 space-y-1 list-disc list-inside">
            {recentGifts.filter(g => g.tier === "Ripple").map((gift, index) => (
              <li key={gift.id}>
                {index + 1}. Ripple from <strong>{gift.wallet.slice(0, 6)}</strong> → Project: <em>{gift.project}</em>
              </li>
            ))}
            {recentGifts.filter(g => g.tier === "Ripple").length === 0 && (
              <li className="text-gray-400">No ripple gifts yet in this cycle.</li>
            )}
          </ul>
        </div>

        {/* Blessing & Spiral Tracker */}
        <div className="border rounded p-4">
          <h2 className="font-semibold mb-2">Blessing & Spiral Gifts</h2>
          <ul className="text-sm space-y-1 text-indigo-700 list-disc list-inside">
            {recentGifts.filter(g => g.tier === "Blessing").map((gift, i) => (
              <li key={`blessing-${gift.id}`}>
                ✨ Blessing #{i + 1}: <strong>{gift.project}</strong> — {gift.wallet.slice(0, 6)}... @ {format(new Date(gift.timestamp), 'Pp')}
              </li>
            ))}
            {recentGifts.filter(g => g.tier === "Spiral").map((gift, i) => (
              <li key={`spiral-${gift.id}`}>
                🌀 Spiral #{i + 1}: <strong>{gift.project}</strong> — {gift.wallet.slice(0, 6)}... @ {format(new Date(gift.timestamp), 'Pp')}
              </li>
            ))}
            {recentGifts.filter(g => ["Blessing", "Spiral"].includes(g.tier)).length === 0 && (
              <li className="text-gray-400">No Blessing or Spiral gifts yet recorded.</li>
            )}
          </ul>
        </div>

        {/* Waterfall Flow */}
        <div className="border rounded p-4">
          <h2 className="font-semibold mb-2">🌊 Waterfall Flow of Tiers</h2>
          <ul className="text-sm list-disc list-inside space-y-1">
            <li><strong>Seed</strong>: {recentGifts.filter(g => g.tier === "Seed").length} planted</li>
            <li><strong>Blessing</strong>: {recentGifts.filter(g => g.tier === "Blessing").length} activated</li>
            <li><strong>Spiral</strong>: {recentGifts.filter(g => g.tier === "Spiral").length} transformed</li>
            <li><strong>Ripple</strong>: {recentGifts.filter(g => g.tier === "Ripple").length} extended</li>
            <li className="text-indigo-700 mt-2">
              ➤ Flow from Seed → Blessing → Spiral → Ripple visualized as a regenerative loop.
            </li>
          </ul>
        </div>

        {/* Gift Chart */}
        <div className="border rounded p-4">
          <h2 className="font-semibold mb-2">📊 Gift Inflow Chart (last 10)</h2>
          <Bar
            data={{
              labels: recentGifts.map((g, i) => `#${i + 1}`),
              datasets: [{
                label: 'Gift Amounts',
                data: recentGifts.map(g => g.amount),
                backgroundColor: 'rgba(99, 102, 241, 0.6)',
              }],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: false },
              },
              scales: {
                x: { title: { display: true, text: 'Gift' } },
                y: { title: { display: true, text: 'Amount' }, beginAtZero: true }
              }
            }}
          />
        </div>

        <p className="text-xs text-gray-400 mt-6">More admin tools coming soon...</p>
      </div>
    </div>
  );
}
