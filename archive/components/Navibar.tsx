import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";

export default function Navibar() {
  const [user] = useAuthState(auth);

  return (
    <nav className="w-full flex justify-end p-4 text-sm text-white">
      {user && (
        <button onClick={() => auth.signOut()} className="text-pink-300 underline">
          Logout
        </button>
      )}
    </nav>
  );
}
