import axios from "axios";

const TOKEN_KEY = "pollify_token";

const PUBLIC_AUTH_PATHS = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/verify-otp",
  "/api/auth/resend-otp",
  "/api/auth/forget-password",
  "/api/auth/verify-reset-otp",
  "/api/auth/reset-password",
];

const NO_LOGOUT_PATHS = [...PUBLIC_AUTH_PATHS, "/api/auth/password"];

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);
export const setStoredToken = (token) => {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
};

const friendlyMessage = (message) => {
  if (!message) return "Something went wrong. Please try again.";
  const raw = String(message);
  if (/invalid login|unauthorized ip|525|5\.7\.1|smtp|ECONNREFUSED|ETIMEDOUT/i.test(raw)) {
    return "Could not send email. Try Resend code.";
  }
  return raw;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  if (config.data instanceof FormData) delete config.headers["Content-Type"];
  return config;
});

let onUnauthorized = () => {};

export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";
    const message = friendlyMessage(
      error.response?.data?.message ||
        (error.message === "Network Error"
          ? "Unable to connect. Is the server running?"
          : "Something went wrong"),
    );

    const hadToken = Boolean(error.config?.headers?.Authorization);
    const shouldLogout =
      status === 401 &&
      hadToken &&
      !NO_LOGOUT_PATHS.some((path) => url.includes(path));

    if (shouldLogout) {
      setStoredToken(null);
      onUnauthorized();
    }

    return Promise.reject({ status, message, raw: error });
  },
);

export default api;
