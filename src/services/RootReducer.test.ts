jest.mock('./user/UserSlice', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    user: null,
    isAuthChecked: false,
    isLoading: false,
    error: null,
  }))
}));

import rootReducer from './RootReducer';
import ingredientsReducer from '../slices/IngredientSlice';
import feedReducer from '../slices/FeedSlice';
import userReducer from './user/UserSlice';
import constructorReducer from '../slices/ConstructorSlice';
import orderReducer from '../slices/OrderDetailsSlice';
import ordersReducer from '../slices/OrderSlice';

describe('rootReducer', () => {
  it('должен инициализировать состояние с правильным начальными значениями', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    expect(initialState).toEqual({
      ingredients: ingredientsReducer(undefined, { type: '@@INIT' }),
      feed: feedReducer(undefined, { type: '@@INIT' }),
      user: userReducer(undefined, { type: '@@INIT' }),
      constructorItems: constructorReducer(undefined, { type: '@@INIT' }),
      order: orderReducer(undefined, { type: '@@INIT' }),
      orders: ordersReducer(undefined, { type: '@@INIT' })
    });
  });
});
