import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import EvolutionChain, { type EvoPreview } from '../components/EvolutionChain';
import { Tag } from '../components/Tag';

import { useFavorites } from '../contexts/FavoritesContext';

interface Ability {
  ability: { name: string };
}

interface Type {
  type: { name: string };
}

interface PokemonDetailData {
  name: string;
  height: number;
  weight: number;
  abilities: Ability[];
  types: Type[];
  species: { url: string };
  sprites: { front_default: string | null };
}

interface EvolutionNode {
  species: { name: string };
  evolves_to: EvolutionNode[];
}

export default function PokemonDetail() {
  const { name } = useParams<{ name: string }>();
  const [pokemon, setPokemon] = useState<PokemonDetailData | null>(null);
  const [evolution, setEvolution] = useState<EvoPreview[]>([]);

  // const [favorites, setFavorites] = useState<string[]>(() => {
  //   return JSON.parse(localStorage.getItem('favorites') || '[]');
  // });

  const { isFavorite, toggleFavorite } = useFavorites();

  // const toggleFavorite = (name: string) => {
  //   const updated = favorites.includes(name)
  //     ? favorites.filter(n => n !== name)
  //     : [...favorites, name];
  //   setFavorites(updated);
  //   localStorage.setItem('favorites', JSON.stringify(updated));
  // };

  const typeIcons: Record<string, string> = {
    fire: '🔥',
    water: '💧',
    grass: '🌿',
    electric: '⚡',
    bug: '🐛',
    normal: '📦',
    poison: '☠️',
    ground: '🌍',
    rock: '🪨',
    psychic: '🔮',
    ghost: '👻',
    fighting: '🥊',
    ice: '❄️',
    dragon: '🐉',
    dark: '🌑',
    steel: '⚙️',
    fairy: '🧚',
    flying: '🌬️',
  };

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then(res => res.json())
      .then(data => {
        setPokemon(data);
        return fetch(data.species.url);
      })
      .then(res => res.json())
      .then(species => fetch(species.evolution_chain.url))
      .then(res => res.json())
      .then(async evo => {
        const chain = [] as string[];
        let node: EvolutionNode | null = evo.chain;
        while (node) {
          chain.push(node.species.name);
          node = node.evolves_to[0] || null;
        }

        const evoData = await Promise.all(
          chain.map(async evoName => {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${evoName}`);
            const data = await res.json();
            return {
              name: data.name,
              image: data.sprites.front_default,
            };
          })
        );

        setEvolution(evoData);
      });
  }, [name]);

  if (!pokemon) return <div className="p-4">Carregando...</div>;

  return (
    <div className="min-h-screen bg-neutral-900 p-6 relative">    
      <div className="w-full max-w-5xl mx-auto bg-neutral-800 rounded shadow p-6 space-y-4">
        <Link 
          to="/" 
          className="z-50 text-white underline rounded shadow no-underline"
        >
          ⮜ Voltar
        </Link>
        
        <div className="flex flex-col justify-between items-center">
          {pokemon.sprites.front_default && (
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-32 h-32 object-contain mb-4 mx-auto"
            />
          )}
          <h2 className="text-2xl font-bold capitalize">{pokemon.name}</h2>
          <button
            onClick={() => toggleFavorite(pokemon.name)}
            className={`flex justify-center mt-2 bg-neutral-800 border transition hover:border-[#333] hover:bg-[#333] text-2xl transition ${isFavorite(pokemon.name) ? 'text-yellow-500' : 'text-gray-400'}`}
          >
            ★
          </button>
        </div>
        <p><strong>Altura:</strong> {pokemon.height}</p>
        <p><strong>Peso:</strong> {pokemon.weight}</p>
        <div>
          <strong>Tipos</strong>
          <div className="flex flex-wrap gap-2 mt-1">
            {pokemon.types.map(t => (
              <Tag
                key={t.type.name}
                label={t.type.name}
                icon={typeIcons[t.type.name] || '❓'}
                // icon={<img src="/icons/fire.svg" alt="fire" className="w-4 h-4" />}
                className="mr-2"
              />
            ))}
          </div>
        </div>
        <div>
          <strong>Habilidades</strong>
          <div className="flex flex-wrap gap-2 mt-1">
            {pokemon.abilities.map(a => (
              <Tag key={a.ability.name} label={a.ability.name} className="mr-2" />
            ))}
          </div>
        </div>

        <EvolutionChain evolution={evolution} currentName={name || ''} />
      </div>
    </div>
  );
}