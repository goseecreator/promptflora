// pages/sessions/manage.tsx
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../../lib/firebase";
import { UserProfile } from "../../types/types";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function ManageSessionsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [availability, setAvailability] = useState<Record<string, string[]>>({});
  const [duration, setDuration] = useState<number>(60);
  const [newTime, setNewTime] = useState<string>("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const formattedDate = selectedDate?.toISOString().split("T")[0] || "";

  const addCustomTime = () => {
    if (!newTime) return;
    setAvailability((prev) => {
      const daySlots = prev[formattedDate] || [];
      return {
        ...prev,
        [formattedDate]: [...new Set([...daySlots, newTime])],
      };
    });
    setNewTime("");
  };

  const removeTime = (time: string) => {
    setAvailability((prev) => {
      const daySlots = prev[formattedDate] || [];
      return {
        ...prev,
        [formattedDate]: daySlots.filter((t) => t !== time),
      };
    });
  };

  const handleSaveAvailability = async () => {
    if (!profile) return;
    try {
      await setDoc(doc(db, "availability", profile.uid), {
        duration,
        slots: availability,
      });
      alert("Availability saved.");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save availability.");
    }
  };

  if (loading) {
    return <p className="text-white text-center mt-10">Loading your session portal...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 px-6 text-white">
      <h1 className="text-3xl font-bold mb-4">🕯 Your Session Availability</h1>

      {profile?.lightningAddress && (
        <div className="mb-6 p-4 border border-green-500 rounded-lg bg-green-900">
          <h2 className="font-semibold mb-1">Your Lightning Address</h2>
          <p className="text-sm mb-2">{profile.lightningAddress}</p>
          <a
            href={`https://lightningaddress.com/${profile.lightningAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-green-300 text-sm"
          >
            Gift BTC →
          </a>
        </div>
      )}

      <div className="mb-4">
        <label className="block font-semibold mb-1">Session Duration</label>
        <select
          className="w-full p-2 rounded bg-white text-black"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
        >
          {[30, 45, 60].map((d) => (
            <option key={d} value={d}>{d} minutes</option>
          ))}
        </select>
      </div>

      <Calendar
        onChange={(date) => setSelectedDate(date as Date)}
        value={selectedDate}
        className="mb-4 rounded bg-white text-black p-2"
      />

      <h2 className="text-lg font-semibold mb-2">Custom Times for {formattedDate}</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="time"
          value={newTime}
          onChange={(e) => setNewTime(e.target.value)}
          className="p-2 rounded bg-white text-black"
        />
        <button
          onClick={addCustomTime}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Add Time
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {(availability[formattedDate] || []).map((time) => (
          <button
            key={time}
            onClick={() => removeTime(time)}
            className="bg-gray-700 border border-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
          >
            {time} ✕
          </button>
        ))}
      </div>

      <button
        onClick={handleSaveAvailability}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded font-semibold"
      >
        Save Availability
      </button>
    </div>
  );
}
