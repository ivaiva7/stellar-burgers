import { TUser } from '@utils-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  register,
  login,
  logout,
  checkUserAuth,
  forgotPassword,
  resetPassword,
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
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
  isAuthenticated: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<TUser | null>) {
      state.user = action.payload;
    },
    setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    }
  },
  selectors: {
    getIsAuthChecked: (state) => state.isAuthChecked,
    getUser: (state) => state.user
  },
  extraReducers: (builder) => {
    builder

      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
        state.isAuthenticated = true; // Установите true
        state.isLoading = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })

      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(setUser, (state, action) => {
        state.user = action.payload;
      })

      .addCase(checkUserAuth.fulfilled, (state) => {
        state.isAuthChecked = true;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload; // обновите пользователя в состоянии
      });
  }
});

export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;
export const { setUser, setIsAuthChecked } = userSlice.actions;
export const { getIsAuthChecked, getUser } = userSlice.selectors;

export default userSlice.reducer;
