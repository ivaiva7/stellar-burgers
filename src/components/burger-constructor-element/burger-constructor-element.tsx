import { FC, memo } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { removeFilling, moveFilling } from '../../slices/ConstructorSlice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();
    const constructorItems = useSelector((state) => state.constructorItems);

    const handleMoveDown = () => {
      if (index < totalItems - 1 && ingredient.type !== 'bun') {
        dispatch(moveFilling({ index, direction: 'down' }));
      }
    };

    const handleMoveUp = () => {
      if (index > 0 && ingredient.type !== 'bun') {
        dispatch(moveFilling({ index, direction: 'up' }));
      }
    };

    const handleClose = () => {
      dispatch(removeFilling(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
