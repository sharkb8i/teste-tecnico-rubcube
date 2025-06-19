import React, { useEffect, useState } from "react";

import EpisodeModal from "./EpisodeModal";

import { type Character } from "../hooks/useFetchCharacters";
import StyledSelect from "./StyledSelect";
import StatusDot from "./StatusDot";

interface Props {
  character: Character;
  onClose: () => void;
}

const CharacterModal: React.FC<Props> = ({ character, onClose }) => {
  const [selectedEpisodeUrl, setSelectedEpisodeUrl] = useState<string | null>(null);

  useEffect(() => {
    if (selectedEpisodeUrl !== null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, selectedEpisodeUrl]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-neutral-950 text-white rounded-lg max-w-md w-full shadow-lg flex flex-col max-h-[90vh]"
      >
        {selectedEpisodeUrl ? (
          <EpisodeModal
            url={selectedEpisodeUrl}
            onClose={() => setSelectedEpisodeUrl(null)}
          />
        ) : (
          <>
            <div className="overflow-y-auto p-6">
              <h2 className="text-2xl font-bold mb-4">{character.name}</h2>
              <img
                src={character.image}
                alt={character.name}
                className="w-full rounded-lg mb-4"
              />
              <p className="flex items-center gap-2">
                <strong>Status </strong>
                <StatusDot status={character.status} />
              </p>
              <p>
                <strong>Espécie:</strong> {character.species}
              </p>
              <p>
                <strong>Gênero:</strong> {character.gender}
              </p>
              <p>
                <strong>Localização:</strong> {character.location.name}
              </p>

              <div className="mt-4">
                <StyledSelect
                  id="episode-select"
                  label="Episódios"
                  defaultValue=""
                  onChange={(e) => setSelectedEpisodeUrl(e.target.value)}
                  options={[
                    { value: "", label: "Selecione um episódio..." },
                    ...character.episode.map((epUrl) => ({
                      value: epUrl,
                      label: epUrl,
                    })),
                  ]}
                />
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
          </>
        )}
      </div>
    </div>
  );
};

export default CharacterModal;