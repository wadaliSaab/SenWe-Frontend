import React, { useRef, useState } from "react";
import { Paperclip, SendHorizontalIcon } from "lucide-react";
import AppButton from "../ui/AppButton";
import { sendMessage } from "../../services/messageService";
import { useStore } from "../../hooks/useStore";

function InputArea({ setSelectedFiles, selectedFiles ,setIsSending,setUploadProgress,isSending }) {
  const { selectedConversation, selectedMessageIds } = useStore();
  const selectedCount = selectedMessageIds.length;
  const [message, setMessage] = useState("");
  
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleInput = (e) => {
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 180) + "px";
  };

  const handleSend = async () => {
    if (
      !selectedConversation ||
      (!message.trim() && selectedFiles.length === 0)
    ) {
      return;
    }

    const hasFiles = selectedFiles.length > 0;

    try {
      if (hasFiles) {
        setIsSending(true);   
        setUploadProgress(0); 
      }

      await sendMessage(
        selectedConversation._id,
        message.trim(),
        selectedFiles,
        hasFiles ? (percent) => setUploadProgress(percent) : undefined 
      );

      setMessage("");
      setSelectedFiles([]);

      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);   
      setUploadProgress(0);  
    }
  };

  const handleFileSelect = (e) => {
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

    setSelectedFiles((prev) => [...prev, ...mappedFiles]);
    e.target.value = "";
  };

  return (
    <div className="flex w-full flex-row justify-center px-2 sm:px-12 py-3 bg-transparent sm:max-w-[calc(100%-2rem)] items-center gap-3">
      <div className="flex-1 justify-between items-center flex rounded-md shadow-md bg-background-hover border border-shadow/70 px-4 py-1">
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {selectedCount > 0 ? (
            <div className="flex h-full items-center px-3">
              <p className="text-sm text-text-secondary">
                {selectedCount} messages selected
              </p>
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              onInput={handleInput}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              rows={1}
              disabled={isSending} 
              className="resize-none w-full px-3 py-1 text-sm text-text-primary rounded-lg focus:outline-none hide-scrollbar disabled:opacity-60"
              style={{ lineHeight: "1.2", maxHeight: "170px" }}
            />
          )}
        </div>

        <AppButton
          variant="icon"
          disabled={selectedCount > 1 || isSending} 
          onClick={handleSend}
          className="px-2"
        >
          <SendHorizontalIcon className="w-6 h-6 text-accent-light hover:text-accent-light/60 hover:scale-96 transform duration-200 transition-all" />
        </AppButton>
      </div>

      <div className="bg-accent rounded-full">
        <AppButton
          variant="icon"
          className="p-2"
          disabled={selectedCount > 1 || isSending} 
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="w-6 h-6" />
        </AppButton>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
}

export default InputArea;