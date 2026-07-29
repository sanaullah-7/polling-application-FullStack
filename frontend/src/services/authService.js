import api from "./api";

export const registerUser = (formData) =>
  api.post("/api/auth/register", formData);

export const verifyOtp = (payload) =>
  api.post("/api/auth/verify-otp", payload);

export const resendOtp = (email) =>
  api.post("/api/auth/resend-otp", { email });

export const loginUser = (payload) => api.post("/api/auth/login", payload);

export const forgotPassword = (email) =>
  api.post("/api/auth/forget-password", { email });

export const verifyResetOtp = (payload) =>
  api.post("/api/auth/verify-reset-otp", payload);

export const resetPassword = (payload) =>
  api.post("/api/auth/reset-password", payload);

export const getMe = () => api.get("/api/auth/me");

export const updateProfile = (formData) =>
  api.patch("/api/auth/profile", formData);

export const changePassword = (payload) =>
  api.put("/api/auth/password", payload);

export const deleteAccount = () => api.delete("/api/auth/account");
