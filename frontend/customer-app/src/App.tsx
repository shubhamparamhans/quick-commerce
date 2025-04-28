import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
// import Homepage from './pages/Homepage';

const Homepage = lazy(() => import('./pages/Homepage'));
const ProductListing = lazy(() => import('./pages/ProductListing'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const UserAuthentication = lazy(() => import('./pages/UserAuthentication'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<UserAuthentication />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/order-history" element={<OrderHistory />} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
};

export default App;