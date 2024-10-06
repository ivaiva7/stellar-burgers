import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from '../slices/IngredientSlice';
import feedReducer from '../slices/FeedSlice';
import userReducer from './user/UserSlice';
import constructorReducer from '../slices/ConstructorSlice';
import orderReducer from '../slices/OrderDetailsSlice';
import ordersReducer from '../slices/OrderSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feed: feedReducer,
  user: userReducer,
  constructorItems: constructorReducer,
  order: orderReducer,
  orders: ordersReducer
});

export default rootReducer;
