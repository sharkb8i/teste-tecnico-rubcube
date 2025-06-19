import React, { createContext, useContext, useState } from "react";

export type SearchCategory = "personagem" | "localizacao" | "episodio";

export type FilterField = "nome" | "status" | "espécie" | "gênero" | "tipo" | "dimensão" | "episódio";

interface SearchCategoryContextType {
  category: SearchCategory;
  setCategory: (cat: SearchCategory, field?: FilterField) => void;
  selectedField: FilterField;
  setSelectedField: (field: FilterField) => void;
  filtersForCategory: FilterField[];
}

export const filtersByCategory: Record<SearchCategory, FilterField[]> = {
  personagem: ["nome", "status", "espécie", "gênero"],
  localizacao: ["nome", "tipo", "dimensão"],
  episodio: ["nome", "episódio"],
};

const SearchCategoryContext = createContext<SearchCategoryContextType | undefined>(undefined);

export const SearchCategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [category, setCategoryState] = useState<SearchCategory>("personagem");
  const [selectedFields, setSelectedFields] = useState<Record<SearchCategory, FilterField>>({
    personagem: "nome",
    localizacao: "nome",
    episodio: "nome",
  });
  
  const selectedField = selectedFields[category];

   function setSelectedField(field: FilterField) {
    setSelectedFields((prev) => ({
      ...prev,
      [category]: field,
    }));
  }

  function setCategory(cat: SearchCategory, field?: FilterField) {
    setCategoryState(cat);
    if (field) {
      setSelectedFields((prev) => ({
        ...prev,
        [cat]: field,
      }));
    }
  }

  return (
    <SearchCategoryContext.Provider
      value={{
        category,
        setCategory,
        selectedField,
        setSelectedField,
        filtersForCategory: filtersByCategory[category],
      }}
    >
      {children}
    </SearchCategoryContext.Provider>
  );
};

export const useSearchCategory = () => {
  const context = useContext(SearchCategoryContext);
  if (!context) throw new Error("useSearchCategory must be used within SearchCategoryProvider");
  return context;
};