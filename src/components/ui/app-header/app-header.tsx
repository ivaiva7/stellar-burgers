import React, { FC } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
            <NavLink
              className={
                useLocation().pathname === '/'
                  ? styles.link_active
                  : styles.link
              }
              to='/'
            >
              <BurgerIcon
                type={useLocation().pathname === '/' ? 'primary' : 'secondary'}
              />
              <p className='text text_type_main-default ml-2 mr-10'>
                Конструктор
              </p>
            </NavLink>
          </>
          <>
            <NavLink
              className={
                useLocation().pathname === '/feed'
                  ? styles.link_active
                  : styles.link
              }
              to='/feed'
            >
              <ListIcon
                type={
                  useLocation().pathname === '/feed' ? 'primary' : 'secondary'
                }
              />
              <p className='text text_type_main-default ml-2'>Лента заказов</p>
            </NavLink>
          </>
        </div>
        <div className={styles.logo}>
          <NavLink
            className={
              useLocation().pathname === '/' ? styles.link_active : styles.link
            }
            to='/'
          >
            {' '}
            <Logo className='' />
          </NavLink>
        </div>
        <div className={styles.link_position_last}>
          <NavLink
            className={
              useLocation().pathname === '/profile'
                ? styles.link_active
                : styles.link
            }
            to='/profile'
            onClick={handleProfileClick}
          >
            <ProfileIcon
              type={
                useLocation().pathname === '/profile' ? 'primary' : 'secondary'
              }
            />
            <p className='text text_type_main-default ml-2'>
              {userName || 'Личный кабинет'}
            </p>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
