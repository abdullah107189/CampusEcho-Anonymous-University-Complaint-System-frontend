// src/lib/utils/cookies.ts
import Cookies from "js-cookie";

const isProduction =
  import.meta.env.PROD || import.meta.env.NODE_ENV === "production";

const COOKIE_OPTIONS: Cookies.CookieAttributes = {
  expires: 7,
  secure: isProduction,
  sameSite: "lax",
  path: "/",
};

const COOKIE_NAMES = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  user: "user",
} as const;

const setCookie = (
  name: string,
  value: string,
  options: Cookies.CookieAttributes = COOKIE_OPTIONS,
) => {
  Cookies.set(name, value, options);
};

const getCookie = (name: string): string | undefined => {
  return Cookies.get(name);
};

const removeCookie = (name: string) => {
  Cookies.remove(name, { path: "/" });
};

export const cookieUtils = {
  // ─────────────────────────────────────────────
  // Authentication
  // ─────────────────────────────────────────────

  setAccessToken(token: string) {
    setCookie(COOKIE_NAMES.accessToken, token);
  },

  getAccessToken() {
    return getCookie(COOKIE_NAMES.accessToken);
  },

  setRefreshToken(token: string) {
    setCookie(COOKIE_NAMES.refreshToken, token);
  },

  getRefreshToken() {
    return getCookie(COOKIE_NAMES.refreshToken);
  },

  // ─────────────────────────────────────────────
  // User
  // ─────────────────────────────────────────────

  setUser(user: unknown) {
    setCookie(COOKIE_NAMES.user, JSON.stringify(user));
  },

  getUser<T = unknown>(): T | null {
    const user = getCookie(COOKIE_NAMES.user);

    if (!user) {
      return null;
    }

    try {
      return JSON.parse(user) as T;
    } catch {
      return null;
    }
  },

  // ─────────────────────────────────────────────
  // Cleanup
  // ─────────────────────────────────────────────

  clearTokens() {
    removeCookie(COOKIE_NAMES.accessToken);
    removeCookie(COOKIE_NAMES.refreshToken);
  },

  clearUser() {
    removeCookie(COOKIE_NAMES.user);
  },

  clearAll() {
    this.clearTokens();
    this.clearUser();
  },
};