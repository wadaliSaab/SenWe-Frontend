import React from "react";
import {
  CalendarClock,
  Lock,
  EyeOff,
  Pencil,
  X,
  Clock,
  MessageCircle,
 
  ShieldOff,
} from "lucide-react";
import AppText from "./AppText";
import AppButton from "./AppButton";

export default function MessageCard({
  type = "scheduled",


  name,
  handle,
  message,
  avatar,

  
  email,
  scheduledFor, 
  status = "pending", 

  
  timestamp, 

  onAction = () => {},
}) {
  const isScheduled = type === "scheduled";
  


  return (
    <div className="w-full max-w-sm rounded-xl border border-shadow bg-background-hover p-4">
      <div className="flex items-start gap-3">
        <div className="relative shrink-0 w-10 h-10 rounded-full overflow-hidden bg-background-hover flex items-center justify-center">
    
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
         
        </div>

        <div className="min-w-0 flex-1">
          <AppText variant="subtitle" className="truncate">
            {name}
          </AppText>
          <AppText variant="meta" as="p" className="truncate">
            @{handle}
            {isScheduled && email ? ` · ${email}` : ""}
          </AppText>
        </div>

        <span
          className={`shrink-0 text-xs px-2 py-0.5 rounded-md ${
            isScheduled
              ? "bg-accent-light/15 text-accent-light"
              : "bg-purple-400/15 text-purple-300"
          }`}
        >
          {isScheduled ? "Scheduled" : "Private"}
        </span>
      </div>

      <AppText variant="meta" as="p" className="mt-3  line-clamp-2">
        {message}
      </AppText>

      {isScheduled ? (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-text-tertiary">
          <CalendarClock size={14} strokeWidth={2} />
          {scheduledFor}
        </div>
      ) : (
        <div className="mt-2 flex items-center gap-1.5 text-xs text-text-tertiary">
          <EyeOff size={14} strokeWidth={2} />
          Visible only to you
          {timestamp && <span>· {timestamp}</span>}
        </div>
      )}

      <div className="mt-3.5 pt-3.5 border-t gap-4 border-shadow/60 flex items-center justify-between">
        {isScheduled ? (
          <>
            <AppText
              variant="caption"
              className={`inline-flex items-center gap-1 ${
                status === "pending" ? "text-accent-light" : "text-shadow/60"
              }`}
            >
              <Clock size={11} strokeWidth={2} />
              {status === "pending" ? "Pending" : status === "sent" ? "Sent" : "Cancelled"}
            </AppText>

            {status === "pending" && (
              <div className="flex items-center ">
                
                <AppButton
                  variant="icon"
                  size="xs"
                  onClick={() => onAction("cancel")}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={16} strokeWidth={2} />
                </AppButton>
              </div>
            )}
          </>
        ) : (
          <>
           <AppButton variant="secondary" size="sm" onClick={() => onAction("removeshield")} className="flex-1 "> 
                 Remove 
                  <ShieldOff size={15} strokeWidth={2} />
                 
                </AppButton>

            <AppButton variant="primary" size="sm" onClick={() => onAction("view")} className="rounded-md">
              <MessageCircle size={14} strokeWidth={2} />
              View
            </AppButton>
          </>
        )}
      </div>
    </div>
  );
}