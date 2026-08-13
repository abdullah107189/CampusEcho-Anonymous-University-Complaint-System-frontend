// src/lib/redux/apis/baseApi.ts
import { Mutex } from "async-mutex";
import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import { cookieUtils } from "../utils/cookies";
import { logout } from "../store/slices/authSlice";

interface ErrorResponse {
  code?: string;
  message?: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const accessToken = cookieUtils.getAccessToken();
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const handleLogout = (api: any) => {
  cookieUtils.clearAll();
  api.dispatch(logout());
  if (typeof window !== "undefined") {
    // window.location.href = "/login";
  }
};

const mutex = new Mutex();

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();

  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status !== 401) {
    return result;
  }

  const requestUrl = typeof args === "string" ? args : args.url;

  if (requestUrl === "/auth/logout" || requestUrl === "/auth/refresh-token") {
    return result;
  }

  const errorData = result.error.data as ErrorResponse | undefined;

  if (errorData?.code !== "TOKEN_EXPIRED") {
    handleLogout(api);
    return result;
  }

  if (!mutex.isLocked()) {
    const release = await mutex.acquire();

    try {
      // ✅ raw fetch diye — kono Authorization header pathabo na
      // shudhu httpOnly cookie (credentials: include) e refresh token jabe
      const refreshResponse = await fetch(`${API_URL}/auth/refresh-token`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const refreshJson = await refreshResponse.json();

      if (refreshResponse.ok && refreshJson?.data) {
        if (refreshJson.data.accessToken) {
          cookieUtils.setAccessToken(refreshJson.data.accessToken);
        }
        // ❌ eita o remove — backend HttpOnly cookie nijei rotate kore dise already
        // if (refreshJson.data.refreshToken) {
        //   cookieUtils.setRefreshToken(refreshJson.data.refreshToken);
        // }
        result = await baseQuery(args, api, extraOptions);
      } else {
        handleLogout(api);
      }
    } catch (err) {
      handleLogout(api);
    } finally {
      release();
    }
  } else {
    await mutex.waitForUnlock();
    result = await baseQuery(args, api, extraOptions);
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "Complaint", "Admin", "User"],
  endpoints: () => ({}),
});
