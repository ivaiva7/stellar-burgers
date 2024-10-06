import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { addBun, addFilling } from '../../slices/ConstructorSlice';
import { TConstructorIngredient } from '@utils-types';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      const constructorIngredient: TConstructorIngredient = {
        ...ingredient,
        id: `${ingredient._id}-${Date.now()}`
      };

      if (ingredient.type === 'bun') {
        dispatch(addBun(constructorIngredient));
      } else {
        dispatch(addFilling(constructorIngredient));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
