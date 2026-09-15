import api from "../api/axios";
import { API_ROUTES } from "../constants/apiRoutes";



export const makeMessagesPrivate = async (messageIds, password) => {
  const response = await api.patch(API_ROUTES.PRIVATE_MESSAGE, {
    messageIds,
    password,
  });

  return response.data;
};

export const getPrivateChats = async (password) => {
  const response = await api.post(API_ROUTES.GET_PRIVATE_CHATS, {
    password,
  });
  return response.data;
};

export const removePrivateMessages = async (messageIds) => {
  const response = await api.patch(API_ROUTES.REMOVE_PRIVATE_MESSAGE, {
    messageIds,
  });
  return response.data;
};


export const unlockPrivateMessages = async (conversationId, unlockToken) => {
  const response = await api.post(API_ROUTES.UNLOCK_PRIVATE_MESSAGE, {
    conversationId,
    unlockToken,   
  });
  return response.data;
};


export const removePrivateGroup = async (groupId) => {
  const response = await api.delete(`${API_ROUTES.PRIVATE_GROUP}/${groupId}`);
  return response.data;
};