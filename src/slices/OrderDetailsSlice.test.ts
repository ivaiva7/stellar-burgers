import orderReducer, { fetchOrderByNumber } from './OrderDetailsSlice';

jest.mock('@api', () => ({
  getOrderByNumber: jest.fn()
}));

describe('orderSlice', () => {
  const initialState = {
    order: null,
    loading: false,
    error: null,
    ingredients: []
  };

  it('должен установить loading в true, когда fetchOrderByNumber в состоянии pending', () => {
    const action = { type: fetchOrderByNumber.pending.type };
    const state = orderReducer(initialState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обновить состояние с заказом и установить loading в false, когда fetchOrderByNumber выполнен успешно', () => {
    const mockOrder = {
      order: {
        _id: '6758a763e367de001daf8347',
        ingredients: ['1', '2'],
        status: 'done',
        name: 'Флюоресцентный бургер',
        createdAt: '2024-12-10T20:41:07.101Z',
        updatedAt: '2024-12-10T20:41:07.954Z',
        number: 62262
      },
      ingredients: ['1', '2']
    };
    const action = {
      type: fetchOrderByNumber.fulfilled.type,
      payload: mockOrder
    };
    const state = orderReducer(initialState, action);

    expect(state.order).toEqual(mockOrder.order);
    expect(state.ingredients).toEqual(mockOrder.ingredients);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('должен установить error и loading в false, когда fetchOrderByNumber отклонен', () => {
    const mockError = 'Ошибка при получении заказа';
    const action = {
      type: fetchOrderByNumber.rejected.type,
      payload: mockError
    };
    const state = orderReducer(initialState, action);

    expect(state.error).toBe(mockError);
    expect(state.loading).toBe(false);
  });
});
