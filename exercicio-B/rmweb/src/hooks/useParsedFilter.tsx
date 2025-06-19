/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSearchCategory } from "../contexts/SearchCategoryContext";

export function useParsedFilter() {
  const { selectedField } = useSearchCategory();

  return (input: string) => {
    const obj: any = {};

    const mapping: Record<string, string> = {
      nome: "name",
      status: "status",
      espécie: "species",
      gênero: "gender",
      tipo: "type",
      dimensão: "dimension",
      episódio: "episode"
    };

    const pattern = /(\w+)=((?:[^\s=]+ ?)+)/g;
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(input)) !== null) {
      const rawKey = match[1].toLowerCase();
      const value = match[2].trim();

      const mappedKey = mapping[rawKey] || rawKey;
      obj[mappedKey] = value;
    }

    if (Object.keys(obj).length === 0 && input.trim()) {
      const fallbackKey = mapping[selectedField] || selectedField;
      obj[fallbackKey] = input.trim();
    }

    return obj;
  };
}