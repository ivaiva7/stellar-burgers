import { FC, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  fetchOrderByNumber,
  chooseOrder,
  getIngredientsForOrder
} from '../../slices/OrderDetailsSlice';
import { TIngredient } from '@utils-types';
import { useParams } from 'react-router-dom';
import { OrderInfoUI } from '../ui/order-info';
import { Preloader } from '../ui/preloader';
import { RootState } from '../../services/store';

interface OrderInfoProps {}

export const OrderInfo: FC<OrderInfoProps> = () => {
  const { number } = useParams();
  const orderNumber = number ? Number(number) : null;
  const dispatch = useDispatch();

  const { order, loading } = useSelector(chooseOrder);

  useEffect(() => {
    if (orderNumber != null) {
      dispatch(fetchOrderByNumber(orderNumber));
    }
  }, [dispatch]);

  const ingredients: TIngredient[] = useSelector((state: RootState) =>
    order ? getIngredientsForOrder(order)(state) : []
  );

  const orderInfo = useMemo(() => {
    if (!order) return null;
    if (!ingredients.length) return null;

    const ingredientsInfo = order.ingredients.reduce<{
      [key: string]: TIngredient & { count: number };
    }>((acc, item) => {
      const ingredient = ingredients.find((ing) => ing._id === item);
      if (ingredient) {
        if (acc[item]) {
          acc[item].count++;
        } else {
          acc[item] = { ...ingredient, count: 1 };
        }
      }
      return acc;
    }, {});

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );
    const date = new Date(order.createdAt);

    return {
      ...order,
      ingredientsInfo,
      total,
      date
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
