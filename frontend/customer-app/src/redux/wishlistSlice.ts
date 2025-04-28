import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: [] as WishlistItem[],
  reducers: {
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      state.push(action.payload);
    },
    removeFromWishlist: (state, action: PayloadAction<{ id: number }>) => {
      return state.filter(item => item.id !== action.payload.id);
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;