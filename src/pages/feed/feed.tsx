import { useEffect } from 'react';
import { useDispatch, useSelector, RootState } from '../../services/store';
import { fetchOrders } from '../../slices/FeedSlice';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC } from 'react';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector(
    (state: RootState) => state.feed
  );

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) {
    return <Preloader />;
  }

  if (error) {
    return <div>Ошибка загрузки данных: {error}</div>;
  }

  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetchOrders())} />
  );
};
