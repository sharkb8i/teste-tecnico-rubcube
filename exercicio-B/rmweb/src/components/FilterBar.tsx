import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useFavorites } from "../contexts/FavoritesContext";
import { useSearchCategory, type FilterField } from "../contexts/SearchCategoryContext";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Props {
  filter: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

const FilterBar: React.FC<Props> = ({
  filter,
  onChange,
  onClear,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { isFavoritesMode, toggleFavoriteMode } = useFavorites();
  const {
    category, setCategory, selectedField
  } = useSearchCategory();

  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const allCategories = ["personagem", "localizacao", "episodio"] as const;

  const filtersByCategory = {
    personagem: ["nome", "status", "espécie", "gênero"],
    localizacao: ["nome", "tipo", "dimensão"],
    episodio: ["nome", "episódio"],
  };

  const handleClear = () => {
    onChange("");
    if (onClear) onClear();
  };

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isExpanded, filter, category, selectedField]);

  return (
    <div className="w-full">
      <div className="flex flex-row gap-4 w-full items-start">
        <div className="flex flex-col flex-grow">
          <div className="relative w-full flex items-center">
            <input
              type="text"
              placeholder="Pesquise por nome, status, espécie, gênero, localização ou episódio..."
              value={filter}
              onChange={(e) => onChange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {filter && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0"
                aria-label="Limpar filtro"
              >
                &#x2715;
              </button>
            )}
          </div>
          
          <div
            className={`cursor-pointer bg-neutral-900 p-4 flex items-center justify-between text-white font-semibold ${
              !isExpanded ? "rounded-b-xl" : ""
            }`}
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            Filtrar por
            <span>{isExpanded ? "▲" : "▼"}</span>
          </div>
          
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                key="filter-panel"
                initial={{ opacity: 0, height: contentHeight }}
                animate={{ opacity: 1, height: contentHeight }}
                exit={{ opacity: 0, height: contentHeight }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="px-4 pb-4 bg-neutral-900 rounded-b-xl overflow-hidden"
                style={{ height: contentHeight }}
              >
                <div ref={contentRef} className="flex gap-4 flex-wrap pb-4">
                  <div className="flex gap-8">
                    {allCategories.map((cat) => (
                      <div key={cat} className="flex flex-col">
                        <label
                          className="flex items-center gap-2 text-white cursor-pointer select-none bg-stone-950 py-2 px-4 rounded-lg"
                        >
                          <input
                            type="radio"
                            name="search-category"
                            value={cat}
                            checked={category === cat}
                            onChange={() => setCategory(cat)}
                            className="appearance-none w-3 h-3 border-2 border-gray-400 rounded-full checked:border-yellow-500 checked:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 cursor-pointer transition"
                          />
                          <span className="ml-1 capitalize">{cat}</span>
                        </label>

                        <div className="mt-2 flex flex-wrap justify-center gap-4">
                          {filtersByCategory[cat].map((field) => (
                            <div
                              key={field}
                              onClick={() => setCategory(cat, field as FilterField)}
                              className={`flex items-center gap-2 cursor-pointer select-none py-1 px-3 rounded
                                ${
                                  category === cat && selectedField === field
                                    ? "bg-yellow-500 text-stone-900"
                                    : "bg-stone-800 text-gray-400"
                                }
                              `}
                            >
                              <span className="text-sx capitalize">{field}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={toggleFavoriteMode}
          className={`min-w-fit h-fit self-start px-4 py-2 rounded border ${
            isFavoritesMode
              ? "bg-yellow-500 text-black border-yellow-400"
              : "bg-neutral-800 text-white border-neutral-600"
          }`}
        >
          ★ Meus Favoritos
        </button>
      </div>
    </div>
  );
};

export default FilterBar;