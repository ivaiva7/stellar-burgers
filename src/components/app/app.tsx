import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { ConstructorPage, Feed, NotFound404 } from '@pages';
import '../../index.css';
import { OnlyAuth, OnlyUnAuth } from '../ProtectedRoute';
import styles from './app.module.css';
import { Login } from '@pages';
import { Register } from '@pages';
import { ForgotPassword } from '@pages';
import { ResetPassword } from '@pages';
import { Profile } from '@pages';
import { ProfileOrders } from '@pages';
import { useState, useEffect } from 'react';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';

const App = () => {
  const navigate = useNavigate();
  const { number } = useParams<{ number: string }>();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const handleCloseModal = () => {
    navigate(-1);
    setIsOrderModalOpen(false);
  };

  const orderNumber = number ? parseInt(number, 10) : null;

  useEffect(() => {
    if (orderNumber) {
      setIsOrderModalOpen(true);
    }
  }, [orderNumber]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route
          path='/feed/:number'
          element={
            <Modal
              title='Order Info'
              onClose={() => {
                navigate(-2);
                setIsOrderModalOpen(false);
              }}
            >
              <OrderInfo orderNumber={orderNumber} />
            </Modal>
          }
        />
        <Route path='*' element={<NotFound404 />} />

        <Route
          path='/ingredients/:id'
          element={
            <Modal title='Детали ингридиента' onClose={handleCloseModal}>
              <IngredientDetails />
            </Modal>
          }
        />

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
        <Route
          path='/profile/orders/:number'
          element={
            <OnlyAuth>
              {
                <Modal
                  title='Order Info'
                  onClose={() => {
                    navigate(-2);
                    setIsOrderModalOpen(false);
                  }}
                >
                  <OrderInfo orderNumber={orderNumber} />
                </Modal>
              }
            </OnlyAuth>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
