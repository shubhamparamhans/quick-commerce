import React from 'react';

const ProductCard = ({ product }: { product: { id: number; name: string; price: number; image: string; } }) => {
  return (
    <div className="border rounded p-4 m-2">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <h2 className="text-lg">{product.name}</h2>
      <p>${product.price}</p>
      <button className="bg-blue-500 text-white p-2 rounded">Add to Cart</button>
    </div>
  );
};

export default ProductCard;
