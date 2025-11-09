import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE || "http://192.168.18.2000/php-crud-api"; // change to your php-crud-api base

const api = axios.create({ baseURL, withCredentials: false });

// Attach token to each request (if present)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("w_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
