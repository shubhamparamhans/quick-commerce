import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Wishlist from './pages/Wishlist';
import SearchBar from './components/SearchBar';

const Homepage = lazy(() => import('./pages/Homepage'));
const ProductListing = lazy(() => import('./pages/ProductListing'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const UserAuthentication = lazy(() => import('./pages/UserAuthentication'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <SearchBar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<UserAuthentication />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
};

export default App;