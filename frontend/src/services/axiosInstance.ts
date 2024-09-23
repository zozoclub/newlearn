import axios, { InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
      config.headers["Authorization"] = accessToken;
    }
    return config;
  },
  (error) => {
    console.log("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const status = error.response.data.status;
    const originalRequest = error.config;
    if (status === "A004" && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log("check refreshToken");
        const newToken = await getRefreshToken();
        // getRefreshToken에서 axiosInstance.defaults.headers['Authorization']을 바꿔주는데 굳이?
        originalRequest.headers["Authorization"] = newToken;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // await logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

const getRefreshToken = async () => {
  const response = await axios.post(`/user/refresh-token`, {});
  const accessToken = response.data.accessToken;
  sessionStorage.setItem("accessToken", accessToken);
  axiosInstance.defaults.headers["Authorization"] = accessToken;

  return accessToken;
};

export default axiosInstance;
