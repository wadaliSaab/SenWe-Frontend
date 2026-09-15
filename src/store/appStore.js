import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAppStore = create(
  persist(
    (set) => ({
      conversations: [],
      savedConversations: [],
      recentConversations: [],
      selectedConversation: null,

      messages: [],
      selectedMessageIds: [],
      isSelectionMode: false,
      activeAction: null,
      activeTab: "all",

      setConversations: (conversations) => set({ conversations }),

      setSelectedConversation: (conversation) =>
        set({ selectedConversation: conversation }),

      setMessages: (messages) => set({ messages }),

      setSavedConversations: (conversations) =>
        set({ savedConversations: conversations }),

      setRecentConversations: (conversations) =>
        set({ recentConversations: conversations }),

      setActiveTab: (tab) => set({ activeTab: tab }),

      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),

      updateMessageReactions: (messageId, reactions) =>
        set((state) => ({
          messages: state.messages.map((m) =>
            m._id === messageId ? { ...m, reactions } : m
          ),
        })),

      deleteSelectedMessages: (messageIds) =>
        set((state) => ({
          messages: state.messages.filter(
            (message) => !messageIds.includes(message._id)
          ),
        })),

      clearMessages: () => set({ messages: [] }),

      clearSelectedMessages: () =>
        set({ selectedMessageIds: [] }),

      updateConversationPin: (conversationId, isPinned) =>
        set((state) => {
          const updated = state.conversations.map((c) =>
            c._id === conversationId
              ? {
                  ...c,
                  isPinned,
                  pinnedAt: isPinned
                    ? new Date().toISOString()
                    : null,
                }
              : c
          );

          updated.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;

            if (a.isPinned && b.isPinned) {
              return new Date(b.pinnedAt) - new Date(a.pinnedAt);
            }

            return (
              new Date(b.lastMessageAt) -
              new Date(a.lastMessageAt)
            );
          });

          return {
            conversations: updated,
          };
        }),

      markConversationAsRead: (conversationId) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c._id === conversationId
              ? { ...c, unreadCount: 0 }
              : c
          ),
        })),

      removeSavedConversation: (conversationId) =>
        set((state) => ({
          savedConversations: state.savedConversations.filter(
            (c) => c._id !== conversationId
          ),
        })),

      toggleMessageSelection: (messageId) =>
        set((state) => {
          const alreadySelected =
            state.selectedMessageIds.includes(messageId);

          return {
            selectedMessageIds: alreadySelected
              ? state.selectedMessageIds.filter(
                  (id) => id !== messageId
                )
              : [...state.selectedMessageIds, messageId],
          };
        }),

      toggleSelectionMode: () =>
        set((state) => ({
          isSelectionMode: !state.isSelectionMode,
          selectedMessageIds: state.isSelectionMode
            ? []
            : state.selectedMessageIds,
        })),

    
      // REAL-TIME ONLINE STATUS
     

      onlineUserIds: [],
      lastSeenMap: {},

      setUserOnline: (userId) =>
        set((state) => ({
          onlineUserIds: [
            ...new Set([...state.onlineUserIds, userId]),
          ],
        })),

      setUserOffline: (userId, lastSeenAt) =>
        set((state) => ({
          onlineUserIds: state.onlineUserIds.filter(
            (id) => id !== userId
          ),

          lastSeenMap: {
            ...state.lastSeenMap,
            [userId]: lastSeenAt,
          },
        })),


       

applyConversationUpdate: ({ conversationId, lastMessage, lastMessageAt, unreadCount }) =>
  set((state) => {
    const isActive = state.selectedConversation?._id === conversationId;

    const updated = state.conversations.map((c) =>
      c._id === conversationId
        ? {
            ...c,
            lastMessage,
            lastMessageAt,
            
            unreadCount: isActive ? 0 : unreadCount,
          }
        : c
    );

    updated.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      if (a.isPinned && b.isPinned) {
        return new Date(b.pinnedAt) - new Date(a.pinnedAt);
      }
      return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
    });

    return { conversations: updated };
  }),


     
      // RESET STORE
     

      resetStore: () =>
        set({
          conversations: [],
          savedConversations: [],
          recentConversations: [],
          selectedConversation: null,

          messages: [],
          selectedMessageIds: [],
          isSelectionMode: false,
          activeAction: null,
          activeTab: "all",

         
          onlineUserIds: [],
          lastSeenMap: {},
        }),
    }),

    {
      name: "senwe-store",

    
      partialize: (state) => ({
        conversations: state.conversations,
        savedConversations: state.savedConversations,
        recentConversations: state.recentConversations,
        selectedConversation: state.selectedConversation,

        messages: state.messages,
        selectedMessageIds: state.selectedMessageIds,
        isSelectionMode: state.isSelectionMode,
        activeAction: state.activeAction,
        activeTab: state.activeTab,
      }),
    }
  )
);

export default useAppStore;