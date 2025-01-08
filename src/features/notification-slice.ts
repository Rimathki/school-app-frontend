import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: null,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setNotification: (state, { payload }) => {
      state.message = payload;
    },
    clearNotification: () => initialState,
  },
});

export const { setNotification, clearNotification } = slice.actions;
export const selectNotification = (state: { notification: { message: any; }; }) => state.notification.message;
export default slice.reducer;
