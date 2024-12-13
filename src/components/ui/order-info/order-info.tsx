import React, { FC, memo } from 'react';
import {
  CurrencyIcon,
  FormattedDate
} from '@zlden/react-developer-burger-ui-components';

import styles from './order-info.module.css';

import { OrderInfoUIProps } from './type';
import { OrderStatus } from '@components';
import { useLocation } from 'react-router-dom';

export const OrderInfoUI: FC<OrderInfoUIProps> = memo(({ orderInfo }) => {
  const { number, name, status, ingredientsInfo, date, total } = orderInfo;
  const location = useLocation();
  const isModal = location.state && location.state.background;

  const modifiedIngredientsInfo = Object.values(ingredientsInfo).map((item) => {
    if (item.type === 'bun') {
      return { ...item, count: 2 };
    }
    return item;
  });

  return (
    <div className={isModal ? styles.wrap : styles.wrap_page}>
      <h3 className={`text text_type_main-medium pb-3 pt-10 ${styles.header}`}>
        {name}
      </h3>
      <OrderStatus status={status} />
      <p className={`text text_type_main-medium pt-15 pb-6`}>Состав:</p>
      <ul className={`${styles.list} mb-8`}>
        {modifiedIngredientsInfo.map((item, index) => (
          <li className={`pb-4 pr-6 ${styles.item}`} key={index}>
            <div className={styles.img_wrap}>
              <div className={styles.border}>
                <img
                  className={styles.img}
                  src={item.image_mobile}
                  alt={item.name}
                />
              </div>
            </div>
            <span className='text text_type_main-default pl-4'>
              {item.name}
            </span>
            <span
              className={`text text_type_digits-default pl-4 pr-4 ${styles.quantity}`}
            >
              {item.count} x {item.price}
            </span>
            <CurrencyIcon type={'primary'} />
          </li>
        ))}
      </ul>
      <div className={styles.bottom}>
        <p className='text text_type_main-default text_color_inactive'>
          <FormattedDate date={date} />
        </p>
        <span className={`text text_type_digits-default pr-4 ${styles.total}`}>
          {total}
        </span>
        <CurrencyIcon type={'primary'} />
      </div>
    </div>
  );
});
