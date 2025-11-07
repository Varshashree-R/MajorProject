import axios from "axios";
import { logOut } from "../features/auth/authSlice";

let store;
export const injectStore = (_store) => {
  store = _store;
};

const axiosFetch = axios.create({
  baseURL: "https://backend-qd0z.onrender.com/api", // ✅ FIXED
  withCredentials: true,
});

axiosFetch.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosFetch.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ Access token expired → try refresh
    if (
      error?.response?.status === 401 &&
      error?.response?.data?.msg === "Access Token is not valid" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const userType = localStorage.getItem("userType");
        const rs = await axiosFetch.get(`/auth/${userType}/refresh`);
        localStorage.setItem("token", rs.data.accessToken);

        return axiosFetch(originalRequest);
      } catch (refreshError) {
        store.dispatch(logOut());
      }
    }

    return Promise.reject(error);
  }
);

export default axiosFetch;
// this is the updated 
