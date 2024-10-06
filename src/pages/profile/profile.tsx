import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useSelector } from '../../services/store';
import {
  getUser,
  setUser,
  selectIsAuthenticated
} from '../../services/user/UserSlice';
import { updateUser } from '../../services/user/UserActions';
import { useDispatch } from '../../services/store';
import { Navigate } from 'react-router-dom';

export const Profile: FC = () => {
  const user = useSelector(getUser) || { name: '', email: '' };
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({
    name: user.name,
    email: user.email,
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || ''
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    const updatedData = {
      name: formValue.name,
      email: formValue.email,
      password: formValue.password
    };

    const userData = await dispatch(updateUser(updatedData));

    if (updateUser.fulfilled.match(userData)) {
      dispatch(setUser(userData.payload));
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
