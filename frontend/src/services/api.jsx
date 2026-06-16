import axios from "axios";

const isProduction = import.meta.env.PROD;
const apiBaseURL = import.meta.env.VITE_API_URL || (isProduction ? "https://campuscart-ckro.onrender.com/api" : "/api");
const API = axios.create({
  baseURL: apiBaseURL,
});


API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
