import api from "../api/axios";
import { API_ROUTES } from "../constants/apiRoutes";



export const getBlockedUsers = async () => {
  const res = await api.get(API_ROUTES.BLOCKED_USERS);
  return res.data;
};

export const blockUser = async (blockedUserId) => {
  const res = await api.post(API_ROUTES.BLOCKED_USERS, { blockedUserId });
 
  return res.data;
};

export const unblockUser = async (blockedUserId) => {
  const res = await api.delete(`${API_ROUTES.BLOCKED_USERS}/${blockedUserId}`);
  
  return res.data;
};