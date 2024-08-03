import {configureStore} from '@reduxjs/toolkit';
import userReducer from './redux/user-slice';
import filterReducer from './redux/filter-slice';
import historyReducer from './redux/history-slice';
import {persistReducer, persistStore} from 'redux-persist';
import receiptReducer from './redux/receipt-slice';
import storage from '@react-native-async-storage/async-storage';
// import storage from 'redux-persist/lib/storage';
import {combineReducers} from '@reduxjs/toolkit';

let rootReducer = combineReducers({
  user: userReducer,
  history: historyReducer,
  filters: filterReducer,
  receipt: receiptReducer,
});

const persistConfig = {
  key: 'root',
  storage,
};

let persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
});
