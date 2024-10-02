import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import {
  fetchOrderByNumber,
  chooseOrder
} from '../../slices/OrderDetailsSlice';
import { selectAllIngredients } from '../../slices/IngredientSlice';
import { RootState } from '../../services/store';

interface OrderInfoProps {
  orderNumber: number | null;
}

export const OrderInfo: FC<OrderInfoProps> = ({ orderNumber }) => {
  const dispatch = useDispatch();
  const { order, loading, error } = useSelector((state: RootState) =>
    chooseOrder(state)
  );
  const ingredients: TIngredient[] = useSelector(selectAllIngredients);

  useEffect(() => {
    if (orderNumber != null) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch, orderNumber]);

  const orderInfo = useMemo(() => {
    if (!order || !ingredients.length) return null;

    const date = new Date(order.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = order.ingredients.reduce<TIngredientsWithCount>(
      (acc, item) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) {
          if (!acc[item]) {
            acc[item] = { ...ingredient, count: 1 };
          } else {
            acc[item].count++;
          }
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ingredientsInfo,
      date,
      total,
      ...order
    };
  }, [order, ingredients]);

  if (loading) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
