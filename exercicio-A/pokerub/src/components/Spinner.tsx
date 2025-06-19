import { motion } from 'framer-motion';

export default function Spinner() {
  return (
    <motion.div
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-8 h-8 border-4 border-t-yellow-600 border-gray-400 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        />
    </motion.div>
  );
}