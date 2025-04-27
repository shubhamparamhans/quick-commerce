import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <Link className="text-white mr-4" to="/">Home</Link>
      <Link className="text-white mr-4" to="/products">Products</Link>
      <Link className="text-white mr-4" to="/cart">Cart</Link>
      <Link className="text-white" to="/login">Login</Link>
    </nav>
  );
};

export default Navbar;