import Sidebar from "../components/sidebar/Sidebar";
import ChatWindow from "../components/chatWindow/ChatWindow";
import useStore from "../store/appStore";
import { getConversations, getSavedConversations } from "../services/conversationService";

import { useEffect, useState } from "react";

function ChatPage() {


  const [isConversationsLoading, setIsConversationsLoading] = useState(false); 
  const [isSavedLoading, setIsSavedLoading] = useState(false); 

  const { selectedConversation, setConversations, setSavedConversations, activeTab } = useStore();

  useEffect(() => {
    const loadConversations = async () => {
      setIsConversationsLoading(true); 
      try {
        const conversations = await getConversations();
      
        setConversations(conversations);
      } catch (error) {
        console.error("Failed to load conversations:", error);
      } finally {
        setIsConversationsLoading(false); 
      }
    };

    loadConversations();
  }, []);

  useEffect(() => {
    if (activeTab !== "saved") return;

    const loadSavedConversations = async () => {
      setIsSavedLoading(true); 
      try {
        const savedConversations = await getSavedConversations();
        setSavedConversations(savedConversations);
      } catch (error) {
        console.error("Failed to load saved conversations:", error);
      } finally {
        setIsSavedLoading(false); 
      }
    };

    loadSavedConversations();
  }, [activeTab]);

  return (
    <div className="flex bg-background w-full h-dvh overflow-hidden">
      <div
        className={`${selectedConversation ? "hidden" : "flex"} xs:flex xs:w-[var(--sidebar-width)] w-full min-h-0`}
      >
        <Sidebar
          isConversationsLoading={isConversationsLoading}   
          isSavedLoading={isSavedLoading}                  
        />
      </div>

      <div
        className={`${selectedConversation ? "flex" : "hidden"} xs:flex flex-1 min-h-0 min-w-0`}
      >
        {selectedConversation ? (
          <ChatWindow />
        ) : (
          <div className="flex flex-1 items-center justify-center"></div>
        )}
      </div>
    </div>
  );
}

export default ChatPage;