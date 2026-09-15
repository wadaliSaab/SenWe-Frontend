import React, { useState } from "react";
import AppButton from "../ui/AppButton";
import bg from "@/assets/images_main/bg.png";
import ChatComposer from "./ChatComposer";
import { makeMessagesPrivate } from "../../services/privateMessageService";
import PasswordModal from "../modals/PasswordModal";
import { useStore } from "../../hooks/useStore";

import {
  Trash2,
  Lock,
  Download,
  Clock,
  SendHorizontalIcon,
  Paperclip,
} from "lucide-react";
import MessagesArea from "./MessagesArea";
import ChatActions from "./ChatActions";
import AppText from "../ui/AppText";

function ChatBody({
  className,
  isMessagesLoading, 
  isSearchActive,
  searchResults,
  isSearchLoading,
  searchError,
}) {
  const {
    selectedMessageIds,
    clearSelectedMessages,
    toggleSelectionMode,
    messages,
  } = useStore();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const handleMakePrivate = async (password) => {
    try {
      await makeMessagesPrivate(selectedMessageIds, password);
      setIsPasswordModalOpen(false);
      clearSelectedMessages();
      toggleSelectionMode();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`${className} min-h-0 relative overflow-hidden flex flex-col h-full`}
    >
      <div
        className="absolute inset-0 bg-red-500"
        style={{
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="absolute inset-0 bg-background-secondary/60" />
      {!isSearchActive && isMessagesLoading ? (
        // LOADING
        <div className="w-full relative flex-1 min-h-0 flex">
          <div className="flex-1 flex items-center justify-center py-10">
            <div className="flex items-center gap-2 text-text-secondary">
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <AppText variant="label2">Loading messages...</AppText>
            </div>
          </div>
        </div>
      ) :  messages.length > 0 ? (
        // MESSAGES
        <div className="w-full relative flex-1 min-h-0 flex flex-row">
          <div className="relative flex flex-1 min-h-0 flex-col gap-4  px-2 sm:px-6 py-4 hide-scrollbar overflow-y-auto">
            <MessagesArea
              isMessagesLoading={isMessagesLoading}
              isSearchActive={isSearchActive}
              searchResults={searchResults}
              isSearchLoading={isSearchLoading}
              searchError={searchError}
            />
          </div>

          <PasswordModal
            isOpen={isPasswordModalOpen}
            onClose={() => setIsPasswordModalOpen(false)}
            onConfirm={handleMakePrivate}
          />

          <div className="shrink-0 sm:p-4 pr-2 pl-1 bg-transparent my-2 flex items-center">
            <ChatActions
              setIsPasswordModalOpen={() => setIsPasswordModalOpen(true)}
            />
          </div>
        </div>
      ) :(
        // NO MESSAGES
        <div className="w-full relative flex-1 min-h-0 flex">
          <div className="flex-1 flex flex-col items-center justify-center gap-1 py-10">
            <AppText variant="label">No messages yet</AppText>
            <AppText variant="label2">
              Say hi and start the conversation 👋
            </AppText>
          </div>
        </div>
      ) }

      {/* Chat Container */}

      <div className="shrink-0 relative bg-transparent flex justify-center items-center transition-[height] duration-300 ease-in-out w-full">
        <ChatComposer />
      </div>
    </div>
  );
}

export default ChatBody;
