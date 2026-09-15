import React from "react";
import AppText from "../ui/AppText";
import Avatar from "../ui/Avatar";
import { formatDate } from "../../utils/formatDate";
import MessageAttachments from "./MessageAttachments";
import MessageReactions from "./MessageReactions";

import { useAuth } from "../../hooks/useAuth";

function MessageBubble({ message, isMine, isSelected, onClick }) {
  const { user } = useAuth();
  const currentUserId = user._id;

  return (
    <div
      onClick={onClick}
      className={`w-full flex ${isMine ? "flex-row-reverse" : "flex-row"}`}
    >
      <div>
        <div className="flex flex-row  justify-between max-w-70 sm:max-w-110 items-center gap-4 p-1">
          {!isMine && (
            <div className="flex items-center justify-center self-center shrink-0">
              <Avatar variant="small" src={message.sender.avatar} />
            </div>
          )}

          <div
            className={`relative flex flex-col ${isMine ? "items-end" : "items-start"}`}
          >
            <MessageAttachments attachments={message.attachments} />
            {message.text && (
              <div
                className={`relative shadow-md shadow-black/10 px-2 ${
                  isMine
                    ? "bg-secondary-primary rounded-3xl rounded-br-sm"
                    : "bg-background-hover border border-shadow/70 rounded-xl rounded-bl-sm"
                }`}
              >
                <div className="max-h-[250px] overflow-y-auto hide-scrollbar p-3">
                  <AppText
                    variant="chat"
                    className="whitespace-pre-wrap break-all leading-6"
                  >
                    {message.text}
                  </AppText>
                </div>
              </div>
            )}
          </div>

          {isSelected && (
            <div className="flex items-center justify-center self-center shrink-0">
              <div className="w-[6px] h-[6px] rounded-full bg-premium"></div>
            </div>
          )}
        </div>

        <div
          className={`flex items-center   gap-2 mt-1 px-1 ${isMine ? "justify-end" : "justify-start ml-16"} `}
        >
          <AppText variant="meta2">{formatDate(message.createdAt)}</AppText>
        </div>
        <div
          className={`flex items-center     justify-end ${isMine ? "justify-end" : "justify-start ml-16"} `}
        >
          <MessageReactions
            reactions={message.reactions}
            currentUserId={currentUserId}
            isMine={isMine}
          />
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
