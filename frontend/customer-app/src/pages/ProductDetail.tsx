import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const ProductDetail: React.FC = () => {
  const dispatch = useDispatch();
  const [selectedVariant, setSelectedVariant] = useState('');

  const product = {
    id: 1,
    name: 'Product 1',
    price: 29.99,
    variants: ['Small', 'Medium', 'Large'],
    image: 'link_to_image',
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      dispatch(addToCart({ 
        ...product, 
        variant: selectedVariant, 
        quantity: 1, 
        imageUrl: product.image 
      }));
      alert('Product added to cart!');
    } else {
      alert('Please select a variant.');
    }
  };

  return (
    <div className="p-5">
      <img src={product.image} alt={product.name} className="w-full h-64 object-cover mb-4" />
      <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
      <p className="text-lg mb-4">${product.price}</p>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Select Variant</label>
        <select
          value={selectedVariant}
          onChange={(e) => setSelectedVariant(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Select a variant</option>
          {product.variants.map((variant, index) => (
            <option key={index} value={variant}>{variant}</option>
          ))}
        </select>
      </div>
      <button
        onClick={handleAddToCart}
        className="bg-blue-500 text-white p-2 rounded w-full"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductDetail;