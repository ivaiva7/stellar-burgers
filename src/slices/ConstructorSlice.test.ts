import constructorReducer, {
  addFilling,
  removeFilling,
  moveFilling,
  clearConstructor
} from './ConstructorSlice';
import { TConstructorIngredient } from '@utils-types';

describe('constructorSlice', () => {
  const initialState = {
    bun: null,
    fillings: [
      {
        id: '1',
        name: 'Lettuce',
        type: 'vegetable',
        _id: '1',
        proteins: 1,
        fat: 0,
        carbohydrates: 3,
        calories: 15,
        price: 10,
        image: '',
        image_large: '',
        image_mobile: ''
      },
      {
        id: '2',
        name: 'Cheese',
        type: 'dairy',
        _id: '2',
        proteins: 5,
        fat: 7,
        carbohydrates: 1,
        calories: 100,
        price: 50,
        image: '',
        image_large: '',
        image_mobile: ''
      }
    ],
    orderRequest: false,
    orderModalData: null,
    isLoading: false
  };

  it('должен добавлять начинку', () => {
    const newFilling: TConstructorIngredient = {
      id: '3',
      name: 'Tomato',
      type: 'vegetable',
      _id: '3',
      proteins: 1,
      fat: 0,
      carbohydrates: 4,
      calories: 20,
      price: 15,
      image: '',
      image_large: '',
      image_mobile: ''
    };

    const nextState = constructorReducer(initialState, addFilling(newFilling));

    expect(nextState.fillings).toHaveLength(3);
    expect(nextState.fillings).toContainEqual(newFilling);
  });

  it('должен удалять начинку', () => {
    const fillingIdToRemove = '1';

    const nextState = constructorReducer(
      initialState,
      removeFilling(fillingIdToRemove)
    );

    expect(nextState.fillings).toHaveLength(1);
    expect(nextState.fillings).not.toContainEqual({
      id: '1',
      name: 'Lettuce',
      type: 'vegetable',
      _id: '1',
      proteins: 1,
      fat: 0,
      carbohydrates: 3,
      calories: 15,
      price: 10,
      image: '',
      image_large: '',
      image_mobile: ''
    });
  });

  it('должен перемещать начинку вверх', () => {
    const nextState = constructorReducer(
      initialState,
      moveFilling({ index: 1, direction: 'up' })
    );

    expect(nextState.fillings[0].id).toBe('2');
    expect(nextState.fillings[1].id).toBe('1');
  });

  it('должен перемещать начинку вниз', () => {
    const nextState = constructorReducer(
      initialState,
      moveFilling({ index: 0, direction: 'down' })
    );

    expect(nextState.fillings[0].id).toBe('2');
    expect(nextState.fillings[1].id).toBe('1');
  });

  it('должен очищать конструктор', () => {
    const nextState = constructorReducer(initialState, clearConstructor());

    expect(nextState.bun).toBeNull();
    expect(nextState.fillings).toHaveLength(0);
  });
});
