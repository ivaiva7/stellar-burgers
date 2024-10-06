import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { selectIngredientById } from '../../slices/IngredientSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();

  const ingredientData = useSelector((state: RootState) =>
    selectIngredientById(state, id!)
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
