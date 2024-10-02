import { FC, useMemo, useState, useRef } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  orderBurger,
  clearOrderModalData
} from '../../slices/ConstructorSlice';
import { selectIsAuthenticated } from '../../services/user/UserSlice';
import { Preloader } from '@ui';
import { RootState } from '../../services/store';
import { OrderDetailsUI } from '@ui';
import { useNavigate } from 'react-router-dom';
import { useClose } from '../../useClose';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(
    (state: RootState) => state.constructorItems
  );
  const orderRequest = useSelector(
    (state: RootState) => state.constructorItems.orderRequest
  );
  const orderModalData = useSelector(
    (state: RootState) => state.constructorItems.orderModalData
  );
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const dispatch = useDispatch();
  const modalRef = useRef<HTMLDivElement>(null);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest || !isAuthenticated) return;

    const ingredients = [
      constructorItems.bun._id,
      ...constructorItems.fillings.map((filling) => filling._id)
    ];

    setIsLoading(true);

    dispatch(orderBurger(ingredients))
      .unwrap()
      .then((response) => {
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.fillings.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  const closeOrderModal = () => {
    dispatch(clearOrderModalData());
  };

  useClose({
    isOpen: !!orderModalData,
    onClose: closeOrderModal,
    rootRef: modalRef
  });

  return (
    <>
      {isLoading && <Preloader />}
      <BurgerConstructorUI
        price={price}
        orderRequest={orderRequest}
        constructorItems={constructorItems}
        orderModalData={orderModalData}
        onOrderClick={onOrderClick}
        closeOrderModal={closeOrderModal}
      />
      {orderModalData?.number && (
        <OrderDetailsUI
          orderNumber={orderModalData.number}
          onClose={closeOrderModal}
        />
      )}
    </>
  );
};
