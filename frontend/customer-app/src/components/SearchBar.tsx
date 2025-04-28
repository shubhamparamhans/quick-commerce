import React, { useState } from 'react';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const products = [
    'Product 1',
    'Product 2',
    'Product 3',
    'Product 4',
    'Product 5',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (value) {
      const filteredSuggestions = products.filter(product =>
        product.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="relative" role="search">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for products..."
        className="w-full border p-2 rounded"
        aria-label="Search for products"
        aria-autocomplete="list"
        aria-controls="search-suggestions"
      />
      {suggestions.length > 0 && (
        <ul
          id="search-suggestions"
          className="absolute bg-white border mt-1 w-full rounded shadow"
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              role="option"
              tabIndex={0}
              aria-selected="false"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;