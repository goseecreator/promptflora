import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

export default function EchoList() {
  const [echoes, setEchoes] = useState([]);

  useEffect(() => {
    const fetchEchoes = async () => {
      const q = query(collection(db, "echoes"), orderBy("createdAt", "desc"), limit(10));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data());
      setEchoes(data);
    };
    fetchEchoes();
  }, []);

  return (
    <div className="space-y-3 text-sm text-purple-200">
      {echoes.map((echo, i) => (
        <blockquote key={i} className="border-l-2 border-purple-500 pl-4 italic">
          {echo.text}
        </blockquote>
      ))}
    </div>
  );
}
