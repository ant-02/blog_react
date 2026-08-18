import axios from "axios";
import { getToken } from "./auth";
import { logout } from "../stores/modules/userSlice";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  timeout: 5000,
});

// 添加请求拦截器
http.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      const prefix = import.meta.env.VITE_API_AUTH_PREFIX;
      config.headers.Authorization = prefix ? `${prefix} ${token}` : token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
http.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      const { default: store } = await import("../stores");
      store.dispatch(logout());
      localStorage.removeItem("xHHx_token");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);
