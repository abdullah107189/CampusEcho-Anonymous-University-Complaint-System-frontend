// src/lib/utils/cookies.ts
import Cookies from "js-cookie";

const isProduction =
  import.meta.env.PROD || import.meta.env.NODE_ENV === "production";

export const cookieUtils = {
  setAccessToken: (token: string) => {
    console.log("📝 Setting access token");
    Cookies.set("accessToken", token, {
      expires: 7,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
    });
    // ✅ Verify it's set
    console.log(
      "✅ Access token set, verifying:",
      Cookies.get("accessToken") ? "✅ Success" : "❌ Failed",
    );
  },

  setRefreshToken: (token: string) => {
    console.log("📝 Setting refresh token");
    Cookies.set("refreshToken", token, {
      expires: 7,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
    });
    console.log(
      "✅ Refresh token set, verifying:",
      Cookies.get("refreshToken") ? "✅ Success" : "❌ Failed",
    );
  },

  getAccessToken: () => {
    // ✅ Try multiple ways
    const token = Cookies.get("accessToken");

    // ✅ Fallback: Check document.cookie directly
    if (!token) {
      const allCookies = document.cookie.split(";");
      for (let cookie of allCookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === "accessToken") {
          console.log("📤 Found accessToken via document.cookie");
          return value;
        }
      }
    }

    console.log("📤 Get access token:", token ? "✅ Found" : "❌ Not found");
    return token;
  },

  getRefreshToken: () => {
    const token = Cookies.get("refreshToken");

    // ✅ Fallback: Check document.cookie directly
    if (!token) {
      const allCookies = document.cookie.split(";");
      for (let cookie of allCookies) {
        const [name, value] = cookie.trim().split("=");
        if (name === "refreshToken") {
          console.log("📤 Found refreshToken via document.cookie");
          return value;
        }
      }
    }

    console.log("📤 Get refresh token:", token ? "✅ Found" : "❌ Not found");
    return token;
  },

  // ✅ Debug: Show all cookies
  debug: () => {
    console.log("🍪 All cookies from js-cookie:", Cookies.get());
    console.log("🍪 All cookies from document.cookie:", document.cookie);
    return {
      jsCookie: Cookies.get(),
      documentCookie: document.cookie,
    };
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
