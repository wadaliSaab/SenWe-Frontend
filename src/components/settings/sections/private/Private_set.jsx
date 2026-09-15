import React, { useState, useEffect, useCallback } from "react";
import AppText from "../../../ui/AppText";
import MessageCard from "../../../ui/MessageCard";
import PasswordModal from "../../../modals/PasswordModal";
import { ShieldOff } from "lucide-react";
import {
  getPrivateChats,
  removePrivateGroup,
} from "../../../../services/privateMessageService";
import { privateCardMapper } from "../../../../utils/PrivateCardMapper";
import { useProfileStore } from "@/hooks/useProfileStore";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/hooks/useStore";
import { apiRequest } from "../../../../utils/apiRequest";

function Private_set() {
  const navigate = useNavigate();
  const { setSelectedConversation, conversations } = useStore();
  const [privateChats, setPrivateChats] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setSettingActions, setGroupPassword } = useProfileStore();

  const handleConfirm = async (password) => {
    setLoading(true);
    setError("");

    try {
      const res = await getPrivateChats(password);
      const { privateChats, unlockToken } = res;

      setGroupPassword(unlockToken);
      setPrivateChats(privateChats || []);
      setIsOpen(false);
    } catch (e) {
      const status = e?.response?.status;
      const message = e?.response?.data?.message;

      if (status === 404) {
        
        setPrivateChats([]);
        setIsOpen(false);
      } else if (status === 401) {
       
        setPrivateChats([]);
        setIsOpen(false);
        setError("Wrong password, try again.");
      } else {
       
        setPrivateChats([]);
        setIsOpen(false);
        setError(message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleAction = async (id, action, conversationId) => {
    if (action === "view") {
      const Conversation = conversations.find((c) => c._id === conversationId);

      if (!Conversation) {
        setError("Conversation not found in your list.");
        return;
      }

      setSelectedConversation(Conversation);
      navigate("/?mode=private");
    }

    if (action === "removeshield") {
      const res = await apiRequest(() => removePrivateGroup(id));
     
      if (res?.success || res?.message) {
        setPrivateChats((prev) => prev.filter((chat) => chat.groupId !== id)); 
      } else {
        console.error(res?.error);
      }
    }
  };

  const handleRemoveAll = useCallback(async () => {
    if (!privateChats.length) return;
    try {
      setLoading(true);
      await Promise.all(
        privateChats.map((c) => removePrivateGroup(c.groupId)),
      );
      setPrivateChats([]);
    } catch (e) {
      console.error(e);
      setError("Could not remove all private chats.");
    } finally {
      setLoading(false);
    }
  }, [privateChats]);

  const Actions = [
    {
      id: "remove-all",
      icon: ShieldOff,
      label: "remove-all",
      active: false,
      onClick: handleRemoveAll,
    },
  ];

  useEffect(() => {
    setSettingActions(Actions);
  }, []);

  return (
    <div className="h-screen w-full p-8">
      <PasswordModal
        isOpen={isOpen}
        title="Private Messages"
        description="Enter your password to continue."
        loading={loading}
        onClose={handleClose}
        onConfirm={handleConfirm}
        confirmLabel="Unlock"
      />

      {error && (
        <AppText variant="meta" className="  text-warning ">{error}</AppText>
      )}
      <div className="h-full w-full overflow-y-auto hide-scrollbar min-h-0 "><div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" >
        {privateChats?.map((raw) => {
          const cardProps = privateCardMapper(raw);
          return (
            <MessageCard
              key={cardProps.id}
              {...cardProps}
              onAction={(action) =>
                handleAction(cardProps.id, action, cardProps.conversationId)
              }
            />
          );
        })}
      </div></div>
      
    </div>
  );
}

export default Private_set;