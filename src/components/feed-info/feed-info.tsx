import { FC } from 'react';
import { useSelector } from '../../services/store';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '@ui';
import { selectFeedData } from '../../slices/FeedSlice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const feedData = useSelector(selectFeedData);
  const orders: TOrder[] = feedData.orders || [];

  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feedData}
    />
  );
};
