/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Character } from "../hooks/useFetchCharacters";

export function matchesCharacterSearch(character: Character, search: string): boolean {
  search = search.toLowerCase().trim();

  const advancedFilter = /^(nome|status|especie|genero|localizacao|episodio)\s*=\s*(.+)$/;

  if (advancedFilter.test(search)) {
    const [, searchFieldRaw, valueStrRaw] = search.match(advancedFilter)!;
    const searchField = searchFieldRaw;
    const valueStr = valueStrRaw.trim();

    switch (searchField) {
      case "nome":
        return character.name.toLowerCase().includes(valueStr);

      case "status":
        return character.status.toLowerCase().includes(valueStr);

      case "especie":
        return character.species.toLowerCase().includes(valueStr);

      case "genero":
        return character.gender.toLowerCase().includes(valueStr);

      case "localizacao":
        return character.location.name.toLowerCase().includes(valueStr);

      case "episodio":
        return character.episode.some((ep) =>
          ep.toLowerCase().includes(valueStr)
        );

      default:
        return false;
    }
  }

  const fieldsToSearch = [
    character.name,
    character.status,
    character.species,
    character.gender,
    character.location.name,
    ...character.episode,
  ];

  return fieldsToSearch.some((field) =>
    field.toLowerCase().includes(search)
  );
}