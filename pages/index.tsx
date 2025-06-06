import Link from "next/link";
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import { useEffect, useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useRouter } from "next/router";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setShowLogin(false);
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const handleResetPassword = async () => {
    setMessage("");
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent.");
    } catch (err) {
      setError("Failed to send reset email. Make sure the email is correct.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-gray-900 text-white flex flex-col justify-center items-center p-8 text-center relative">
      <Head>
        <title>PromptFlora</title>
        <meta name="description" content="Creative Sanctuary for Guides and Dreamers" />
      </Head>
      <h1 className="text-4xl md:text-6xl font-bold mb-6">Welcome to PromptFlora</h1>
      <p className="max-w-2xl text-lg mb-8 text-purple-300">
        One space. Many flows. Claim your thread, share your signal, host your sessions.
        PromptFlora is your creative studio for reflection, guidance, co-creation, and transformation.
      </p>

      {!user && (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Link href="/register" className="px-6 py-3 rounded bg-white text-black hover:bg-gray-200 transition text-lg font-medium">
            Sign Up
          </Link>
          <button
            onClick={() => setShowLogin(true)}
            className="px-6 py-3 rounded border border-white hover:bg-white hover:text-black transition text-lg font-medium"
          >
            Log In
          </button>
        </div>
      )}

      {showLogin && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/80 flex justify-center items-center z-50">
          <form onSubmit={handleLogin} className="bg-gray-900 p-8 rounded shadow-lg max-w-sm w-full space-y-4">
            <h2 className="text-xl font-bold">Log In</h2>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {message && <p className="text-green-500 text-sm">{message}</p>}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-white"
              required
            />
            <button
              type="button"
              onClick={handleResetPassword}
              className="text-sm text-blue-400 hover:underline"
            >
              Forgot Password?
            </button>
            <div className="flex justify-between items-center">
              <button type="submit" className="bg-pink-600 hover:bg-pink-500 px-4 py-2 rounded text-white">
                Log In
              </button>
              <button type="button" onClick={() => setShowLogin(false)} className="text-sm text-gray-400 hover:underline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="text-sm text-purple-300 mb-6">Or start where you feel most called:</div>
      <div className="flex flex-col md:flex-row gap-4">
        <Link href="/threads" className="px-6 py-3 rounded bg-purple-700 hover:bg-purple-600 transition">
          Thread Reflection
        </Link>
        <Link href="/sessions" className="px-6 py-3 rounded bg-pink-600 hover:bg-pink-500 transition">
          Host or Book a Session
        </Link>
        <Link href="/portals" className="px-6 py-3 rounded bg-indigo-600 hover:bg-indigo-500 transition">
          Join a Portal
        </Link>
      </div>
    </div>
  );
}
