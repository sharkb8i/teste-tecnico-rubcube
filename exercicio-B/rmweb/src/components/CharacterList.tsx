import React from "react";

import CharacterItem from "./CharacterItem";

import { type Character } from "../hooks/useFetchCharacters";

interface Props {
  characters: Character[];
  onSelect: (character: Character) => void;
  lastCharacterRef?: (node: HTMLElement | null) => void;
}

const CharacterList: React.FC<Props> = ({ characters, onSelect, lastCharacterRef }) => {
  return (
    <ul className="list-none p-0">
      {characters.map((char, index) => {
        const isLast = index === characters.length - 1;
        return (
          <CharacterItem
            key={char.id}
            character={char}
            onSelect={onSelect}
            ref={isLast ? lastCharacterRef : null}
          />
        );
      })}
    </ul>
  );
};

export default CharacterList;