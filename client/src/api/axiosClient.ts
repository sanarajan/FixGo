import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getRoleFromPath } from "../utils/RoleHelper";
import { getRedirectPathFromCurrentRoute } from "../utils/AuthRedirection";

const getAccessToken = (): string | null => {
  const role = getRoleFromPath();
  return role ? localStorage.getItem(`${role}_accessToken`) : null;
};

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// ✅ Request Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    console.log(" access here");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ✅ Response Interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {

        const userRole = getRoleFromPath();
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/refresh`,
          { userRole },
          { withCredentials: true }
        );

        const { accessToken, role } = refreshResponse.data;

        if (accessToken && role) {
          localStorage.setItem(`${role}_accessToken`, accessToken);
          localStorage.setItem(`currentRole`, role);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        } else {
          throw new Error("Invalid refresh response");
        }
      } catch (refreshError) {
        console.log(" ithalle error");
        const path = getRedirectPathFromCurrentRoute();
        window.location.href = path;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
