import { TUser } from '@utils-types';
import { userSlice, setUser, setIsAuthChecked } from './UserSlice';
import {
  login,
  logout,
  register,
  checkUserAuth,
  updateUser
} from './UserActions';

jest.mock('@api', () => ({
  register: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  checkUserAuth: jest.fn(),
  updateUser: jest.fn()
}));
describe('userSlice', () => {
  beforeEach(() => {
    const mockStorage: Record<string, string> = {};

    global.localStorage = {
      getItem: jest.fn((key: string) => mockStorage[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        mockStorage[key] = value;
      }),
      removeItem: jest.fn((key: string) => {
        delete mockStorage[key];
      }),
      clear: jest.fn(() => {
        Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
      })
    } as unknown as Storage;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('должен обновить состояние при успешной регистрации (register.fulfilled)', async () => {
    const mockUser: TUser = { email: 'test@example.com', name: 'Test User' };
    const action = register.fulfilled(mockUser, '', {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password'
    });

    const state = userSlice.reducer(undefined, action);

    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
    expect(state.isAuthenticated).toBe(true);
  });

  it('должен обновить состояние при успешном логине (login.fulfilled)', async () => {
    const mockUser: TUser = { email: 'test@example.com', name: 'Test User' };
    const action = login.fulfilled(mockUser, '', {
      email: 'test@example.com',
      password: 'password'
    });

    const state = userSlice.reducer(undefined, action);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
    expect(state.isAuthenticated).toBe(true);
  });

  it('должен удалить пользователя при выходе из системы (logout.fulfilled)', async () => {
    const initialState = {
      user: { email: 'test@example.com', name: 'Test User' },
      isAuthChecked: true,
      isLoading: false,
      error: null,
      isAuthenticated: true
    };

    const action = logout.fulfilled(undefined, '');
    const state = userSlice.reducer(initialState, action);
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('должен обновить состояние при проверке авторизации пользователя (checkUserAuth.fulfilled)', async () => {
    const mockUser: TUser = { email: 'test@example.com', name: 'Test User' };
    const action = checkUserAuth.fulfilled(mockUser, '');

    const state = userSlice.reducer(undefined, action);

    expect(state.user).toEqual(mockUser);
    expect(state.isAuthChecked).toBe(true);
    expect(state.isAuthenticated).toBe(true);
  });

  it('должен обновить данные пользователя при успешном обновлении (updateUser.fulfilled)', async () => {
    const mockUser: TUser = {
      email: 'updated@example.com',
      name: 'Updated User'
    };
    const action = updateUser.fulfilled(mockUser, '', {
      name: 'Updated User',
      email: 'updated@example.com',
      password: 'newpassword'
    });

    const state = userSlice.reducer(undefined, action);

    expect(state.user).toEqual(mockUser);
  });

  it('должен инициализировать состояние с null для user, если нет пользователя в localStorage', () => {
    (localStorage.getItem as jest.Mock).mockReturnValueOnce(null);

    const state = userSlice.reducer(undefined, { type: 'init' });
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('должен сохранить пользователя в localStorage, когда выполнено действие setUser', () => {
    const mockUser: TUser = { email: 'test@example.com', name: 'Test User' };
    const action = setUser(mockUser);
    const state = userSlice.reducer(undefined, action);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify(mockUser)
    );
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it('должен удалить пользователя из localStorage, когда выполнено действие setUser с null', () => {
    const initialState = {
      user: { email: 'test@example.com', name: 'Test User' },
      isAuthChecked: true,
      isLoading: false,
      error: null,
      isAuthenticated: true
    };

    const action = setUser(null);
    const state = userSlice.reducer(initialState, action);

    expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('должен установить isAuthChecked в true, когда выполнено действие setIsAuthChecked', () => {
    const action = setIsAuthChecked(true);
    const state = userSlice.reducer(undefined, action);

    expect(state.isAuthChecked).toBe(true);
  });

  it('должен инициализировать состояние с пользователем, если пользователь существует в initialState', () => {
    const mockUser: TUser = { email: 'test@example.com', name: 'Test User' };
    const initialState = {
      user: mockUser,
      isAuthChecked: false,
      isLoading: false,
      error: null,
      isAuthenticated: true
    };
    const state = userSlice.reducer(initialState, { type: 'init' });
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });
});
