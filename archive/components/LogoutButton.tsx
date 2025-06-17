import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import React from "react";

export default function LogoutButton() {
  const router = useRouter();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-purple-200 hover:bg-purple-300 text-purple-800 rounded-md shadow transition"
    >
      Log Out
    </button>
  );
}