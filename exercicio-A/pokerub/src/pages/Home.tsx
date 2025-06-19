/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef, useState } from 'react';

import PokemonList from '../components/PokemonList';
import SearchBar from '../components/SearchBar';
import Spinner from '../components/Spinner';

import { useFetchPokemons } from '../hooks/useFetchPokemons';

export default function Home() {
  const [search, setSearch] = useState('');
  const [showSpinner, setShowSpinner] = useState(false);
  const { pokemons, loading, fetchPokemonsPage, hasMore } = useFetchPokemons(20);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPokemonRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          fetchPokemonsPage();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchPokemonsPage]
  );

  const filtered = pokemons.filter(p => matchesAdvancedSearch(p, search));

  function matchesAdvancedSearch(pokemon: any, search: string): boolean {
    search = search.toLowerCase().trim();

    const advancedFilter = /^(peso|altura|categoria|nome|tipo|habilidade)([><=])(.+)$/;
    const fieldMap = {
      peso: 'weight',
      altura: 'height',
      categoria: 'category',
      nome: 'name',
      tipo: 'types',
      habilidade: 'abilities',
    };

    if (advancedFilter.test(search)) {
      const [, searchFieldRaw, operator, valueStrRaw] = search.match(advancedFilter)!;
      const searchField = searchFieldRaw as keyof typeof fieldMap;
      const field = fieldMap[searchField];
      const valueStr = valueStrRaw.trim();

      if (searchField === 'peso' || searchField === 'altura') {
        const value = Number(valueStr);
        const pokeValue = pokemon[field];
        switch (operator) {
          case '>': return pokeValue > value;
          case '<': return pokeValue < value;
          case '=': return pokeValue === value;
        }
      } else {
        if (operator !== '=') return false;

        if (Array.isArray(pokemon[field])) {
          return pokemon[field].some((item: string) =>
            item.toLowerCase().includes(valueStr)
          );
        } else if (typeof pokemon[field] === 'string') {
          return pokemon[field].toLowerCase().includes(valueStr);
        }
      }

      return false;
    }
    
    return [pokemon.name, ...pokemon.types, ...pokemon.abilities, pokemon.category]
      .some((val: string) => val.toLowerCase().includes(search));
  }

  useEffect(() => {
    let timeout: number;

    if (loading) {
      setShowSpinner(true);
    } else {
      timeout = setTimeout(() => setShowSpinner(false), 250);
    }

    return () => clearTimeout(timeout);
  }, [loading]);

  return (
    <div className="min-h-screen bg-neutral-900">
      <main className="max-w-4xl mx-auto py-10 px-4 relative">
        <h1 className="text-3xl font-bold mb-6">PokeRub</h1>
        <SearchBar value={search} onChange={setSearch} />
        <PokemonList pokemons={filtered} lastPokemonRef={lastPokemonRef} />
        {showSpinner && <Spinner />}
      </main>
    </div>
  );
}