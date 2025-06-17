import Link from "next/link";

export default function CreateEventPage() {
    return (
      <div className="p-8 text-white">
        <h1 className="text-3xl font-bold mb-4">🌀 Weave a Sacred Event</h1>
        <p className="mb-4">This page will let you set time, resonance, and intention for gatherings.</p>
        <Link href="/dashboard">← Return to Dashboard</Link>
      </div>
    );
  }
  