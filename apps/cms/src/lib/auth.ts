import { decodeJwt } from "jose";
import api from "./api";

// Types
export interface User {
  id: string;
  email: string;
  role: string;
  sub: string;
  [key: string]: any;
}

export interface AuthResponse {
  accessToken: string;
  user?: User; // Depending on your API, it might return user info or just token
}

// Key for storage
const TOKEN_KEY = "cms_token";

// Auth Helper Object
const auth = {
  // Store token
  setToken(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  // Get token
  getToken() {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  },

  // Clear token (logout)
  logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "/login";
    }
  },

  // Check if authenticated
  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    // Optional: Check expiration
    try {
      const decoded = decodeJwt(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  // Get user info from token
  getUser(): User | null {
    const token = this.getToken();
    if (!token) return null;
    try {
      const decoded = decodeJwt(token);
      return decoded as unknown as User;
    } catch {
      return null;
    }
  },
};

// Add interceptor to Api Client to attach token
api.interceptors.request.use((config) => {
  const token = auth.getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default auth;
