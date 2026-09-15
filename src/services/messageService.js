import api from "../api/axios";
import { API_ROUTES } from "../constants/apiRoutes";

export const getMessages = async (conversationId, page = 1, limit = 20) => {
  const response = await api.get(`${API_ROUTES.MESSAGES}/${conversationId}`, {
    params: {
      page,
      limit,
    },
  });

  return response.data;
};

export const sendMessage = async (conversationId, text, files, onUploadProgress) => {
  const formData = new FormData();
  formData.append("conversationId", conversationId);
  files.forEach((attachment) => {
    formData.append("files", attachment.file);
  });
  formData.append("text", text);

  const response = await api.post(`${API_ROUTES.MESSAGES}`, formData, {
    onUploadProgress: (progressEvent) => {
      if (!onUploadProgress) return;
      const percent = Math.round(
        (progressEvent.loaded * 100) / (progressEvent.total || 1)
      );
      onUploadProgress(percent);
    },
  });
  return response.data;
};


export const deleteMessagesForMe = async (messageIds) => {
  const response = await api.delete(`${API_ROUTES.MESSAGES}/delete-for-me`, {
    data: { messageIds },
  });
  return response.data;
};


export const deleteMessagesForEveryone = async (messageIds) => {
  const response = await api.delete(
    `${API_ROUTES.MESSAGES}/delete-for-everyone`,
    {
      data: { messageIds },
    },
  );
  return response.data;
};


export const reactToMessage = async (messageId, emoji) => {
  const response = await api.patch(`${API_ROUTES.MESSAGES}/${messageId}/reaction`, {
    emoji,
  });
  return response.data;
};


export const markAsRead = async (conversationId) => {
  const response = await api.patch(`${API_ROUTES.MESSAGES}/${conversationId}/read`);
  return response.data;
};

export const saveMessages = async (messageIds) => {
  const response = await  api.post(API_ROUTES.SAVED_MESSAGES , { messageIds });

  return response.data;
};
 

export const getSavedMessages = async (conversationId) => {
  const response = await api.get(
    `${API_ROUTES.SAVED_MESSAGES}/${conversationId}`,
  );

  return response.data;
};


export const getSavedChats = async () => {
  const response = await api.get(`${API_ROUTES.SAVED_MESSAGES}`);
  return response.data;
};

export const removeAllSavedMessages = async (conversationId) => {
  const response = await api.delete(
    `${API_ROUTES.SAVED_MESSAGES}/${conversationId}`,
  );
  return response.data;
};



export const searchMessage=async(query ,conversationId,page=1,limit=20)=>{
  const res = await api.get(`${API_ROUTES.MESSAGES}/${conversationId}/search`,{params:{query,page,limit}});
  return res.data;
  
}