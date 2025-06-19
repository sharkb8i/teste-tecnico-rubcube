/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback, useRef } from "react";
import { filtersByCategory, type FilterField, type SearchCategory } from "../contexts/SearchCategoryContext";

export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  gender: string;
  location: { name: string };
  episode: string[];
  image: string;
}

export interface Location {
  name: string;
  type: string;
  dimension: string;
}

export interface Episode {
  name: string;
  episode: string;  // S03E07
}

export interface CharacterFilter {
  name?: string;
  status?: string;
  species?: string;
  gender?: string;
}

export interface LocationFilter {
  name?: string;
  type?: string;
  dimension?: string;
}

export interface EpisodeFilter {
  name?: string;
  episode?: string;
}

export interface ComplexFilter {
  character?: CharacterFilter;
  location?: LocationFilter;
  episode?: EpisodeFilter;
}

export function useFetchCharacters() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(false);

  const fetchingRef = useRef(false);
  const pageRef = useRef(1);
  const searchPageRef = useRef(1);
  const currentFilterRef = useRef("");
  
  const fetchCharactersPage = useCallback(async () => {
    if (fetchingRef.current || !hasMore) return;
    fetchingRef.current = true;
    setLoading(true);
    setError(false);

    try {
      if (currentFilterRef.current !== "") {
        setLoading(false);
        fetchingRef.current = false;
        return;
      }

      const currentPage = pageRef.current;
      const ids = [];
      const startId = (currentPage - 1) * 8 + 1;
      const endId = currentPage * 8;
      for (let i = startId; i <= endId; i++) {
        ids.push(i);
      }

      const url = `https://rickandmortyapi.com/api/character/${ids.join(",")}`;

      const res = await fetch(url);
      if (!res.ok) {
        setHasMore(false);
        setLoading(false);
        fetchingRef.current = false;
        return;
      }

      const data = await res.json();
      const newCharacters = Array.isArray(data) ? data : [data];

      setCharacters((prev) => [...prev, ...newCharacters]);
      pageRef.current = currentPage + 1;

      setHasMore(newCharacters.length === 8);
    } catch {
      setError(true);
      setHasMore(false);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
    return;
  }, [hasMore]);

  const fetchCharactersByIds = async (ids: string[]): Promise<Character[]> => {
    const batchSize = 20;
    const results: Character[] = [];

    for (let i = 0; i < ids.length; i += batchSize) {
      const batch = ids.slice(i, i + batchSize);
      const res = await fetch(`https://rickandmortyapi.com/api/character/${batch.join(",")}`);
      if (!res.ok) continue;
      const data = await res.json();
      results.push(...(Array.isArray(data) ? data : [data]));
    }

    return results;
  };

  const searchCharactersByFilter = useCallback(async (filter: CharacterFilter) => {
    if (fetchingRef.current) return;

    const queryParams = new URLSearchParams();

    Object.entries(filter).forEach(([key, value]) => {
      if (value && value.trim() !== "") {
        queryParams.append(key, value.trim());
      }
    });

    const filterString = queryParams.toString();
    if (currentFilterRef.current !== filterString) {
      setCharacters([]);
      setHasMore(true);
      searchPageRef.current = 1;
      currentFilterRef.current = filterString;
    }

    fetchingRef.current = true;
    setLoading(true);
    setError(false);

    try {
      const page = searchPageRef.current;
      const url = `https://rickandmortyapi.com/api/character/?${filterString}&page=${page}`;
      const res = await fetch(url);

      if (!res.ok) {
        setCharacters([]);
        setHasMore(false);
        return;
      }

      const data = await res.json();
      const newCharacters = data.results || [];

      setCharacters((prev) => [...prev, ...newCharacters]);
      searchPageRef.current = page + 1;
      setHasMore(!!data.info?.next);
    } catch {
      setError(true);
      setCharacters([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [hasMore]);

  const searchByFilter = useCallback(async (filter: ComplexFilter, category: SearchCategory, field: FilterField) => {
    if (fetchingRef.current) return;

    if (!filtersByCategory[category].includes(field)) {
      throw new Error(`O campo '${field}' não é válido para a categoria '${category}'`);
    }

    const queryParams = new URLSearchParams();

    Object.entries(filter).forEach(([_, categoryFilter]) => {
      if (categoryFilter && typeof categoryFilter === "object") {
        const [[key, value]] = Object.entries(categoryFilter);
        if (typeof value === "string" && value.trim() !== "") {
          queryParams.append(key, value.trim());
        }
      }
    });

    const filterString = queryParams.toString();

    if (currentFilterRef.current !== filterString) {
      setCharacters([]);
      setHasMore(true);
      searchPageRef.current = 1;
      currentFilterRef.current = filterString;
    }

    fetchingRef.current = true;
    setLoading(true);
    setError(false);
    
    try {
      const page = searchPageRef.current;
      
      let url = "";
      if (category === "personagem") {
        url = `https://rickandmortyapi.com/api/character/?${filterString}&page=${page}`;
      } else if (category === "localizacao") {
        url = `https://rickandmortyapi.com/api/location/?${filterString}&page=${page}`;
      } else if (category === "episodio") {
        url = `https://rickandmortyapi.com/api/episode/?${filterString}&page=${page}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        setCharacters([]);
        setHasMore(false);
        return;
      }

      const data = await res.json();
      const newResults = data.results || [];
      
      if (category === "personagem") {
        setCharacters((prev) => [...prev, ...newResults]);
      } else {
        const characterUrls = newResults.flatMap((item: any) =>
          category === "localizacao" ? item.residents : item.characters
        );

        const ids = characterUrls
          .map((url: string) => url.split("/").pop())
          .filter((id: any): id is string => typeof id === "string");

        const uniqueIds = Array.from(new Set<string>(ids));
        
        const fetchedCharacters = await fetchCharactersByIds(uniqueIds);
        setCharacters((prev) => [...prev, ...fetchedCharacters]);
      }

      searchPageRef.current = page + 1;
      setHasMore(!!data.info?.next);
    } catch (err) {
      setCharacters([]);
      setHasMore(false);
      setError(true);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [hasMore]);

  const resetCharacters = () => {
    setCharacters([]);
    setHasMore(true);
    setError(false);
    fetchingRef.current = false;
    pageRef.current = 1;
    searchPageRef.current = 1;
    currentFilterRef.current = "";
  }

  return { characters, loading, hasMore, error, fetchCharactersPage, searchByFilter, searchCharactersByFilter, resetCharacters };
}