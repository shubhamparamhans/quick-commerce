import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4" aria-label="Main Navigation">
      <Link className="text-white mr-4" to="/" aria-label="Go to Home">Home</Link>
      <Link className="text-white mr-4" to="/products" aria-label="View Products">Products</Link>
      <Link className="text-white mr-4" to="/cart" aria-label="View Cart">Cart</Link>
      <Link className="text-white mr-4" to="/wishlist" aria-label="View Wishlist">Wishlist</Link>
      <Link className="text-white mr-4" to="/order-history" aria-label="View Order History">Order History</Link>
      <Link className="text-white" to="/login" aria-label="Login or Register">Login</Link>
    </nav>
  );
};

export default Navbar;