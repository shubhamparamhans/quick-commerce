import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const Wishlist: React.FC = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state: any) => state.wishlist);

  const handleAddToCart = (item: any) => {
    dispatch(addToCart(item));
    alert('Item added to cart!');
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Wishlist</h1>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="space-y-4">
          {wishlist.map((item: any) => (
            <div key={item.id} className="border p-4 rounded flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">{item.name}</h2>
                <p>${item.price}</p>
              </div>
              <button
                onClick={() => handleAddToCart(item)}
                className="bg-blue-500 text-white p-2 rounded"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;