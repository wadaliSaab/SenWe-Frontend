import api from "../api/axios";
import { API_ROUTES } from "../constants/apiRoutes";

export const getFriends = async () => {
  const { data } = await api.get(API_ROUTES.FRIENDS);
  return data;
};

export const getFriendRequests = async () => {
  const { data } = await api.get(API_ROUTES.FRIEND_REQUESTS);
  return data;
};

export const sendFriendRequest = async (receiverId) => {
  const { data } = await api.post(API_ROUTES.FRIENDS, { receiverId });
  return data;
};

export const acceptFriendRequest = async (otherUserId) => {
  const { data } = await api.patch(`${API_ROUTES.FRIENDS}/${otherUserId}/accept`);
  return data;
};

export const rejectFriendRequest = async (otherUserId) => {
  const { data } = await api.patch(`${API_ROUTES.FRIENDS}/${otherUserId}/reject`);
  return data;
};

export const cancelFriendRequest = async (otherUserId) => {
  const { data } = await api.delete(`${API_ROUTES.FRIENDS}/${otherUserId}/cancel`);
  return data;
};

export const removeFriend = async (friendId) => {
  const { data } = await api.delete(`${API_ROUTES.FRIENDS}/${friendId}`);
  return data;
};