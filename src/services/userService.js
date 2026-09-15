import api from "../api/axios";
import { API_ROUTES } from "../constants/apiRoutes";

export const searchUsers = async (query, page = 1, limit = 20) => {
  const res = await api.get(API_ROUTES.SEARCH_USERS, {
    params: { query, page, limit },
  });
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await api.patch(API_ROUTES.UPDATE_PROFILE, data);
  return res.data;
};
export const getProfile = async () => {         
  const res = await api.get(API_ROUTES.GET_PROFILE);
  return res.data;
};

export const updateAvatar = async (avatar) => {
  const formData = new FormData();
  formData.append("avatar", avatar);

  const res = await api.patch(API_ROUTES.UPDATE_AVATAR, formData
  );

  return res.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const res = await api.patch(API_ROUTES.CHANGE_PASSWORD, {
    currentPassword,
    newPassword,
  });

  return res.data;
};

export const deleteAccount = async () => {
  const res = await api.delete(API_ROUTES.DELETE_ACCOUNT);

  return res.data;
};




