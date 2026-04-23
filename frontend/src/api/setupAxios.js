import axios from "axios";

/**
 * Global axios defaults and interceptors for production use:
 * - Sends Bearer token when present
 * - On 401/403 (except auth endpoints), clears session and redirects to login
 */
export function setupAxios() {
  axios.defaults.headers.common.Accept = "application/json";

  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = token;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error.response?.status;
      const url = String(error.config?.url || "");

      const isAuthRoute =
        url.includes("/login") ||
        url.includes("/register") ||
        url.endsWith("/api/school/login") ||
        url.endsWith("/api/teacher/login") ||
        url.endsWith("/api/student/login");

      if ((status === 401 || status === 403) && !isAuthRoute) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        const reason = status === 403 ? "forbidden" : "expired";
        const login = `/login?session=${reason}`;
        if (!window.location.pathname.includes("/login")) {
          window.location.assign(login);
        }
      }

      return Promise.reject(error);
    }
  );
}
