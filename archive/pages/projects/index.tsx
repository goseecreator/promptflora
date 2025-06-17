import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import Link from "next/link";
import { Project } from "../../types/types";

export default function ProjectListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const q = query(collection(db, "projects"), where("isPublic", "==", true));
      const snapshot = await getDocs(q);
      const results = snapshot.docs.map((doc) => {
        const raw = doc.data() as Omit<Project, "id">;
        return {
          id: doc.id,
          ...raw
        };
      });
      
      
      setProjects(results);
      setLoading(false);
    };

    fetchProjects();
  }, []);

  if (loading) return <p className="text-white text-center mt-10">Loading public projects...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 text-white">
      <h1 className="text-3xl font-bold mb-6">🌐 Public Projects</h1>
      <div className="space-y-6">
        {projects.map((project) => (
          <div key={project.id} className="p-4 border border-purple-500 rounded-xl shadow">
            <h2 className="text-xl font-bold mb-1">{project.title}</h2>
            <p className="text-sm text-purple-300 mb-2">Resonance: {project.resonance}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              {project.tags?.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link href={`/projects/${project.id}`} className="text-blue-300 underline">
              View Project →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
