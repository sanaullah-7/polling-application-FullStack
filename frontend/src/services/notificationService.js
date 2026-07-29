import api from "./api";

export const getNotifications = () => api.get("/api/notification/");

export const markNotificationsRead = () =>
  api.patch("/api/notification/read");
