import {
  Route,
  Routes,
  useNavigate,
  useLocation,
  useParams
} from 'react-router-dom';
import { ConstructorPage, Feed, NotFound404 } from '@pages';
import '../../index.css';
import { OnlyAuth, OnlyUnAuth } from '../ProtectedRoute';
import styles from './app.module.css';
import {
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders
} from '@pages';
import { useState, useEffect } from 'react';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { useDispatch, useSelector } from '../../services/store';
import { selectIsAuthenticated } from '../../services/user/UserSlice';
import { checkUserAuth, logout } from '../../services/user/UserActions';
const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state && location.state.background;

  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      dispatch(checkUserAuth());
    } else {
      logout();
    }
  }, [dispatch]);

  const { number } = useParams<{ number: string }>();
  const orderNumber = number ? parseInt(number, 10) : null;

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const handleCloseModal = () => {
    navigate(-1);
    setIsOrderModalOpen(false);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='*' element={<NotFound404 />} />

        <Route
          path='/feed/:number'
          element={<OrderInfo orderNumber={orderNumber} />}
        />
        <Route
          path='/profile/orders/:number'
          element={
            <OnlyAuth>
              <OrderInfo orderNumber={orderNumber} />
            </OnlyAuth>
          }
        />

        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        <Route
          path='/login'
          element={
            <OnlyUnAuth>
              <Login />
            </OnlyUnAuth>
          }
        />
        <Route
          path='/register'
          element={
            <OnlyUnAuth>
              <Register />
            </OnlyUnAuth>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <OnlyUnAuth>
              <ForgotPassword />
            </OnlyUnAuth>
          }
        />
        <Route
          path='/reset-password'
          element={
            <OnlyUnAuth>
              <ResetPassword />
            </OnlyUnAuth>
          }
        />

        <Route
          path='/profile'
          element={
            <OnlyAuth>
              <Profile />
            </OnlyAuth>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <OnlyAuth>
              <ProfileOrders />
            </OnlyAuth>
          }
        />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингридиента' onClose={handleCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal
                title='Детали заказа'
                onClose={() => {
                  navigate(-2);
                  setIsOrderModalOpen(false);
                }}
              >
                <OrderInfo orderNumber={orderNumber} />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <OnlyAuth>
                <Modal
                  title='Детали заказа'
                  onClose={() => {
                    navigate(-2);
                    setIsOrderModalOpen(false);
                  }}
                >
                  <OrderInfo orderNumber={orderNumber} />
                </Modal>
              </OnlyAuth>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
