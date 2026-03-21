import axios from "axios";

export const BASE_URL = "/api";

const api = axios.create({
  baseURL: BASE_URL,
});

// Attach token automatically
api.interceptors.request.use(
  (config) => {
    const userToken = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");

    // Use whichever exists
    const token = adminToken || userToken;

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized request");
    }
    return Promise.reject(error);
  }
);

export default api;