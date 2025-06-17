import React from "react";

export default function Footer() {
  return (
    <footer className="w-full mt-24 border-t border-purple-200 bg-white/80 text-purple-700 text-sm py-6 px-4 text-center">
      <p className="mb-2">
        © {new Date().getFullYear()} PromptFlora. All rights blossomed.
      </p>
      <div className="flex justify-center gap-6 text-purple-500">
        <a href="/about" className="hover:underline">About</a>
        <a href="/contact" className="hover:underline">Contact</a>
        <a href="/privacy" className="hover:underline">Privacy</a>
        <a href="/terms" className="hover:underline">Gifting Terms</a>
        <a href="/faq" className="hover:underline">FAQ</a>
      </div>
      <p className="mt-4 italic text-purple-400">Bloom gently. Gift freely. 🌸</p>
    </footer>
  );
}