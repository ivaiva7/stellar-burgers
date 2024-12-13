import ingredientsReducer, {
  fetchIngredients,
  updateIngredients
} from './IngredientSlice';
import { TIngredient } from '@utils-types';

jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null
  };

  it('должен установить loading в true, когда fetchIngredients в состоянии pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обновить состояние с ингредиентами и установить loading в false, когда fetchIngredients выполнен успешно', () => {
    const mockIngredients: TIngredient[] = [
      {
        _id: '1',
        name: 'Lettuce',
        type: 'vegetable',
        proteins: 1,
        fat: 0,
        carbohydrates: 3,
        calories: 15,
        price: 10,
        image: '',
        image_large: '',
        image_mobile: ''
      }
    ];
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(initialState, action);

    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('должен установить error и loading в false, когда fetchIngredients отклонен', () => {
    const mockError = 'Ошибка при получении ингредиентов';
    const action = { type: fetchIngredients.rejected.type, payload: mockError };
    const state = ingredientsReducer(initialState, action);

    expect(state.error).toBe(mockError);
    expect(state.loading).toBe(false);
  });

  it('должен обновить состояние ингредиентов с действием updateIngredients', () => {
    const newIngredients: TIngredient[] = [
      {
        _id: '2',
        name: 'Cheese',
        type: 'dairy',
        proteins: 5,
        fat: 7,
        carbohydrates: 1,
        calories: 100,
        price: 50,
        image: '',
        image_large: '',
        image_mobile: ''
      }
    ];
    const action = updateIngredients(newIngredients);
    const state = ingredientsReducer(initialState, action);

    expect(state.ingredients).toEqual(newIngredients);
  });
});
