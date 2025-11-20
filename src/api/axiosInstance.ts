import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig, AxiosResponse } from "axios";

const API_BASE_URL = "https://techlens-backend-develop.onrender.com";

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/* Refresh Response 타입 */
interface RefreshResponse {
  status: string;
  message: string;
  data: {
    accessToken: string;
  };
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let requestQueue: ((token: string) => void)[] = [];

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.error("Refresh Token 없음 → 로그인 필요");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve) => {
          requestQueue.push((newToken) => {
            original.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(original));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse: AxiosResponse<RefreshResponse> =
          await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

        const newToken = refreshResponse.data.data.accessToken;

        localStorage.setItem("accessToken", newToken);

        requestQueue.forEach((cb) => cb(newToken));
        requestQueue = [];
        isRefreshing = false;
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (err) {
        console.error("Refresh 실패 → 로그인으로 이동");

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        isRefreshing = false;
        requestQueue = [];

        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
