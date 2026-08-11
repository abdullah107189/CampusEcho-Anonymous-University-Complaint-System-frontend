// src/lib/utils/cookies.ts
import Cookies from "js-cookie";

// ✅ Vite environment variable check
const isProduction = import.meta.env.PROD || import.meta.env.NODE_ENV === "production";

export const cookieUtils = {
  setAccessToken: (token: string) => {
    Cookies.set("accessToken", token, {
      expires: 7, // 7 days
      secure: isProduction,
      sameSite: "lax",
      path: "/",
    });
  },

  setRefreshToken: (token: string) => {
    Cookies.set("refreshToken", token, {
      expires: 7,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
    });
  },

  getAccessToken: () => {
    return Cookies.get("accessToken");
  },

  getRefreshToken: () => {
    return Cookies.get("refreshToken");
  },

  clearTokens: () => {
    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("refreshToken", { path: "/" });
  },

  setUser: (user: any) => {
    Cookies.set("user", JSON.stringify(user), {
      expires: 7,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
    });
  },

  getUser: () => {
    const user = Cookies.get("user");
    return user ? JSON.parse(user) : null;
  },

  clearUser: () => {
    Cookies.remove("user", { path: "/" });
  },

  clearAll: () => {
    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("refreshToken", { path: "/" });
    Cookies.remove("user", { path: "/" });
  },
};