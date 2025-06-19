import React, { useEffect, useState } from "react";

import { useFetchEpisodes } from "../hooks/useFetchEpisodes";

interface Props {
  url: string;
  onClose: () => void;
}

interface Character {
  id: number;
  name: string;
  image: string;
}

const EpisodeModal: React.FC<Props> = ({ url, onClose }) => {
  const { episode, loading } = useFetchEpisodes(url);
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (!episode) return;

    const fetchCharacters = async () => {
      const promises = episode.characters.map((url) =>
        fetch(url).then((res) => res.json())
      );
      const results = await Promise.all(promises);
      setCharacters(results);
    };

    fetchCharacters();
  }, [episode]);

  if (loading || !episode) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-neutral-950 text-white rounded-lg max-w-2xl w-full shadow-lg flex flex-col max-h-[90vh]"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2">{episode.name}</h2>
          <p className="text-sm text-gray-400 mb-4">
            {episode.episode} — {episode.air_date}
          </p>

          <h3 className="text-lg font-semibold mb-4">Personagens</h3>
          <div className="max-h-[50vh] overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-4">
            {characters.map((char) => (
              <div
                key={char.id}
                className="flex flex-col items-center text-center"
              >
                <img
                  src={char.image}
                  alt={char.name}
                  className="w-20 h-20 rounded-full"
                />
                <span className="mt-2 text-sm">{char.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pl-4 pb-4 pr-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EpisodeModal;