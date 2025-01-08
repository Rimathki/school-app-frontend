import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Quiz, Teachers } from '@/utils/types'

type Permission = {
  id: number;
  code: string;
  description: string;
};

type Role = {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
};

type User = {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  last_login: string;
  login_ip: string;
  role: Role;
  teachers: Teachers[],
  quizzes?: Quiz[],
};

type AuthState = {
  auth: User | null;
  isLogged: boolean;
  loading: boolean;
};

const loadAuthFromLocalStorage = (): AuthState => {
  if (typeof window !== "undefined") {
    const expiresIn = localStorage.getItem("expiresIn");
    const refreshToken = localStorage.getItem("refreshToken");
    const auth = localStorage.getItem("auth");

    if (expiresIn && refreshToken && auth) {
      const expireDate = new Date(expiresIn);
      if (expireDate > new Date()) {
        return {
          auth: JSON.parse(auth), // Parse and set user data
          isLogged: true,
          loading: false,
        };
      } else {
        localStorage.removeItem("expiresIn");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("auth");
      }
    }
  }
  return { auth: null, isLogged: false, loading: false };
};


const slice = createSlice({
  name: "auth",
  initialState: loadAuthFromLocalStorage(),
  reducers: {
    logout: (state) => {
      state.auth = null;
      state.isLogged = false;
      localStorage.removeItem("expiresIn");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("auth"); 
    },
    setAuth: (state, action: PayloadAction<{ user: User; expiresIn: number; refreshToken: string }>) => {
      const { user, expiresIn, refreshToken } = action.payload;
      const expireDate = new Date(Date.now() + expiresIn);
      localStorage.setItem("expiresIn", expireDate.toString());
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("auth", JSON.stringify(user));
      state.auth = user;
      state.isLogged = true;
    },
  },
});

export const { logout, setAuth } = slice.actions;

export const selectIsLogged = (state: { auth: AuthState }) => state.auth.isLogged;
export const selectAuth = (state: { auth: AuthState }) => state.auth.auth;
export const selectLoading = (state: { auth: AuthState }) => state.auth.loading;

export default slice.reducer;
