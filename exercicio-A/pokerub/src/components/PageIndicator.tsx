import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  page: number;
}

export default function PageIndicator({ page }: Props) {
  return (
    <div className="fixed top-4 right-4 z-50 bg-zinc-800 text-white px-3 py-1 rounded-full shadow-lg text-sm">
      <AnimatePresence mode="wait">
        <motion.span
          key={page}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
        >
          Página {page}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}