import { TUser } from '@utils-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  register,
  login,
  logout,
  checkUserAuth,
  updateUser
} from './UserActions';
import { RootState } from '../store';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
};

const initialState: TUserState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthChecked: false,
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('refreshToken')
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<TUser | null>) {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem('user', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('user');
      }
    },
    setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  }
});

export const { setUser, setIsAuthChecked } = userSlice.actions;

export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;
export const selectIsAuthChecked = (state: RootState) =>
  state.user.isAuthChecked;
export const getUser = (state: RootState) => state.user.user;

export default userSlice.reducer;
