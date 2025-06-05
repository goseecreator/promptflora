import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Project, UserProfile } from "../../types/types";

export default function ProjectDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [project, setProject] = useState<Project | null>(null);
  const [creator, setCreator] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
        const docRef = doc(db, "projects", String(id));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Project;
          setProject(data);

          if (data.createdBy) {
            const userRef = doc(db, "users", data.createdBy);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              setCreator(userSnap.data() as UserProfile);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <p className="text-center text-white mt-10">Loading project...</p>;

  if (!project) return <p className="text-center text-red-400 mt-10">Project not found.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 text-white">
      <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
      <p className="text-sm text-purple-300 mb-4">Resonance: {project.resonance}</p>

      {creator?.lightningAddress && (
        <div className="mb-4 text-sm text-green-300">
          Gift BTC to{" "}
          <a
            href={`https://lightningaddress.com/${creator.lightningAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {creator.lightningAddress}
          </a>
        </div>
      )}

      <p className="mb-6 whitespace-pre-wrap border-l-4 border-purple-500 pl-4">
        {project.description}
      </p>

      <div className="mb-6">
        <h3 className="font-medium mb-2">Tags:</h3>
        <div className="flex flex-wrap gap-2">
          {project.tags?.map((tag) => (
            <span
              key={tag}
              className="bg-blue-700 text-white px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-300">
        Visibility: {project.isPublic ? "Public" : "Private"}
      </p>

      <div className="mt-6">
        <a href="/projects" className="text-blue-300 underline">
          ← Back to Projects
        </a>
      </div>
    </div>
  );
}
