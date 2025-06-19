interface Props {
  value: string;
  onChange: (val: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <input
      type="text"
      placeholder="Buscar por nome, tipo, habilidade, categoria ou altura/peso (ex: altura>10 ou categoria=lizard)"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded mb-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />
  );
}