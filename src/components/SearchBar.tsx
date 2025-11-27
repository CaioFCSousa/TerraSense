import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  defaultValue?: string;
}

export default function SearchBar({
  placeholder = 'Buscar...',
  onSearch,
  defaultValue = ''
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-3.5 text-stone-400" size={20} />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-11 pr-11 py-3 border border-stone-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 p-0.5 rounded-full hover:bg-stone-100 transition-colors"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
