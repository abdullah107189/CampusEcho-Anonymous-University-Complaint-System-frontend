import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { cookieUtils } from "../../utils/cookies";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
  isVerified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialUser = cookieUtils.getUser();
const initialToken = cookieUtils.getAccessToken();

const initialState: AuthState = {
  user: initialUser,
  token: initialToken || null,

  // Backend token is stored in cookie.
  // So authentication should depend on user for now.
  isAuthenticated: !!initialUser,

  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    // If you ever receive token from backend response
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
      }>
    ) => {
      const { user, token } = action.payload;

      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      cookieUtils.setUser(user);
      cookieUtils.setAccessToken(token);
    },

    // Login / OTP verification
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;

      // IMPORTANT:
      // Backend token is stored in cookie,
      // so don't depend on Redux token here.
      state.isAuthenticated = !!action.payload;

      state.isLoading = false;
      state.error = null;

      if (action.payload) {
        cookieUtils.setUser(action.payload);
      } else {
        cookieUtils.clearUser();
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;

      cookieUtils.clearAll();
    },
  },
});

export const {
  setCredentials,
  setUser,
  setLoading,
  setError,
  logout,
} = authSlice.actions;

export default authSlice.reducer;