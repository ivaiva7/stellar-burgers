import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <>
          <BurgerIcon type={'primary'} />
          <p className='text text_type_main-default ml-2 mr-10'>
            <Link className={styles.link} to='/'>
              Конструктор
            </Link>
          </p>
        </>
        <>
          <ListIcon type={'primary'} />
          <p className='text text_type_main-default ml-2'>
            <Link className={styles.link} to='/feed'>
              Лента заказов
            </Link>
          </p>
        </>
      </div>
      <div className={styles.logo}>
        <Logo className='' />
      </div>
      <div className={styles.link_position_last}>
        <ProfileIcon type={'primary'} />
        <p className='text text_type_main-default ml-2'>
          <Link className={styles.link} to='/profile'>
            {userName || 'Личный кабинет'}
          </Link>
        </p>
      </div>
    </nav>
  </header>
);
