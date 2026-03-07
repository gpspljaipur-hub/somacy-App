// import { configureStore } from "@reduxjs/toolkit";
// import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import authReducer from "../Slices/authSlice"
// import homeReducer from "../Slices/homePageSlice"
// import categoryReducer from "../Slices/categorySlice"
// import cartReducer from "../Slices/cartSlice"
// import searchReducer from "../Slices/searchSlice"

// const persistConfig = {
//   key: 'cart',
//   storage: AsyncStorage,

// };

// const persistedCartReducer = persistReducer(persistConfig, cartReducer);

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     home: homeReducer,
//     category: categoryReducer,
//     cart: persistedCartReducer,
//     search: searchReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }),
// });

// export const persistor = persistStore(store);
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;


import { configureStore, combineReducers } from "@reduxjs/toolkit";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

import authReducer from "../Slices/authSlice";
import homeReducer from "../Slices/homePageSlice";
import categoryReducer from "../Slices/categorySlice";
import cartReducer from "../Slices/cartSlice";
import searchReducer from "../Slices/searchSlice";
import addressReducer from "../Slices/addressSlice";
import loaderReducer from "../Slices/loaderSlice";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["cart", "auth", "category", "home", "address"], // ✅ only cart persists
};

const rootReducer = combineReducers({
  auth: authReducer,
  home: homeReducer,
  category: categoryReducer,
  cart: cartReducer,
  search: searchReducer,
  address: addressReducer,
  loader: loaderReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
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

