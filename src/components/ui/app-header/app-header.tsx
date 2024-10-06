import React, { FC } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../../services/user/UserSlice';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleProfileClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login');
    }
  };

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <>
            <BurgerIcon type={'primary'} />
            <p className='text text_type_main-default ml-2 mr-10'>
              <NavLink
                className={({ isActive }) =>
                  isActive ? styles.link_active : styles.link
                }
                to='/'
              >
                Конструктор
              </NavLink>
            </p>
          </>
          <>
            <ListIcon type={'primary'} />
            <p className='text text_type_main-default ml-2'>
              <NavLink
                className={({ isActive }) =>
                  isActive ? styles.link_active : styles.link
                }
                to='/feed'
              >
                Лента заказов
              </NavLink>
            </p>
          </>
        </div>
        <div className={styles.logo}>
          <Logo className='' />
        </div>
        <div className={styles.link_position_last}>
          <ProfileIcon type={'primary'} />
          <p className='text text_type_main-default ml-2'>
            <NavLink
              className={({ isActive }) =>
                isActive ? styles.link_active : styles.link
              }
              to='/profile'
              onClick={handleProfileClick}
            >
              {userName || 'Личный кабинет'}
            </NavLink>
          </p>
        </div>
      </nav>
    </header>
  );
};
