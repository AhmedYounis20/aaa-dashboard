import { configureStore } from "@reduxjs/toolkit";
import globalTheme from "./global";

const store = configureStore({
  reducer: {
    global: globalTheme,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatcher = typeof store.dispatch;

export default store;
