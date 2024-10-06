import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { getIsAuthChecked, getUser } from '../services/user/UserSlice';
import { checkUserAuth } from '../services/user/UserActions';
import { AppDispatch } from '../services/store';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactNode;
};

const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: TProtectedRouteProps): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthChecked = useSelector(getIsAuthChecked);
  const user = useSelector(getUser);
  const location = useLocation();

  useEffect(() => {
    if (!isAuthChecked) {
      dispatch(checkUserAuth());
    }
  }, [dispatch, isAuthChecked]);

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const { from } = location.state ?? { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  return <>{children}</>;
};

export const OnlyAuth = (props: TProtectedRouteProps) => (
  <ProtectedRoute {...props} />
);
export const OnlyUnAuth = (props: TProtectedRouteProps) => (
  <ProtectedRoute onlyUnAuth {...props} />
);
