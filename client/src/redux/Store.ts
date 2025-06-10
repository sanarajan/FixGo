import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import serviceReducer from './ServiceSlice';
import adminReducer from './AdminSlice';
import providerReducer from './ProviderSlice';

const adminPersistConfig = {
  key: 'admin',
  storage,
};
const providerPersistConfig = {
  key: 'provider',
  storage,
};
const customerPersistConfig = {
  key: 'customer',
  storage,
};


const persistedUserReducer = persistReducer(customerPersistConfig, userReducer);
const adminPersistedReducer = persistReducer(adminPersistConfig, adminReducer);
const customerPersistedReducer =persistReducer(providerPersistConfig, providerReducer);
const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    admin: adminPersistedReducer,
    provider:customerPersistedReducer,
    service: serviceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
