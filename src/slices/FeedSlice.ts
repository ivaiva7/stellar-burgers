import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '@api';
import { TOrdersData } from '@utils-types';
import { RootState } from '../services/store';

interface OrdersState extends TOrdersData {
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

export const fetchOrders = createAsyncThunk<TOrdersData, void>(
  'orders/fetchOrders',
  async () => {
    const response = await getFeedsApi();
    return response;
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const selectFeedData = (state: RootState) => state.feed;
export default feedSlice.reducer;
