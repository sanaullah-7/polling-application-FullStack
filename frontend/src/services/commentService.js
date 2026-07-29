import api from "./api";

export const getComments = (pollId) => api.get(`/api/comments/${pollId}`);

export const addComment = (pollId, payload) =>
  api.post(`/api/comments/${pollId}`, payload);

export const deleteComment = (commentId) =>
  api.delete(`/api/comments/${commentId}`);
