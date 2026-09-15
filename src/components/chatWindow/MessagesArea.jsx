import React, { useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import { useStore } from "../../hooks/useStore";
import { useAuth } from "../../hooks/useAuth";
import AppText from "../ui/AppText";

function MessagesArea({
  isSearchActive,
  searchResults,
  isSearchLoading,
  searchError,
}) {
  const { user } = useAuth();
  const {
    messages,
    selectedMessageIds,
    toggleMessageSelection,
    isSelectionMode,
  } = useStore();

  const list = isSearchActive ? searchResults : messages;

  const bottomRef = useRef(null); 

  
  useEffect(() => {
    if (isSearchActive) return; 
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [list, isSearchActive]);

  if (isSearchActive && isSearchLoading) {
    return (
      <div className="flex-1 flex items-center justify-center py-10">
        <AppText variant="label2">Searching...</AppText>
      </div>
    );
  }

  if (isSearchActive && searchError) {
    return (
      <div className="flex-1 flex items-center justify-center py-10">
        <AppText variant="label2" className="text-red-500">
          {searchError}
        </AppText>
      </div>
    );
  }

  if (isSearchActive && !isSearchLoading && list.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center py-10">
        <AppText variant="label2">No messages found</AppText>
      </div>
    );
  }

  return (
    <>
      {list?.map((message) => (
        <MessageBubble
          key={message._id}
          message={message}
          isSelected={selectedMessageIds?.includes(message._id)}
          onClick={() => {
            if (!isSelectionMode) return;
            toggleMessageSelection(message._id);
          }}
          isMine={message.sender._id === user._id}
        />
      ))}
      <div ref={bottomRef} /> 
    </>
  );
}

export default MessagesArea;