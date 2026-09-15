import axios from "axios";
import { getToken, setToken } from "../utils/tokenManager";
import { refreshToken } from "../services/authService";
import { callLogout } from "../utils/authManager";

let refreshPromise = null;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,

  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      const url = originalRequest.url;
      if (
        url?.includes("/auth/login") ||
        url?.includes("/auth/register") ||
        url?.includes("/auth/refresh")
      ) {
        return Promise.reject(error);
      }
      if (originalRequest._retry) {
        return Promise.reject(error);
      }
      originalRequest._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = refreshToken()
            .then((response) => {
              setToken(response.accessToken);
              return response.accessToken;
            })
            .finally(() => {
              refreshPromise = null;
            });
        }

        const accessToken = await refreshPromise;

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        callLogout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
