import { createContext, useEffect } from "react";
import { socket } from "../lib/socket";
import { useAuth } from "../hooks/useAuth";
import useAppStore from "../store/appStore";
import { markAsRead } from "../services/messageService";
import { getConversations } from "../services/conversationService";
import {
  requestNotificationPermission,
  showNewMessageNotification,
} from "../utils/notification";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { accessToken, user } = useAuth();

 
  useEffect(() => {
      requestNotificationPermission().then((permission) => {
 
  });
  }, []);

  useEffect(() => {
    if (!accessToken || !user) {
      socket.disconnect();
      return;
    }

    socket.auth = { token: accessToken };
    socket.connect();

 const handleConnect = () => {
  if (import.meta.env.DEV) {
    console.log("Socket connected:", socket.id);
  }
};

const handleConnectError = (error) => {
  if (import.meta.env.DEV) {
    console.error("Socket connection error:", error.message);
  }
};

    const handleUserOnline = ({ userId }) =>
      useAppStore.getState().setUserOnline(userId);

    const handleUserOffline = ({ userId, lastSeenAt }) =>
      useAppStore.getState().setUserOffline(userId, lastSeenAt);

    const handleNewMessage = (message) => {
      const { addMessage , selectedConversation , markConversationAsRead} = useAppStore.getState();

      addMessage(message);
       if (selectedConversation && message.conversation === selectedConversation._id) {
    markConversationAsRead(selectedConversation._id); 
    markAsRead(selectedConversation._id).catch((err) =>
      console.error("Failed to mark as read:", err)
    ); }
    };

    const handleReaction = ({ messageId, reactions }) =>
      useAppStore
        .getState()
        .updateMessageReactions(messageId, reactions);

    const handleMessagesDeleted = (messageIds) => {
      useAppStore
        .getState()
        .deleteSelectedMessages(messageIds);
    };

    const handleConversationUpdated = async (payload) => {
  

      const { conversations, applyConversationUpdate } =
        useAppStore.getState();

      const exists = conversations.some(
        (c) => c._id === payload.conversationId
      );

      if (exists) {
        applyConversationUpdate(payload);
      } else {
        try {
          const fresh = await getConversations();
          useAppStore.getState().setConversations(fresh);
        } catch (err) {
          console.error("Failed to refresh conversations:", err);
        }
      }

      // Notification for incoming message
      const isOwnMessage = payload.senderId === user._id;
  
     if (!isOwnMessage) {
  showNewMessageNotification({
    senderName:
      payload.lastMessage?.sender?.name || "Someone",

    text:
      typeof payload.lastMessage?.text === "string"
        ? payload.lastMessage.text
        : "New message",

    avatar: payload.lastMessage?.sender?.avatar,

    conversationId: payload.conversationId,
  });
}
    };

  

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("userOnline", handleUserOnline);
    socket.on("userOffline", handleUserOffline);
    socket.on("new-message", handleNewMessage);
    socket.on("message-reaction", handleReaction);
    socket.on("messages-deleted", handleMessagesDeleted);
    socket.on("conversation-updated", handleConversationUpdated);

    return () => {
      
      socket.off("connect", handleConnect);
      socket.off("connect_error", handleConnectError);
      socket.off("userOnline", handleUserOnline);
      socket.off("userOffline", handleUserOffline);
      socket.off("new-message", handleNewMessage);
      socket.off("message-reaction", handleReaction);
      socket.off("messages-deleted", handleMessagesDeleted);
      socket.off("conversation-updated", handleConversationUpdated);
    };
  }, [accessToken, user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};