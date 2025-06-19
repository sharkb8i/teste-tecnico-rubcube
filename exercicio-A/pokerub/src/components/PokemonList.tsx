import { Link } from 'react-router-dom';

import PokemonCard from './PokemonCard';

import type { Pokemon } from '../hooks/useFetchPokemons';

interface Props {
  pokemons: Pokemon[];
  lastPokemonRef?: (node: HTMLDivElement | null) => void;
}

export default function PokemonList({ pokemons, lastPokemonRef }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {pokemons.map((pokemon, index) => {
        const isLast = index === pokemons.length - 1;
        return (
          <Link to={`/pokemon/${pokemon.name}`} key={pokemon.name}>
            <div ref={isLast ? lastPokemonRef : null}>
              <PokemonCard id={pokemon.id} name={pokemon.name} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}