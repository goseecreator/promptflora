import { useState } from "react";
import { db } from "../../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function ThreadSubmitPage() {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await addDoc(collection(db, "echoes"), {
        text,
        createdAt: serverTimestamp(),
        isAnon: true
      });
      setSent(true);
      setText("");
    } catch (err) {
      console.error("Failed to submit echo", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-900 text-white px-6 py-12">
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">🪞 Reflect into the Thread</h1>
        <p className="text-center text-purple-300">
          Leave a reflection, whisper, or ripple — anonymously or in spirit.
        </p>
        {sent && <p className="text-green-400 text-center">Thank you. Your echo has entered the thread.</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder="Your reflection..."
            className="w-full p-4 rounded bg-gray-800 text-white placeholder-purple-300"
            required
          />
          <button
            type="submit"
            disabled={sending || !text.trim()}
            className="w-full py-2 bg-pink-600 hover:bg-pink-500 rounded"
          >
            {sending ? "Sending..." : "Submit Reflection"}
          </button>
        </form>
      </div>
    </div>
  );
}
