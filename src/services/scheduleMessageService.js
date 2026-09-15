import api from "../api/axios";
import { API_ROUTES } from "../constants/apiRoutes";

export const scheduleMessage = async (sendAt, receiver, text, files) => {
  const formData = new FormData();
  formData.append("sendAt", sendAt);
  formData.append("receiver", receiver);
  formData.append("text", text);

  
 
  files.forEach((file) => {
    formData.append("files", file.file); 
  });

  const res = await api.post(API_ROUTES.SCHEDULE_MESSAGE, formData);
  return res.data;
};
export const getScheduledMessages = async () => {
  const res = await api.get(API_ROUTES.SCHEDULE_MESSAGE);
  return res.data;
};

export const cancelScheduleMessage = async (scheduledMessageId) => {
  const res = await api.delete(`${API_ROUTES.SCHEDULE_MESSAGE}/${scheduledMessageId}`);
  return res.data;
};