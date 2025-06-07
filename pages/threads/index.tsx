import React from "react";
import EchoList from "@/components/EchoList";



export default function SacredThread() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black text-white p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold">🌸 The Sacred Thread</h1>
          <p className="text-purple-300 text-md italic">
            A place to receive echoes, reflect with presence, and witness subtle transmission.
          </p>
        </header>
        

        <section className="text-center text-purple-100 max-w-xl mx-auto space-y-4">
          <p>You’ve arrived in the sacred thread.</p>
          <p>This is a space where reflections arrive as ripples.</p>
          <p>No account needed. No action required.</p>
          <p>Just witness. Just be.</p>
        </section>
        <section className="mt-12 max-w-2xl mx-auto">
  <EchoList />
</section>

        <section className="mt-10 border-t border-purple-700 pt-8">
          <p className="text-sm text-purple-400 text-center">
            Soon, this space will fill with prompts, echoes, and resonant messages gifted by the garden.
          </p>
        </section>
      </div>
    </div>
  );
}
