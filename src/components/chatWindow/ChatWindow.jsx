import React, { useEffect, useState, useCallback } from "react";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import { useSocket } from "../../hooks/useSocket";
import { getMessages, getSavedMessages, searchMessage } from "../../services/messageService";
import { unlockPrivateMessages } from "../../services/privateMessageService";
import useStore from "../../store/appStore";
import { useProfileStore } from "../../hooks/useProfileStore";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

function ChatWindow() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { groupPassword: unlockToken } = useProfileStore();
  const isprivate = searchParams.get("mode") === "private";

  const socket = useSocket();
  const { selectedConversation, setMessages, clearMessages, activeTab, setSelectedConversation } = useStore();

  const [searchResults, setSearchResults] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const [isMessagesLoading, setIsMessagesLoading] = useState(false); 

  useEffect(() => {
    if (!selectedConversation) {
      clearMessages();
      return;
    }

    if (isprivate && !unlockToken) {
      clearMessages();
      navigate("/");
      return;
    }

    const loadMessages = async () => {
      setIsMessagesLoading(true); 
      try {
        let messages;
        if (isprivate) {
          messages = await unlockPrivateMessages(selectedConversation._id, unlockToken);
          setMessages(messages);
          return;
        }
        if (activeTab === "all" || activeTab === "unread") {
          messages = await getMessages(selectedConversation._id);
        } else if (activeTab === "saved") {
          messages = await getSavedMessages(selectedConversation._id);
        }
        setMessages(messages);
      } catch (error) {
        console.error("Failed to load messages:", error);
        if (isprivate) {
          navigate("/");
        }
      } finally {
        setIsMessagesLoading(false); 
      }
    };

    clearMessages();
    loadMessages();
  }, [selectedConversation, setMessages, clearMessages, activeTab, isprivate, unlockToken, navigate]);

  const handleSearchQueryChange = useCallback(
    async (query) => {
      if (!query) {
        setIsSearchActive(false);
        setSearchResults([]);
        setSearchError(null);
        return;
      }
      if (!selectedConversation) return;

      setIsSearchActive(true);
      setIsSearchLoading(true);
      setSearchError(null);
      try {
        const data = await searchMessage(query, selectedConversation._id);
        setSearchResults(Array.isArray(data) ? data : data?.results || []);
      } catch (err) {
        console.error(err);
        setSearchError("Search failed. Try again.");
        setSearchResults([]);
      } finally {
        setIsSearchLoading(false);
      }
    },
    [selectedConversation]
  );

  useEffect(() => {
    if (!socket || !selectedConversation) return;

    socket.emit("join-conversation", selectedConversation._id);

    return () => {
      socket.emit("leave-conversation", selectedConversation._id);
    };
  }, [socket, selectedConversation]);

  const handleBack = () => {
    setSelectedConversation(null);
  };

  return (
    <div className="flex-1 border border-shadow flex flex-col relative">
      <button
        onClick={handleBack}
        className="xs:hidden absolute left-0 top-1/2 -translate-y-1/2 z-40
                   w-5 h-14 rounded-r-xl
                   bg-transparent border border-accent/30 border-l-0
                   flex items-center justify-center
                   hover:bg-accent/20 active:scale-95 transition"
      >
        <ChevronLeft size={20} className="text-accent font-bold" />
      </button>

      <ChatHeader
        className="w-full flex flex-col"
        onSearchQueryChange={handleSearchQueryChange}
      />
      <ChatBody
        className="w-full flex-1 flex flex-col"
        isMessagesLoading={isMessagesLoading}
        isSearchActive={isSearchActive}
        searchResults={searchResults}
        isSearchLoading={isSearchLoading}
        searchError={searchError}
      />
    </div>
  );
}

export default ChatWindow;