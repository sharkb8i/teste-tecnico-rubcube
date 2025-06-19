import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export interface EvoPreview {
  name: string;
  image: string;
}

interface EvolutionChainProps {
  evolution: EvoPreview[];
  currentName: string;
}

export default function EvolutionChain({ evolution, currentName }: EvolutionChainProps) {
  if (evolution.length <= 1) return null;

  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        <h3 className="text-xl font-semibold mt-4">Linha Evolutiva</h3>
        <div className="flex gap-4 py-2 mt-4" style={{ whiteSpace: 'nowrap' }}>
          {evolution.map((evo, idx) => (
            <div
              key={evo.name}
              className="inline-flex items-center gap-4 overflow-visible"
              style={{ whiteSpace: 'nowrap' }}
            >
              <Link to={`/pokemon/${evo.name}`}>
                <motion.div
                  whileHover={{ rotateZ: 2, scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`min-w-[110px] flex flex-col items-center p-2 rounded-lg shadow overflow-visible relative z-10
                    ${evo.name === currentName ? 'bg-neutral-600' : 'bg-neutral-700'}`}
                >
                  {evo.image && (
                    <img
                      src={evo.image}
                      alt={evo.name}
                      className="w-20 h-20 object-contain"
                    />
                  )}
                  <span className="capitalize mt-2 text-white text-sm font-medium">
                    {evo.name}
                  </span>
                </motion.div>
              </Link>

              {idx < evolution.length - 1 && (
                <motion.span
                  className="text-2xl text-gray-500 flex-shrink-0"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                >
                  ➤
                </motion.span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}