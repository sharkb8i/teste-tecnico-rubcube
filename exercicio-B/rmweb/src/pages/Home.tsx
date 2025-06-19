import React, { useCallback, useEffect, useRef, useState } from "react";

import FilterBar from "../components/FilterBar";
import CharacterList from "../components/CharacterList";
import CharacterModal from "../components/CharacterModal";
import Spinner from "../components/Spinner";

import { useDebounce } from "../hooks/useDebounce";
import { useParsedFilter } from "../hooks/useParsedFilter";

import { useFetchCharacters, type Character, type ComplexFilter } from "../hooks/useFetchCharacters";
import { useFavorites } from "../contexts/FavoritesContext";
import { useSearchCategory } from "../contexts/SearchCategoryContext";

import { matchesCharacterSearch } from "../utils/matchesCharacterSearch";

const Home: React.FC = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<Character | null>(null);
  
  const {
    characters,
    loading,
    fetchCharactersPage,
    hasMore,
    searchByFilter,
    searchCharactersByFilter,
    resetCharacters
  } = useFetchCharacters();

  const { getFilteredFavorites, isFavoritesMode } = useFavorites();
  const debouncedFilter = useDebounce(filter, 500);
  const filteredFavorites = getFilteredFavorites(filter);
  const { category, selectedField } = useSearchCategory();
  const parseFilterStringToObject = useParsedFilter();

  const initialLoadRef = useRef(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastCharacterRef = useCallback((node: HTMLElement | null) => {
    if (loading || !hasMore || isFavoritesMode) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        if (initialLoadRef.current) {
          if (debouncedFilter.trim() === "") {
            fetchCharactersPage();
          } else {
            const filterObj = parseFilterStringToObject(debouncedFilter);
            searchCharactersByFilter(filterObj);
          }
        }
      }
    });

    if (node) observer.current.observe(node);
  }, [
    loading,
    hasMore,
    isFavoritesMode,
    fetchCharactersPage,
    searchCharactersByFilter,
    debouncedFilter
  ]);

  const handleClear = () => {
    resetCharacters();
    initialLoadRef.current = false;

    fetchCharactersPage().then(() => {
      initialLoadRef.current = true;
    });
  };

  const filteredCharacters = (isFavoritesMode ? filteredFavorites : characters).filter((char) => {
    const value = debouncedFilter.toLowerCase();

    if (!value) return true;

    if (category === "personagem") {
      return matchesCharacterSearch(char, value);
    }

    if (category === "localizacao") {
      return char.location.name.toLowerCase().includes(value);
    }

    if (category === "episodio") {
      return char.episode.some((ep) => ep.toLowerCase().includes(value));
    }

    return true;
  });

  useEffect(() => {
    let timeout: number;
    if (loading) setShowSpinner(true);
    else timeout = window.setTimeout(() => setShowSpinner(false), 250);
    return () => clearTimeout(timeout);
  }, [loading]);

  useEffect(() => {
    if (isFavoritesMode) return;

    if (debouncedFilter.trim() === "") {
      handleClear();
      return;
    }

    resetCharacters();

    const filterObj = parseFilterStringToObject(debouncedFilter);
    let complexFilter: ComplexFilter;
    
    switch (category) {
      case "personagem":
        complexFilter = {
          character: filterObj
        }
        break;
      case "localizacao":
        complexFilter = {
          location: filterObj
        }
        break;
      case "episodio":
        complexFilter = {
          episode: filterObj
        }
        break;
      default:
        complexFilter = {}
        break;
    }

    searchByFilter(complexFilter, category, selectedField);

    initialLoadRef.current = true;
  }, [debouncedFilter, isFavoritesMode, category]);

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-6">RMWeb | Ricky and Morty</h1>

      <div className="flex justify-center items-center gap-4 mb-6">
        <FilterBar
          filter={filter}
          onChange={setFilter}
          onClear={handleClear}
        />
      </div>

      {!loading &&
        (isFavoritesMode ? filteredFavorites.length === 0 : characters.length === 0) && (
          <p className="text-center text-gray-500 w-full text-center">Nenhum personagem encontrado.</p>
      )}

      <CharacterList
        characters={isFavoritesMode ? filteredCharacters : characters}
        onSelect={setSelected}
        lastCharacterRef={isFavoritesMode ? undefined : lastCharacterRef}
      />

      {showSpinner && !isFavoritesMode && <Spinner />}

      {selected && (
        <CharacterModal character={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
};

export default Home;