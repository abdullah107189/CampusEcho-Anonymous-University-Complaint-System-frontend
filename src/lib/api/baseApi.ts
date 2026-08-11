// src/redux/apis/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { cookieUtils } from "../utils/cookies";
import { logout } from "../store/slices/authSlice";

// Define error type
interface ErrorResponse {
  data?: {
    code?: string;
    message?: string;
  };
  status?: number;
}

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = cookieUtils.getAccessToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  // Check if error exists and status is 401
  const error = result.error as ErrorResponse | undefined;

  if (error?.status === 401) {
    const errorData = error.data as
      | { code?: string; message?: string }
      | undefined;

    if (errorData?.code === "TOKEN_EXPIRED") {
      console.log("🔄 Token expired, refreshing...");

      // Try to refresh token
      const refreshResult = await baseQuery(
        {
          url: "/auth/refresh-token",
          method: "POST",
          credentials: "include",
        },
        api,
        extraOptions,
      );

      if (refreshResult.data) {
        // Retry the original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed - logout
        cookieUtils.clearTokens();
        cookieUtils.clearUser();
        api.dispatch(logout());

        // Redirect to login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "Complaint", "Admin"],
  endpoints: () => ({}),
});
