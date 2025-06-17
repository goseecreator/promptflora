import { useState } from "react";
import { useRouter } from "next/router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function CreateProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [resonance, setResonance] = useState("Open");
  const [isPublic, setIsPublic] = useState(true);
  const [uid, setUid] = useState<string | null>(null);

  // Get current user UID
  useState(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid);
      else router.push("/register");
    });
  });

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid) return;

    const project = {
      title,
      description,
      tags,
      resonance,
      isPublic,
      createdAt: serverTimestamp(),
      createdBy: uid
    };

    const docRef = await addDoc(collection(db, "projects"), project);
    router.push(`/projects/${docRef.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4 text-white">
      <h1 className="text-3xl font-bold mb-6">📁 Create a Sacred Project</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium">Project Title</label>
          <input
            className="w-full p-2 rounded bg-white text-black"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description (Markdown)</label>
          <textarea
            className="w-full p-2 rounded bg-white text-black"
            rows={5}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <div className="mt-2 p-2 border rounded bg-white text-black text-sm">
            <p><strong>Preview:</strong></p>
            <pre className="whitespace-pre-wrap">{description}</pre>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Tags</label>
          <div className="flex gap-2 mb-2">
            <input
              className="flex-1 p-2 rounded bg-white text-black"
              placeholder="Add a tag"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
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
            {tags.map(tag => (
              <span
                key={tag}
                className="bg-blue-600 px-3 py-1 rounded-full text-sm"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-2 text-white"
                  aria-label={`Remove ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Resonance</label>
          <select
            className="w-full p-2 rounded bg-white text-black"
            value={resonance}
            onChange={e => setResonance(e.target.value)}
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
          className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded"
        >
          Create Project
        </button>
      </form>
    </div>
  );
}
