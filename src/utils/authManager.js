let logoutHandler = null;

export const registerLogout = (handler) => {
    logoutHandler = handler;
};

export const callLogout = () => {
    if(logoutHandler) logoutHandler();
};