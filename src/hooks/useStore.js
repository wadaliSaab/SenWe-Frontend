
import useAppStore from "../store/appStore";


export function useStore() {
  return {
    selectedConversation: useAppStore((state) => state.selectedConversation),
    conversations: useAppStore((state) => state.conversations),
    messages: useAppStore((state) => state.messages),
    savedConversations: useAppStore((state) => state.savedConversations),
    recentConversations: useAppStore((state) => state.recentConversations),
    activeTab: useAppStore((state) => state.activeTab),
    setSavedConversations: useAppStore((state) => state.setSavedConversations),
    setRecentConversations: useAppStore((state) => state.setRecentConversations),
    setSelectedConversation: useAppStore((state) => state.setSelectedConversation),
    setConversations: useAppStore((state) => state.setConversations),
    setActiveTab: useAppStore((state) => state.setActiveTab),
    addMessage: useAppStore((state) => state.addMessage),
    deleteSelectedMessages: useAppStore((state) => state.deleteSelectedMessages),
    clearSelectedMessages: useAppStore((state) => state.clearSelectedMessages),
    
    setMessages: useAppStore((state) => state.setMessages),
    clearMessages: useAppStore((state) => state.clearMessages),
    updateMessageReactions: useAppStore((state) => state.updateMessageReactions),

    selectedMessageIds: useAppStore(
      (state) => state.selectedMessageIds
    ),
   
    toggleMessageSelection: useAppStore(
      (state) => state.toggleMessageSelection
    ),

    isSelectionMode: useAppStore(
      (state) => state.isSelectionMode
    ),
     
    updateConversationPin: useAppStore((state) => state.updateConversationPin),

    markConversationAsRead: useAppStore((state) => state.markConversationAsRead),

    removeSavedConversation: useAppStore((state) => state.removeSavedConversation),
    toggleSelectionMode: useAppStore(
      (state) => state.toggleSelectionMode
    ),
    setUserOffline: useAppStore((state) => state.setUserOffline),
    onlineUserIds: useAppStore((state) => state.onlineUserIds),
    lastSeenMap: useAppStore((state) => state.lastSeenMap),
    setUserOnline: useAppStore((state) => state.setUserOnline),
    resetStore: useAppStore((state) => state.resetStore),
  };
}