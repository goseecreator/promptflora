import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Project } from "../../../types/types";
import { motion } from "framer-motion";

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = router.query;

  const [project, setProject] = useState<Project | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [resonance, setResonance] = useState("Open");
  const [isPublic, setIsPublic] = useState(true);
  const [currentUid, setCurrentUid] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUid(user.uid);
      else router.push("/register");
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!id || currentUid === null) return;

    const loadProject = async () => {
      const docRef = doc(db, "projects", String(id));
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as Project;
        if (data.createdBy !== currentUid) {
          setAccessDenied(true);
          return;
        }

        setProject(data);
        setTitle(data.title);
        setDescription(data.description);
        setTags(data.tags || []);
        setResonance(data.resonance);
        setIsPublic(data.isPublic);
      }
      setLoading(false);
    };

    loadProject();
  }, [id, currentUid]);

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = async () => {
    if (!id) return;

    await updateDoc(doc(db, "projects", String(id)), {
      title,
      description,
      tags,
      resonance,
      isPublic,
    });

    router.push(`/projects/${id}`);
  };

  if (accessDenied) {
    return <p className="text-center text-red-400 mt-10">Access denied.</p>;
  }

  if (loading || !project) {
    return <p className="text-center text-white mt-10">Loading project...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4 text-white">
      <h1 className="text-3xl font-bold mb-6">✏️ Edit Project</h1>

      <motion.form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            className="w-full p-2 rounded bg-white text-black"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description (Markdown)</label>
          <textarea
            className="w-full p-2 rounded bg-white text-black"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              className="flex-1 p-2 rounded bg-white text-black"
              placeholder="Add a tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
            <button
              type="button"
              onClick={addTag}
              className="px-3 py-2 bg-green-500 text-white rounded"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-600 px-3 py-1 rounded-full text-sm"
              >
                {tag}
                <button onClick={() => removeTag(tag)} className="ml-2 text-white">×</button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Resonance</label>
          <select
            className="w-full p-2 rounded bg-white text-black"
            value={resonance}
            onChange={(e) => setResonance(e.target.value)}
          >
            <option>Open</option>
            <option>Invite-only</option>
            <option>Solo holding</option>
          </select>
        </div>

        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={() => setIsPublic(!isPublic)}
            />
            <span className="font-medium">Make this project public</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded"
        >
          Save Changes
        </button>
      </motion.form>
    </div>
  );
}
