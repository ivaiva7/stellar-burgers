import ordersReducer, { fetchOrders } from './OrderSlice';

jest.mock('@api', () => ({
  getOrdersApi: jest.fn()
}));

describe('orderSlice', () => {
  const initialState = {
    orders: [],
    loading: false,
    error: null
  };

  it('должен установить loading в true, когда fetchOrders находится в ожидании', () => {
    const action = { type: fetchOrders.pending.type };
    const state = ordersReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обновить состояние заказами и установить loading в false, когда fetchOrders выполнен успешно', () => {
    const mockOrders = [
      {
        _id: '6758a763e367de001daf8347',
        ingredients: ['1', '2'],
        status: 'done',
        name: 'Флюоресцентный бургер',
        createdAt: '2024-12-10T20:41:07.101Z',
        updatedAt: '2024-12-10T20:41:07.954Z',
        number: 62262
      },
      {
        _id: '6758a25be367de001daf8331',
        ingredients: ['3', '4'],
        status: 'done',
        name: 'Краторный space бургер',
        createdAt: '2024-12-10T20:19:39.624Z',
        updatedAt: '2024-12-10T20:19:40.532Z',
        number: 62261
      }
    ];
    const action = {
      type: fetchOrders.fulfilled.type,
      payload: mockOrders
    };
    const state = ordersReducer(initialState, action);

    expect(state.orders).toEqual(mockOrders);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('должен установить error и loading в false, когда fetchOrders отклонен', () => {
    const mockError = 'Ошибка при получении заказа';
    const action = {
      type: fetchOrders.rejected.type,
      payload: mockError
    };
    const state = ordersReducer(initialState, action);

    expect(state.error).toBe(mockError);
    expect(state.loading).toBe(false);
  });
});
