import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi,
  updateUserApi,
  fetchWithRefresh,
  TRegisterData,
  TLoginData,
  getUserApi,
  TUserResponse
} from '@api';
import { TUser } from '@utils-types';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';

export const register = createAsyncThunk<TUser, TRegisterData>(
  'user/register',
  async (data) => {
    const response = await registerUserApi(data);
    return response.user;
  }
);

export const setUser = createAction<TUser | null, 'SET_USER'>('SET_USER');

export const login = createAsyncThunk<TUser, TLoginData>(
  'user/login',
  async (data) => {
    const response = await loginUserApi(data);
    const { accessToken, refreshToken, user } = response;

    setCookie('accessToken', accessToken, { expires: 3600 });
    setCookie('refreshToken', refreshToken, { expires: 3600 });
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
);

export const logout = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  deleteCookie('refreshToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  location.reload();
});

export const forgotPassword = createAsyncThunk<void, { email: string }>(
  'user/forgotPassword',
  async (data) => {
    await forgotPasswordApi(data);
  }
);

export const resetPassword = createAsyncThunk<
  void,
  { password: string; token: string }
>('user/resetPassword', async (data) => {
  await resetPasswordApi(data);
});

export const getUser = async (dispatch: any): Promise<TUser | null> => {
  const refreshToken = getCookie('refreshToken');

  const dataUser: TUserResponse = await getUserApi();

  if (!dataUser) {
    dispatch(logout());
    return null;
  }

  return dataUser.user;
};

export const checkUserAuth = createAsyncThunk<TUser | null, void>(
  'user/checkAuth',
  async (_, { dispatch }) => {
    const userData: TUser | null = await getUser(dispatch);
    return userData;
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  { name: string; email: string; password: string }
>('user/update', async (data) => {
  const response = await updateUserApi(data);
  return response.user;
});
