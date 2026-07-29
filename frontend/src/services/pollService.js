import api from "./api";

export const listPolls = (params) => api.get("/api/polls", { params });

export const createPoll = (formData) => api.post("/api/polls", formData);

export const getMyPolls = () => api.get("/api/polls/mine");

export const getVotedPolls = () => api.get("/api/polls/voted");

export const getBookmarks = () => api.get("/api/polls/bookmarks");

export const getTrending = () => api.get("/api/polls/trending");

export const getPoll = (id, params) =>
  api.get(`/api/polls/${id}`, { params });

export const getPollAnalytics = (id) => api.get(`/api/polls/${id}/vote`);

export const votePoll = (id, value) =>
  api.post(`/api/polls/${id}/vote`, { value });

export const removeVote = (id) => api.delete(`/api/polls/${id}/vote`);

export const closePoll = (id) => api.patch(`/api/polls/${id}/close`);

export const updatePoll = (id, payload) =>
  api.patch(`/api/polls/${id}`, payload);

export const deletePoll = (id) => api.delete(`/api/polls/${id}`);

export const toggleBookmark = (id) =>
  api.post(`/api/polls/${id}/bookmarks`);
