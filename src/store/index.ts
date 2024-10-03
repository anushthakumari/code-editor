import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import { persistReducer, persistStore } from 'redux-persist';
import { combineReducers } from 'redux';
import {thunk} from "redux-thunk";
import counterReducer from './slices/counterSlice';
import fsReducer from './slices/fileSystemSlice';

// Combine reducers if you have multiple
const rootReducer = combineReducers({
  counter: counterReducer,
  fileTree:fsReducer
});

// Redux Persist configuration
const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
