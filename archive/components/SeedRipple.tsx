import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { rippleVariants } from './motion/variants';
import type { Gift } from "@/types/gift";

type SeedRippleProps = {
    gift: Gift;
    playChime?: boolean;
  };

export default function SeedRipple({ gift, playChime = true }: SeedRippleProps) {
  useEffect(() => {
    if (playChime) {
      const audio = new Audio('/sounds/chime.mp3');
      audio.volume = 0.2;
      audio.play().catch(() => {});
    }
  }, [playChime]);

  return (
    <motion.div
      className="bg-green-50 border border-green-200 p-4 rounded-lg shadow-sm mb-4"
      variants={rippleVariants}
      initial="hidden"
      animate="visible"
    >
      <p className="text-sm text-green-700 font-semibold">🌱 A Seed was planted</p>
      {gift.blessing && <p className="mt-1 text-gray-700 italic">“{gift.blessing}”</p>}
      <p className="text-xs text-gray-400 mt-2">{new Date(gift.timestamp).toLocaleString()}</p>
    </motion.div>
  );
}
