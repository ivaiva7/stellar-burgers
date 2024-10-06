import { RootState } from '../services/store';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi, TOrderResponse } from '@api';
import { TOrder, TIngredient } from '@utils-types';

interface OrdersState {
  order: TOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  order: null,
  loading: false,
  error: null
};

export const fetchOrderByNumber = createAsyncThunk<
  { order: TOrder; ingredients: TIngredient[] },
  number,
  { state: RootState }
>(
  'orders/fetchOrderByNumber',
  async (orderNumber, { getState, rejectWithValue }) => {
    const response: TOrderResponse = await getOrderByNumberApi(orderNumber);

    if (response.orders && response.orders.length > 0) {
      const order = response.orders[0];

      const ingredientsState = getState().ingredients.ingredients;

      const ingredients = order.ingredients
        .map((id) =>
          ingredientsState.find((ingredient) => ingredient._id === id)
        )
        .filter(Boolean) as TIngredient[];

      return {
        order,
        ingredients
      };
    }
    return rejectWithValue('Заказ не найден');
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.order = action.payload.order;
        state.loading = false;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.error =
          (action.payload as string) || 'Ошибка при загрузке заказа';
        state.loading = false;
      });
  }
});

export const chooseOrder = (state: RootState) => state.order;
export default orderSlice.reducer;
