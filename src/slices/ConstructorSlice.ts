import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';
import { orderBurgerApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../services/store';

interface ConstructorState {
  bun: TConstructorIngredient | null;
  fillings: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: null | any;
  isLoading: boolean;
}

const initialState: ConstructorState = {
  bun: null,
  fillings: [],
  orderRequest: false,
  orderModalData: null,
  isLoading: false
};

export const orderBurger = createAsyncThunk(
  'constructor/orderBurger',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response.order;
  }
);

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addBun(state, action: PayloadAction<TConstructorIngredient>) {
      state.bun = action.payload;
    },
    addFilling(state, action: PayloadAction<TConstructorIngredient>) {
      state.fillings.push(action.payload);
    },
    removeFilling(state, action: PayloadAction<string>) {
      state.fillings = state.fillings.filter(
        (filling) => filling.id !== action.payload
      );
    },
    clearConstructor(state) {
      state.bun = null;
      state.fillings = [];
    },
    moveFilling(
      state,
      action: PayloadAction<{ index: number; direction: 'up' | 'down' }>
    ) {
      const { index, direction } = action.payload;

      if (direction === 'up' && index > 0) {
        const fillings = [...state.fillings];
        const [movedFilling] = fillings.splice(index, 1);
        fillings.splice(index - 1, 0, movedFilling);
        state.fillings = fillings;
      }

      if (direction === 'down' && index < state.fillings.length - 1) {
        const fillings = [...state.fillings];
        const [movedFilling] = fillings.splice(index, 1);
        fillings.splice(index + 1, 0, movedFilling);
        state.fillings = fillings;
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    clearOrderModalData(state) {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.bun = null;
        state.fillings = [];
      })
      .addCase(orderBurger.rejected, (state) => {
        state.orderRequest = false;
        state.orderModalData = null;
      });
  }
});

export const selectOrderModalData = (state: RootState) =>
  state.constructorItems.orderModalData;

export const {
  addBun,
  addFilling,
  removeFilling,
  clearConstructor,
  moveFilling,
  setLoading,
  clearOrderModalData
} = constructorSlice.actions;

export default constructorSlice.reducer;
