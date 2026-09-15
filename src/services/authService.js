import api from "../api/axios";
import { API_ROUTES } from "../constants/apiRoutes";

export const login = async (data) => {
    const response = await api.post(API_ROUTES.LOGIN, data);
    return response.data;
};
export const register = async (data) => {
        const response = await api.post(API_ROUTES.REGISTER,  data);
        return response.data;
   
};

export const logout = async () => {
    const response = await api.post(API_ROUTES.LOGOUT);
    return response.data;
};

export const logoutAll = async () => {
    const response = await api.post(API_ROUTES.LOGOUT_ALL);
    return response.data;
}

export const refreshToken = async () => {
    const response = await api.post(API_ROUTES.REFRESH_TOKEN);
    return response.data;
}