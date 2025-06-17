import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Ghost, Wand2 } from 'lucide-react';

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8 text-center overflow-hidden relative">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          The glyph you sought has vanished into mist.
        </p>
        <blockquote className="italic text-gray-500 max-w-md">
          &quot;Not all who wander are lost — some are just decoding mischief.&quot;
        </blockquote>
        <Link href="/" passHref>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 inline-block bg-black text-white px-6 py-3 rounded-2xl shadow-md hover:bg-gray-800 transition-all"
          >
            Return to the Hollow
          </motion.a>
        </Link>
      </motion.div>

      <motion.div
        className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-gray-200 to-transparent"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />

      <motion.div
        className="absolute top-8 left-8 text-gray-400"
        initial={{ rotate: -10, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        title="Wandering spirit"
      >
        <Ghost size={32} />
      </motion.div>

      <motion.div
        className="absolute top-8 right-8 text-yellow-400"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        title="Mischief spark"
      >
        <Sparkles size={28} />
      </motion.div>

      <motion.div
        className="absolute bottom-8 right-8 text-purple-500"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        title="Magick glyph"
      >
        <Wand2 size={30} />
      </motion.div>
    </div>
  );
}
