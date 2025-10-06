import { configureStore } from "@reduxjs/toolkit";
import collectionsReducer from "../slices/collectionsSlices";
import productsReducer from "../slices/productsSlice";

export const store = configureStore({
  reducer: {
    collections: collectionsReducer,
    products: productsReducer,
  },
});

// types for use in hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
