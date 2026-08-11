// src/lib/api/authApi.ts
import { baseApi } from "./baseApi";
import { setUser, logout } from "../store/slices/authSlice";
import { cookieUtils } from "../utils/cookies";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface VerifyOTPRequest {
  email: string;
  otp: string;
}

interface ResendOTPRequest {
  email: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<any, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // Tokens are set via cookies by backend
          // But we need to save user info
          if (data?.data?.user) {
            cookieUtils.setUser(data.data.user);
            dispatch(setUser(data.data.user));
          }
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),
  
    register: builder.mutation<any, RegisterRequest>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    verifyOTP: builder.mutation<any, VerifyOTPRequest>({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          if (data?.data?.user) {
            cookieUtils.setUser(data.data.user);
            dispatch(setUser(data.data.user));
          }
        } catch (error) {
          console.error("OTP verification failed:", error);
        }
      },
    }),

    resendOTP: builder.mutation<any, ResendOTPRequest>({
      query: (data) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: data,
      }),
    }),

    getMe: builder.query<any, void>({
      query: () => ({
        url: "/auth/me",
        credentials: "include",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.data) {
            cookieUtils.setUser(data.data);
            dispatch(setUser(data.data));
          }
        } catch (error) {
          console.error("Get me failed:", error);
          dispatch(logout());
        }
      },
    }),

    logout: builder.mutation<any, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
        credentials: "include",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          cookieUtils.clearTokens();
          cookieUtils.clearUser();
          dispatch(logout());
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useVerifyOTPMutation,
  useRegisterMutation,
  useResendOTPMutation,
  useGetMeQuery,
  useLogoutMutation,
} = authApi;
