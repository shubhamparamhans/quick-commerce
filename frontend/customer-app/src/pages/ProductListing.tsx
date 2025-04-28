import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';

const ProductListing: React.FC = () => {
  const [filters, setFilters] = useState({
    price: '',
    category: '',
    rating: '',
  });

  const products = [
    { id: 1, name: 'Product 1', price: 29.99, category: 'Electronics', rating: 4, image: 'link_to_image' },
    { id: 2, name: 'Product 2', price: 39.99, category: 'Clothing', rating: 5, image: 'link_to_image' },
    { id: 3, name: 'Product 3', price: 49.99, category: 'Home', rating: 3, image: 'link_to_image' },
  ];

  const filteredProducts = products.filter(product => {
    return (
      (!filters.price || product.price <= parseFloat(filters.price)) &&
      (!filters.category || product.category === filters.category) &&
      (!filters.rating || product.rating >= parseInt(filters.rating))
    );
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
    <div className="p-5"></div>
      <h1 className="text-2xl font-bold mb-4">Product Listing</h1>
      <div className="mb-4 flex space-x-4">
        <select name="price" onChange={handleFilterChange} className="border p-2 rounded">
          <option value="">All Prices</option>
          <option value="30">Under $30</option>
          <option value="50">Under $50</option>
        </select>
        <select name="category" onChange={handleFilterChange} className="border p-2 rounded">
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
          <option value="Home">Home</option>
        </select>
        <select name="rating" onChange={handleFilterChange} className="border p-2 rounded">
          <option value="">All Ratings</option>
          <option value="3">3 Stars & Up</option>
          <option value="4">4 Stars & Up</option>
          <option value="5">5 Stars</option>
        </select>
      </div>
      <div className="flex flex-wrap">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductListing;
