import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000", // NestJS API server
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to attach token if we implement customer auth later
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("customer_token") : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
