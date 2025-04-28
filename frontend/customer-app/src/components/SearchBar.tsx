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
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Search for products..."
        className="w-full border p-2 rounded"
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border mt-1 w-full rounded shadow">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="p-2 hover:bg-gray-100 cursor-pointer">
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;