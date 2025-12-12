import axios from "axios";

// TODO: Get API URL from env
const API_URL = "http://localhost:3002";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // For cookies
});

// Add interceptors for auth token (if using Bearer) or error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401s, etc.
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
