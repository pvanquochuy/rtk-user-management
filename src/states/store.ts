import { configureStore } from "@reduxjs/toolkit";
import UseReducer from "../features/users/userSlice";

export const store = configureStore({
  reducer: {
    users: UseReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
