import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Uses localStorage by default
import authReducer from "./authSlice"
import { combineReducers } from 'redux';

// Redux Persist configuration
const persistConfig = {
  key: 'root', // Key for storage
  storage,
  whitelist: ['auth'], // Reducers you want to persist
};

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
});

// Wrap rootReducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed for redux-persist
    }),
});

// Create persistor
export const persistor = persistStore(store);

export default store;
