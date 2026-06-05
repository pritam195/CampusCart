import axios from "axios";

const apiBaseURL = import.meta.env.VITE_API_URL || "/api";

const API = axios.create({
  baseURL: apiBaseURL,
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
