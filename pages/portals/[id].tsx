import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import PortalGiftingSection from "../../components/PortalGiftingSection";

type Portal = {
  id?: string;
  name: string;
  description: string;
  overview: string;
  tags: string[];
  tiers: {
    name: string;
    description: string;
    amount: number;
  }[];
};


export default function PortalProfilePage() {
  const router = useRouter();
  const { id } = router.query;

  const [portal, setPortal] = useState<Portal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchPortal = async () => {
      try {
        const ref = doc(db, "portals", id as string);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setPortal({ id: snap.id, ...(snap.data() as Portal) });
        }
      } catch (error) {
        console.error("Error fetching portal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortal();
  }, [id]);

  if (loading) return <p className="text-white text-center mt-10">Loading portal...</p>;
  if (!portal) return <p className="text-red-400 text-center mt-10">Portal not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 text-white space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{portal.name}</h1>
        <p className="text-purple-200 mt-2">{portal.description}</p>
        <div className="flex gap-2 flex-wrap mt-4">
          {portal.tags?.map((tag, i) => (
            <span key={i} className="bg-purple-800 px-3 py-1 rounded-full text-sm text-purple-200">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-purple-300 mb-2">Portal Intention</h2>
        <p className="text-gray-300">{portal.overview}</p>
      </div>

      {/* Gifting Tier UI */}
      <PortalGiftingSection portal={portal} />
    </div>
  );
}
