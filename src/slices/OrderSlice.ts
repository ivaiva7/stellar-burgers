import { RootState } from '../services/store';
import {
  createSlice,
  createAsyncThunk,
  createSelector
} from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder, TIngredient } from '@utils-types';

interface OrdersState {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  loading: false,
  error: null
};

export const fetchOrders = createAsyncThunk<TOrder[], void>(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    const orders = await getOrdersApi();
    return orders;
  }
);

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.error =
          (action.payload as string) || 'Ошибка при загрузке заказов';
        state.loading = false;
      });
  }
});

export const selectOrderById = (state: RootState, id: string | undefined) =>
  state.orders.orders.find((order) => order._id === id);

export const selectIngredientsByOrder = createSelector(
  (state: RootState, order: TOrder) => state.ingredients.ingredients,
  (_, order: TOrder) => order.ingredients,
  (allIngredients: TIngredient[], orderIngredients: string[]) =>
    allIngredients.filter((ingredient) =>
      orderIngredients.includes(ingredient._id)
    )
);
export const selectOrders = (state: RootState) => state.orders.orders;
export default ordersSlice.reducer;
