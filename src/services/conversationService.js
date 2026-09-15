import api from "../api/axios";
import { API_ROUTES } from "../constants/apiRoutes";

export const createConversation = async (receiverId) => {
  const response = await api.post(API_ROUTES.CONVERSATIONS, { receiverId });
  return response.data;
};

export const getConversations = async () => {
  const response = await api.get(API_ROUTES.CONVERSATIONS);

  return response.data;
};

export const getSavedConversations = async () => {
  const response = await api.get(`${API_ROUTES.SAVED_MESSAGES}`);

  return response.data;

}

export const deleteConversation = async (conversationId) => {
  const response = await api.delete(
    `${API_ROUTES.CONVERSATIONS}/${conversationId}`,
  );
  return response.data;
};


export const searchConversation=async(query ,filter ,page=1,limit=20)=>{
  const response=await api.get(API_ROUTES.SEARCH_CONVERSATION , {
    params:{query,filter,page,limit}
  });
  return response.data;
}

export const togglePinConversation=async(conversationId)=>{
  const response=await api.patch(`${API_ROUTES.CONVERSATIONS}/${conversationId}/pin`);
  return response.data;
}