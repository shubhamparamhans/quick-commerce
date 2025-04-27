import React from 'react';
import ProductCard from '../components/ProductCard';

const Homepage: React.FC = () => {
  const products = [
    { id: 1, name: 'Product 1', price: 29.99, image: 'link_to_image' },
    { id: 2, name: 'Product 2', price: 39.99, image: 'link_to_image' },
  ];

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Featured Products</h1>
      <div className="flex flex-wrap">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Homepage;
