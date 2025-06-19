import { useFavorites } from '../contexts/FavoritesContext';

interface Props {
  id: string;
  name: string;
}

export default function PokemonCard({ id, name }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <div className="relative bg-zinc-800 p-4 rounded shadow hover:shadow-lg transition cursor-pointer hover:bg-zinc-600">
      {isFavorite(name) && (
        <button
          onClick={e => {
            e.stopPropagation();
            e.preventDefault();
            toggleFavorite(name);
          }}
          aria-label={isFavorite(name) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          className={`absolute top-2 right-2 text-xl focus:outline-none ${
            isFavorite(name) ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
          }`}
        >
          ★
        </button>
      )}
      <img
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
        alt={name}
        className="w-20 h-20 mx-auto"
      />
      <p className="text-white text-center mt-2 capitalize font-semibold">{name}</p>
    </div>
  );
}