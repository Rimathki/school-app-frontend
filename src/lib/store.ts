import { configureStore, isRejectedWithValue, Middleware } from "@reduxjs/toolkit";
import { api } from "@/api/api";
import auth, { logout } from "@/features/auth-slice";
import notification from '@/features/notification-slice'
import lessonReducer from "@/features/lesson-slice";
import userReducer from "@/features/user-slice"

const rtkQueryErrorLogger: Middleware = (store) => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const { payload } = action as { payload: { status: number } };

    if (payload.status === 401) {
      store.dispatch(logout());
    }
  }
  return next(action);
};

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth,
    user: userReducer,
    lesson: lessonReducer,
    notification
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, rtkQueryErrorLogger),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => store.dispatch as AppDispatch;
