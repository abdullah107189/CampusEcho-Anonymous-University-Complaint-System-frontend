// src/lib/redux/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { cookieUtils } from '../../utils/cookies';

// Define types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  isVerified: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Get initial state from cookies
const initialUser = cookieUtils.getUser();
const initialToken = cookieUtils.getAccessToken();

const initialState: AuthState = {
  user: initialUser,
  token: initialToken || null,
  isAuthenticated: !!initialUser && !!initialToken,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // ✅ Add this - For login/register success
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
      
      // Save to cookies
      cookieUtils.setUser(user);
      cookieUtils.setAccessToken(token);
    },
    
    // ✅ For OTP verification
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload && !!state.token;
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
    
    // ✅ Logout - Clear everything
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

// Export all actions
export const { 
  setCredentials,  // ✅ Now available!
  setUser, 
  setLoading, 
  setError, 
  logout 
} = authSlice.actions;

export default authSlice.reducer;