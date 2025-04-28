import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Order {
  id: string;
  status: string;
  estimatedDelivery: string;
}

const orderTrackingSlice = createSlice({
  name: 'orderTracking',
  initialState: [] as Order[],
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.push(action.payload);
    },
    updateOrderStatus: (state, action: PayloadAction<{ id: string; status: string }>) => {
      const order = state.find(order => order.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
      }
    },
  },
});

export const { addOrder, updateOrderStatus } = orderTrackingSlice.actions;
export default orderTrackingSlice.reducer;