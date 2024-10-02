import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  forgotPasswordApi,
  resetPasswordApi,
  updateUserApi,
  TRegisterData,
  TLoginData
} from '@api';
import { TUser } from '@utils-types';
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';
import { setIsAuthChecked } from './UserSlice';

export const register = createAsyncThunk<TUser, TRegisterData>(
  'user/register',
  async (data, { rejectWithValue }) => {
    try {
      const response = await registerUserApi(data);
      return response.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const login = createAsyncThunk<TUser, TLoginData>(
  'user/login',
  async (data, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      const { accessToken, refreshToken } = response;
      setCookie('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      return response.user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();

      deleteCookie('accessToken');

      localStorage.removeItem('refreshToken');
      return;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const forgotPassword = createAsyncThunk<void, { email: string }>(
  'user/forgotPassword',
  async (data, { rejectWithValue }) => {
    try {
      await forgotPasswordApi(data);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const resetPassword = createAsyncThunk<
  void,
  { password: string; token: string }
>('user/resetPassword', async (data, { rejectWithValue }) => {
  try {
    await resetPasswordApi(data);
  } catch (error) {
    return rejectWithValue(error);
  }
});

export const setUser = createAction<TUser | null, 'SET_USER'>('SET_USER');

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    const accessToken = getCookie('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken && accessToken) {
      try {
        const user = await getUserApi();
        dispatch(setUser(user.user));
      } catch (error) {
        dispatch(logout());
      }
    }

    dispatch(setIsAuthChecked(true));
  }
);

export const updateUser = createAsyncThunk<
  TUser,
  { name: string; email: string; password: string }
>('user/update', async (data, { rejectWithValue }) => {
  try {
    const response = await updateUserApi(data);

    return response.user;
  } catch (error) {
    return rejectWithValue(error);
  }
});
