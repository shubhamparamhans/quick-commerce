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
        <div className="p-5 flex flex-col space-y-4 md:space-y-0 md:space-x-4 md:flex-row">
          <div className="w-full md:w-2/3">
            {cart.map((item: any) => (
              <div key={item.id} className="flex flex-col md:flex-row justify-between items-center border-b py-2">
                <div className="text-center md:text-left">
                  <h2 className="text-lg font-bold">{item.name}</h2>
                  <p>Variant: {item.variant}</p>
                  <p>${item.price}</p>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="bg-red-500 text-white p-2 rounded mt-2 md:mt-0"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="w-full md:w-1/3 text-right font-bold">
            <p>Total: ${totalPrice.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;