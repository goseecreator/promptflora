import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

import { Timestamp } from "firebase/firestore";

type Echo = {
  id: string;
  text: string;
  createdAt?: Timestamp;
};


export default function EchoList() {
  const [echoes, setEchoes] = useState<Echo[]>([]);

  useEffect(() => {
    const fetchEchoes = async () => {
      const q = query(
        collection(db, "echoes"),
        orderBy("createdAt", "desc"),
        limit(10)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Echo, "id">),
      }));
      setEchoes(data);
    };

    fetchEchoes();
  }, []);

  return (
    <div className="space-y-3 text-sm text-purple-200">
      {echoes.map((echo) => (
        <blockquote
          key={echo.id}
          className="border-l-2 border-purple-500 pl-4 italic"
        >
          {echo.text}
        </blockquote>
      ))}
    </div>
  );
}
