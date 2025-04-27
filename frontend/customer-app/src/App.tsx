import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import ProductListing from './pages/ProductListing';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import UserAuthentication from './pages/UserAuthentication';
import UserProfile from './pages/UserProfile';
import OrderHistory from './pages/OrderHistory';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route path="/" component={Homepage} exact />
        <Route path="/products" component={ProductListing} />
        <Route path="/cart" component={Cart} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/login" component={UserAuthentication} />
        <Route path="/profile" component={UserProfile} />
        <Route path="/order-history" component={OrderHistory} />
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;