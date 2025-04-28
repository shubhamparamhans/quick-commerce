import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import userReducer from './userSlice';
import wishlistReducer from './wishlistSlice';
import orderTrackingReducer from './orderTrackingSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    wishlist: wishlistReducer,
    orderTracking: orderTrackingReducer,
  },
});

export default store;
