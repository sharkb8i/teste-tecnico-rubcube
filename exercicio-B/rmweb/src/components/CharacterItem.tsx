import { forwardRef } from "react";

import StatusDot from "./StatusDot";

import { type Character } from "../hooks/useFetchCharacters";
import { useFavorites } from "../contexts/FavoritesContext";

interface Props {
  character: Character;
  onSelect: (character: Character) => void;
}

const CharacterItem = forwardRef<HTMLLIElement, Props>(({ character, onSelect }, ref) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <li
      ref={ref}
      className="flex items-center mb-3 border border-neutral-700 rounded p-3 cursor-pointer hover:bg-neutral-900"
      onClick={() => onSelect(character)}
    >
      <img
        src={character.image}
        alt={character.name}
        width={50}
        height={50}
        className="rounded-full mr-4"
      />
      <div className="flex-1 font-semibold">
        {character.name}
        <span className="font-normal text-gray-500 flex items-center gap-2">
          <StatusDot status={character.status} />
          {character.status}
        </span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(character);
        }}
        className={`rounded px-3 py-1 border transition-colors hover:bg-neutral-800 ${
          isFavorite(character.id) ? "text-yellow-500" : "text-gray-400"
        }`}
        aria-label={isFavorite(character.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      >
        {isFavorite(character.id) ? "★" : "☆"}
      </button>
    </li>
  );
});

CharacterItem.displayName = "CharacterItem";

export default CharacterItem;