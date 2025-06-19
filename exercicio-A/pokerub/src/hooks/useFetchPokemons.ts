/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from 'react';

export interface Pokemon {
  id: string;
  name: string;
  types: string[];
  abilities: string[];
  category: string;
  height: number;
  weight: number;
}

function getIdFromUrl(url: string) {
  const parts = url.split('/').filter(Boolean);
  return parts[parts.length - 1];
}

export function useFetchPokemons(pageSize = 16) {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchPokemonsPage = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${pageSize}&offset=${offset}`);
    const data = await res.json();

    const pokemonsDetailed = await Promise.all(
      data.results.map(async (p: { name: string; url: string }) => {
        const id = getIdFromUrl(p.url);

        const resDetail = await fetch(p.url);
        const detail = await resDetail.json();

        const resSpecies = await fetch(detail.species.url);
        const species = await resSpecies.json();

        const categoryEntry = species.genera.find((g: any) => g.language.name === 'en');

        return {
          id,
          name: p.name,
          types: detail.types.map((t: any) => t.type.name),
          abilities: detail.abilities.map((a: any) => a.ability.name),
          category: categoryEntry ? categoryEntry.genus : 'Unknown',
          height: detail.height,
          weight: detail.weight,
        };
      })
    );

    setPokemons(prev => [...prev, ...pokemonsDetailed]);
    setOffset(prev => prev + pageSize);
    setHasMore(data.next !== null);
    setLoading(false);
  }, [offset, loading, hasMore, pageSize]);

  useEffect(() => {
    fetchPokemonsPage();
  }, []);

  return { pokemons, loading, fetchPokemonsPage, hasMore };
}