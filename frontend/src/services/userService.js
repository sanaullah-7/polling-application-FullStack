import api from "./api";

export const getPublicProfile = (username) =>
  api.get(`/api/users/${username}`);

export const toggleFollow = (username) =>
  api.post(`/api/users/${username}/follow`);

export const getFollowLists = (username) =>
  api.get(`/api/users/${username}/followers`);
