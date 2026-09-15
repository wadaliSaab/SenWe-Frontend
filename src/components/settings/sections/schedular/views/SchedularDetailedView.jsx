import React, { useState, useRef, useEffect } from "react";

import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  FolderOpen,
  Paperclip,
  ArrowBigRightDashIcon,
  Users,
} from "lucide-react";
import AppButton from "../../../../ui/AppButton";
import AppText from "../../../../ui/AppText";
import AppInput from "../../../../ui/AppInput";
import AttachmentPreview from "../../../../ui/AttachmentPreview";
import MessageArea from "../components/MessageArea";
import FormArea from "../components/FormArea";
import { useProfileStore } from "@/hooks/useProfileStore";
import { scheduleMessage } from "../../../../../services/scheduleMessageService";

function SchedularDetailedView({setListView}) {
  

  const { setSettingActions  } = useProfileStore();
  const [message, setMessage] = useState("");
  const [sendAt, setSendAt] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [receiver, setReceiver] = useState("");
  const [sending, setSending] = useState(false);
  

  const attachmentInputRef = useRef(null);

  const handleSend = async () => {
  if (!receiver) {
    toast.error("Please select a valid recipient");
    return;
  }
  if (!sendAt) {
    toast.error("Please select date and time");
    return;
  }
  if (!message.trim() && attachments.length === 0) {
    toast.error("Message must contain text or attachments");
    return;
  }

  try {
    setSending(true);
    await scheduleMessage(sendAt, receiver, message, attachments);
    toast.success("Message scheduled");
    setListView(true);
    setMessage("");
    setSendAt("");
    setAttachments([]);
    setReceiver("");
  } catch (error) {
    const backendMessage =
      error?.response?.data?.message || "Failed to schedule message";
    toast.error(backendMessage);
  } finally {
    setSending(false);
  }
};

  const handleAttachment = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const mappedFiles = files.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null,
      file,
    }));

    setAttachments((prev) => [...prev, ...mappedFiles]);

    
    e.target.value = "";
  };

  const handleRemoveAttachment = (id) => {
    setAttachments((prev) => {
      const removed = prev.find((f) => f.id === id);
      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview); 
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  
  useEffect(() => {
    const isFormValid =
      receiver && sendAt && (message.trim() || attachments.length > 0);

    const currentActions = [
      {
        id: "attachment",
        icon: FolderOpen,
        label: "attachment",
        active: "",
        onClick: () => attachmentInputRef.current.click(),
      },
    ];

   
    if (isFormValid) {
      currentActions.unshift({
        id: "send",
        icon: ArrowBigRightDashIcon,
        label: "send",
        active: "",
        onClick: () => handleSend(),
        disabled: sending,
      });
    }

    setSettingActions(currentActions);

    
    return () => {
      setSettingActions([]);
    };
  }, [receiver, sendAt, message, attachments, sending]);

  return (
    <div className="flex h-full w-full flex-col bg-background">
      {/* Body */}
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto hide-scrollbar p-4 sm:p-6 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <FormArea setSendAt={setSendAt} setReceiver={setReceiver} />

          {/* Message box */}
          <div className="flex flex-1 shadow-inner min-h-[220px] flex-col overflow-hidden rounded-2xl border border-premium/10 bg-background-hover/20 focus-within:border-accent transition-colors duration-200">
            <MessageArea message={message} setMessage={setMessage} />
          </div>
        </div>
<div className="w-full min-h-0 max-h-70 shrink-0 lg:max-h-none lg:h-full lg:w-72">
  <AttachmentPreview
    files={attachments}
    onRemove={handleRemoveAttachment}
    layout="vertical"
  />
</div>
      </div>

      <input
        ref={attachmentInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleAttachment}
      />
    </div>
  );
}

export default SchedularDetailedView;