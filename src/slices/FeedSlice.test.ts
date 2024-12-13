import feedReducer, { fetchOrders } from './FeedSlice';
import { TOrdersData } from '@utils-types';
jest.mock('@api', () => ({
  gerFeedsApi: jest.fn()
}));

describe('feedSlice', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    loading: false,
    error: null
  };

  it('должен установить loading в true, когда getFeed в состоянии pending', () => {
    const action = { type: fetchOrders.pending.type };
    const state = feedReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обновить состояние с feed и установить loading в false, когда fetchIngredients выполнен успешно', () => {
    const mockFeed: TOrdersData = {
      orders: [
        {
          _id: '6758a763e367de001daf8347',
          ingredients: ['643d69a5c3f7b9001cfa093d', '643d69a5c3f7b9001cfa093d'],
          status: 'done',
          name: 'Флюоресцентный бургер',
          createdAt: '2024-12-10T20:41:07.101Z',
          updatedAt: '2024-12-10T20:41:07.954Z',
          number: 62262
        },
        {
          _id: '6758a25be367de001daf8331',
          ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0943'],
          status: 'done',
          name: 'Краторный space бургер',
          createdAt: '2024-12-10T20:19:39.624Z',
          updatedAt: '2024-12-10T20:19:40.532Z',
          number: 62261
        }
      ],
      total: 61888,
      totalToday: 163
    };
    const action = {
      type: fetchOrders.fulfilled.type,
      payload: mockFeed
    };
    const state = feedReducer(initialState, action);

    expect(state.orders).toEqual(mockFeed.orders);
    expect(state.total).toEqual(mockFeed.total);
    expect(state.totalToday).toEqual(mockFeed.totalToday);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('должен установить error и loading в false, когда getFeed отклонен', () => {
    const mockError = 'Ошибка при получении ингредиентов';
    const action = { type: fetchOrders.rejected.type, payload: mockError };
    const state = feedReducer(initialState, action);

    expect(state.error).toBe(mockError);
    expect(state.loading).toBe(false);
  });
});

