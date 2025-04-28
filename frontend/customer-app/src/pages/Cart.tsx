import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../redux/cartSlice';

const Cart: React.FC = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state: any) => state.cart);

  const handleRemove = (id: number) => {
    dispatch(removeFromCart({ id }));
  };

  const totalPrice = cart.reduce((total: number, item: any) => total + item.price, 0);

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          {cart.map((item: any) => (
            <div key={item.id} className="flex justify-between items-center border-b py-2">
              <div>
                <h2 className="text-lg font-bold">{item.name}</h2>
                <p>Variant: {item.variant}</p>
                <p>${item.price}</p>
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="text-right font-bold mt-4">
            Total: ${totalPrice.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;