export const API_ROUTES = {
  // Auth

  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  LOGOUT_ALL: "/auth/logout-all",
  REFRESH_TOKEN: "/auth/refresh-token",

  // Conversations

  CONVERSATIONS: "/conversations",

 SEARCH_CONVERSATION: "/conversations/search",

  // Messages

  MESSAGES: "/messages",

  // SaveMessages

  SAVED_MESSAGES: "/saved",

  // PrivateMessages

  PRIVATE_MESSAGE: "/private",
  GET_PRIVATE_CHATS: "/private/chats",
  REMOVE_PRIVATE_MESSAGE: "/private/remove",
  UNLOCK_PRIVATE_MESSAGE: "/private/unlock",
  PRIVATE_GROUP: "/private/groups",

  // User
  UPDATE_PROFILE: "/users/profile",
  CHANGE_PASSWORD: "/users/change-password",
  UPDATE_AVATAR: "/users/avatar",
  DELETE_ACCOUNT: "/users",
  GET_PROFILE: "/users/profile",  
  SEARCH_USERS: "/users/search",

  // ScheduleMessage

  SCHEDULE_MESSAGE: "/scheduled",

  // Friendship
  FRIENDS: "/friends",
  FRIEND_REQUESTS: "/friends/requests",

  // Blocked
  BLOCKED_USERS: "/blocks",
};
