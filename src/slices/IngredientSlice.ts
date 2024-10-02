import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';
import { RootState } from '../services/store';

interface IngredientsState {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getIngredientsApi();
      return data;
    } catch (err) {
      return rejectWithValue('Ошибка при загрузке ингредиентов');
    }
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    updateIngredients(state, action) {
      state.ingredients = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.loading = false;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  }
});

export const selectIngredientById = (state: RootState, id: string) =>
  state.ingredients.ingredients.find((ingredient) => ingredient._id === id);

export const selectAllIngredients = (state: RootState) =>
  state.ingredients.ingredients;

export const { updateIngredients } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;
