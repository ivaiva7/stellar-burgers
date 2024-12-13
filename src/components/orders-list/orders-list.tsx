import { FC, memo } from 'react';

import { OrdersListProps } from './type';
import { OrdersListUI } from '@ui';
import { TOrder } from '@utils-types';

export const OrdersList: FC<OrdersListProps> = memo(({ orders }) => {
  const orderByDate = Array.isArray(orders)
    ? [...orders].sort(
        (a: TOrder, b: TOrder) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  return <OrdersListUI orderByDate={orderByDate} />;
});
