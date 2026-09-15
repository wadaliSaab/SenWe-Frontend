import AppButton from "../ui/AppButton";
import ConversationCard from "./ConversationCard";
import SidebarMenuButton from "./SidebarMenuButton";
import { useStore } from "../../hooks/useStore";
import { formatDate } from "../../utils/formatDate";
import {
  togglePinConversation,
  deleteConversation,
} from "../../services/conversationService";
import {
  removeAllSavedMessages,
  markAsRead,
} from "../../services/messageService";
import { apiRequest } from "../../utils/apiRequest";
import AppText from "../ui/AppText";

function SidebarFooter({
  onSelectChat,
  isSearching,
  searchResults,
  isSearchLoading,
  searchError,
  isConversationsLoading,
  isSavedLoading,
}) {
  const {
    conversations,
    setConversations,
    savedConversations,
    selectedConversation,
    setSelectedConversation,
    updateConversationPin,
    setActiveTab,
    markConversationAsRead,
    activeTab,
    onlineUserIds,
    lastSeenMap,
  } = useStore();



  const unreadConversation = conversations.filter(
    (conversation) => conversation.unreadCount > 0,
  );
  const totalUnreadCount = conversations.reduce(
    (sum, conversation) => sum + (conversation.unreadCount || 0),
    0,
  );

  const normalCards =
    activeTab === "all"
      ? conversations
      : activeTab === "saved"
        ? savedConversations
        : unreadConversation;

  const conversationCards = isSearching ? searchResults : normalCards;

  const isTabLoading = activeTab === "saved" ? isSavedLoading : isConversationsLoading;

  const handleSelect = async (conversation) => {
    setSelectedConversation(conversation);
    onSelectChat?.(conversation);
    if (conversation.unreadCount > 0) {
      markConversationAsRead(conversation._id);
      try {
        await markAsRead(conversation._id);
        
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onDelete = async (conversationId) => {
    if (activeTab === "saved") {
      await apiRequest(() =>
        removeAllSavedMessages(conversationId),
      );
     
    } else {
      const res = await apiRequest(() => deleteConversation(conversationId));
      if (res?.success) {
        const updatedConversations = conversations.filter(
          (conversation) => conversation._id !== conversationId,
        );
        setConversations(updatedConversations);
        if (selectedConversation._id === conversationId) {
          setSelectedConversation(null);
        }
      }
    }
  };

  const onPin = async (conversationId) => {
    const res = await apiRequest(() => togglePinConversation(conversationId));
    updateConversationPin(res.data.conversationId, res.data.isPinned);
  };

  return (
    <div className="flex-1 flex flex-col bg-background-secondary min-h-0 w-full relative">
      <div className="w-full flex-1 relative overflow-hidden min-h-0 flex py-2 flex-col">
        {!isSearching && (
          <div className="flex w-full items-center shrink-0 p-2 pb-3 gap-2">
            <AppButton
              variant="chip"
              size="sm"
              className="flex-1"
              type="button"
              textVariant="caption"
              active={activeTab === "all"}
              onClick={() => setActiveTab("all")}
            >
              All
            </AppButton>
            <div className="relative flex-1">
              <AppButton
                variant="chip"
                size="sm"
                className="w-full"
                type="button"
                textVariant="caption"
                active={activeTab === "unread"}
                onClick={() => setActiveTab("unread")}
              >
                Unread
              </AppButton>
              {totalUnreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-accent text-premium text-2xs font-semibold leading-none shadow-sm pointer-events-none">
                  {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
                </span>
              )}
            </div>
            <AppButton
              variant="chip"
              size="sm"
              type="button"
              className="flex-1"
              textVariant="caption"
              active={activeTab === "saved"}
              onClick={() => setActiveTab("saved")}
            >
              Saved
            </AppButton>
          </div>
        )}

        <div className="flex flex-col space-y-3 hide-scrollbar overflow-y-auto p-2 pb-16 min-h-0">
          {isSearching && isSearchLoading && (
            <div className="text-center py-4">
              <AppText variant="label2">Searching...</AppText>
            </div>
          )}
          {isSearching && !isSearchLoading && searchError && (
            <div className="text-center py-4">
              <AppText variant="label2" className="text-warning">
                {searchError}
              </AppText>
            </div>
          )}
          {isSearching &&
            !isSearchLoading &&
            !searchError &&
            conversationCards.length === 0 && (
              <div className="text-center py-4">
                <AppText variant="label2">No conversations found</AppText>
              </div>
            )}

          {!isSearching && isTabLoading && (
            <div className="flex flex-col items-center justify-center gap-2 py-10">
              <span className="w-5 h-5 border-2 border-text-secondary border-t-transparent rounded-full animate-spin" />
              <AppText variant="label2">Loading conversations...</AppText>
            </div>
          )}

          {!isSearching && !isTabLoading && conversationCards.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-1 py-10 text-center px-4">
              {activeTab === "saved" ? (
                <>
                  <AppText variant="label">No saved messages</AppText>
                  <AppText variant="label2">Messages you save will show up here</AppText>
                </>
              ) : activeTab === "unread" ? (
                <>
                  <AppText variant="label">All caught up!</AppText>
                  <AppText variant="label2">You have no unread conversations</AppText>
                </>
              ) : (
                <>
                  <AppText variant="label">No conversations yet</AppText>
                  <AppText variant="label2">Start a new chat to get going</AppText>
                </>
              )}
            </div>
          )}

          {(!isSearching || (!isSearchLoading && !searchError)) &&
            !isTabLoading &&
            conversationCards.map((conversation) => {
              const otherUserId = conversation.otherUser?._id;
              const isOnline = onlineUserIds?.includes(otherUserId);
              const lastSeenAt = lastSeenMap?.[otherUserId];

              const dateText = isOnline
                ? "Online"
                : lastSeenAt
                  ? formatDate(lastSeenAt)
                  : "";

              return (
                <ConversationCard
                  key={conversation._id}
                  username={`@${conversation.otherUser?.username}`}
                  displayName={conversation.otherUser?.name}
                  date={dateText}
                  avatar={conversation.otherUser.avatar}
                  lastMessage={
                    typeof conversation.lastMessage === "string"
                      ? conversation.lastMessage
                      : conversation.lastMessage?.text || "No messages yet"
                  }
                  isSelected={selectedConversation?._id === conversation._id}
                  onClick={() => handleSelect(conversation)}
                  isPinned={conversation.isPinned}
                  unreadCount={conversation.unreadCount}
                  onDelete={() => onDelete(conversation._id)}
                  onPin={() => onPin(conversation._id)}
                />
              );
            })}
        </div>

        {!isSearching && (
          <div className="absolute bottom-4 right-4 z-20">
            <SidebarMenuButton />
          </div>
        )}
      </div>
    </div>
  );
}

export default SidebarFooter;