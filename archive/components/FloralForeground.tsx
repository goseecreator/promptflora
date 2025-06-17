import { motion } from "framer-motion";
import React from "react";

const petals = [
  { x: "10%", delay: 0 },
  { x: "30%", delay: 1 },
  { x: "50%", delay: 2 },
  { x: "70%", delay: 0.5 },
  { x: "90%", delay: 1.5 },
];

export default function FloralForeground() {
  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {petals.map((petal, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          style={{ left: petal.x, top: "100%" }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: "-120vh", opacity: [0, 0.8, 0] }}
          transition={{
            delay: petal.delay,
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span className="select-none" style={{ fontSize: "1.5rem" }}>
            {["🌸", "✨", "💮", "🌿", "🌷"][i % 5]}
          </span>
        </motion.div>
      ))}
    </div>
  );
}