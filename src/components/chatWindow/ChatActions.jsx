import React, { useState } from "react";
import { useStore } from "../../hooks/useStore";
import { useAuth } from "../../hooks/useAuth";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import {
  saveMessages,
  deleteMessagesForEveryone,
  deleteMessagesForMe,
  reactToMessage,
} from "../../services/messageService";
import { removePrivateMessages } from "../../services/privateMessageService";
import {
  Lock,
  Trash2,
  Download,
  LucideCircleDot,
  ShieldMinus,
} from "lucide-react";
import AppIconRail from "../ui/AppIconRail";
import EmojiReactionButton from "../ui/EmojiReactionButton";
import DeleteOptionsPopover from "../ui/DeleteOptionsPopover";

function ChatActions({ setIsPasswordModalOpen }) {
  const [searchParams] = useSearchParams();
  const isPrivate = searchParams.get("mode") === "private";

  const {
    messages,
    selectedMessageIds,
    selectedConversation,
    activeTab,
    deleteSelectedMessages,
    clearSelectedMessages,
    clearMessages,
    removeSavedConversation,
    isSelectionMode,
    toggleSelectionMode,
    updateMessageReactions,
  } = useStore();

  const { user } = useAuth();

  const [isDeletePopoverOpen, setIsDeletePopoverOpen] = useState(false);

  const closeDeletePopover = () => setIsDeletePopoverOpen(false);

  const finishDelete = () => {
    deleteSelectedMessages(selectedMessageIds);
    clearSelectedMessages();
    toggleSelectionMode();
    closeDeletePopover();
  };

  const handleDeleteForMe = async () => {
    if (selectedMessageIds.length === 0) return;
    try {
      await deleteMessagesForMe(selectedMessageIds);
      toast.success("Message deleted");
      finishDelete();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete message");
    }
  };

  const handleDeleteForEveryone = async () => {
    if (selectedMessageIds.length === 0) return;
    try {
      await deleteMessagesForEveryone(selectedMessageIds);
      toast.success("Message deleted for everyone");
      finishDelete();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete message");
    }
  };

  const handleDeleteEntireChat = async () => {
    if (!messages || messages.length === 0) return;

    const myMessageIds = messages
      .filter((m) => m.sender?._id === user._id)
      .map((m) => m._id);

    const otherMessageIds = messages
      .filter((m) => m.sender?._id !== user._id)
      .map((m) => m._id);

    try {
      if (myMessageIds.length > 0) {
        await deleteMessagesForEveryone(myMessageIds);
      }
      if (otherMessageIds.length > 0) {
        await deleteMessagesForMe(otherMessageIds);
      }
      if (activeTab === "saved" && selectedConversation) {
        removeSavedConversation(selectedConversation._id);
      }
      clearMessages?.();
      toast.success("Chat deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete chat");
    }
  };

  const handleDeleteButtonClick = () => {
    if (selectedMessageIds.length === 0) {
      handleDeleteEntireChat();
    } else {
      setIsDeletePopoverOpen((prev) => !prev);
    }
  };

  const handleSaveMessage = async () => {
    try {
      await saveMessages(selectedMessageIds);

      if (activeTab === "saved") {
        deleteSelectedMessages(selectedMessageIds);
        const remaining = messages.filter(
          (m) => !selectedMessageIds.includes(m._id),
        );
        if (remaining.length === 0 && selectedConversation) {
          removeSavedConversation(selectedConversation._id);
        }
      }

      toast.success("Message saved");
      clearSelectedMessages();
      toggleSelectionMode();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save message");
    }
  };

  const handleRemoveFromPrivate = async () => {
    if (selectedMessageIds.length === 0) return;
    try {
      await removePrivateMessages(selectedMessageIds);
      deleteSelectedMessages(selectedMessageIds);
      toast.success("Removed from private");
      clearSelectedMessages();
      toggleSelectionMode();
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove from private");
    }
  };

  const handleEmojiSelect = async (emoji) => {
    try {
      const { reactions } = await reactToMessage(selectedMessageIds[0], emoji);
      updateMessageReactions?.(selectedMessageIds[0], reactions);
      clearSelectedMessages();
      toggleSelectionMode();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add reaction");
    }
  };

  const allSelectedAreMine =
    selectedMessageIds.length > 0 &&
    selectedMessageIds.every((id) => {
      const msg = messages.find((m) => m._id === id);
      return msg?.sender?._id === user._id;
    });

  const actions = [
    {
      id: "lock",
      icon: Lock,
      label: "Lock",
      disabled: selectedMessageIds.length === 0,
     
      onClick: () => setIsPasswordModalOpen(true),
    },
    {
      id: "delete",
      icon: Trash2,
      label: "Delete",
      
      onClick: handleDeleteButtonClick,
      render: () => (
        <div className="relative">
          <button
            type="button"
            aria-label="Delete"
            onClick={handleDeleteButtonClick}
            className="group flex h-9 w-9  items-center justify-center rounded-md text-text-tertiary transition-all duration-200 hover:scale-110 hover:text-text-primary"
          >
            <Trash2 className="h-5 w-5" />
          </button>

          {selectedMessageIds.length > 0 && (
            <DeleteOptionsPopover
              isOpen={isDeletePopoverOpen}
              onClose={closeDeletePopover}
              onDeleteForMe={handleDeleteForMe}
              onDeleteForEveryone={handleDeleteForEveryone}
              disableForEveryone={!allSelectedAreMine}
              position="left"
            />
          )}
        </div>
      ),
    },
    isPrivate
      ? {
          id: "unlock",
          icon: ShieldMinus,
          label: "Remove from private",
          disabled: selectedMessageIds.length === 0,
         
          onClick: handleRemoveFromPrivate,
        }
      : {
          id: "download",
          icon: Download,
         
          disabled: selectedMessageIds.length === 0,
          label: "Save",
          onClick: handleSaveMessage,
        },
    {
      id: "select",
      icon: LucideCircleDot,
      label: "Select",
      
      onClick: toggleSelectionMode,
      active: isSelectionMode,
    },
  ];

  if (selectedMessageIds.length === 1) {
    actions.push({
      id: "emoji",
      render: () => (
        <EmojiReactionButton
          tooltipPosition="left"
          onSelect={handleEmojiSelect}
        />
      ),
    });
  }

  return (
    <AppIconRail
      actions={actions}
      tooltipPosition="left"
      className="justify-between rounded-md border max-sm:w-11 border-text-secondary/30"
    />
  );
}

export default ChatActions;
