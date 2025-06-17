import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  increment,
  arrayUnion,
} from "firebase/firestore";
import QRCode from "react-qr-code";
import type { User } from "firebase/auth"; // Add this at the top


export default function ReceiveGift() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [walletType, setWalletType] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        const ref = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(ref);
        const data = snap.data();

        if (data?.lightningWallet || data?.onchainWallet) {
          setWalletType(data.lightningWallet ? "lightning" : "onchain");
          setWalletAddress(data.lightningWallet || data.onchainWallet);
          setSaved(true);
        }
      } else {
        router.push("/register");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleSave = async () => {
    try {
      if (!user || !walletType || !walletAddress) return;

      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          ...(walletType === "lightning" && { lightningWallet: walletAddress }),
          ...(walletType === "onchain" && { onchainWallet: walletAddress }),
        },
        { merge: true }
      );

      await addDoc(collection(db, "gifts"), {
        uid: user.uid,
        walletType,
        address: walletAddress,
        tier: "Seed",
        timestamp: Date.now(),
      });

      const aquiferRef = doc(db, "aquifer", "giftFlow");
      await setDoc(
        aquiferRef,
        {
          lastUpdated: Date.now(),
          totalReceived: increment(1),
          contributors: arrayUnion(user.uid),
        },
        { merge: true }
      );

      setSaved(true);
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Failed to save gift:", err.message);
    }
  };

  if (loading) return <p className="p-4">Loading your session...</p>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Receive Your Bitcoin Gift</h1>

      {!walletType && (
        <div className="space-y-3 mb-6">
          <p>How would you like to receive your gift?</p>
          <button
            className="w-full px-4 py-2 bg-yellow-500 text-white rounded"
            onClick={() => setWalletType("lightning")}
          >
            ⚡ Lightning Wallet (GetAlby)
          </button>
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => setWalletType("onchain")}
          >
            ⛓ On-Chain Wallet (Muun)
          </button>
        </div>
      )}

      {walletType && !saved && (
        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Enter your {walletType} address:
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 p-2 rounded mb-4"
            placeholder={walletType === "lightning" ? "lnbc..." : "bc1..."}
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
          />
          <button
            className="w-full py-2 bg-green-600 text-white rounded"
            onClick={handleSave}
          >
            Save Wallet Address
          </button>
        </div>
      )}

      {saved && (
        <div className="mt-6 text-center">
          <p className="mb-2">
            🌱 A seed has been planted. Your gift will flow here:
          </p>
          <div className="inline-block bg-white p-2 rounded shadow">
            <QRCode value={walletAddress} size={160} />
          </div>
          <p className="mt-3 text-sm break-all text-gray-700">
            {walletAddress}
          </p>
        </div>
      )}
    </div>
  );
}
