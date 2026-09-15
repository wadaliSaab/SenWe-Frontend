import React from "react";
import { UserPlus, UserX, MessageCircle, ShieldOff, Shield, Check, X, Clock, BadgeCheck } from "lucide-react";
import AppText from "./AppText";
import AppButton from "./AppButton";


export default function EntityCard({
  name,
  handle,
  avatarUrl,
  online = false,
  verified = false,
 
  status = "stranger",
  onAction = () => {},
}) {
 

  return (
    <div className="w-full max-w-sm rounded-xl border border-shadow bg-background-hover py-3 px-2 sm:p-4">
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-background-hover flex items-center justify-center">
            
              <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
            
          </div>
          {online && status === "friend" && (
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-accent-light ring-2 ring-background-secondary" />
          )}
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-center gap-1">
            <AppText variant="subtitle" className="truncate">
              {name}
            </AppText>
            {verified && (
              <BadgeCheck size={14} className="text-accent-light shrink-0" fill="currentColor" fillOpacity={0.18} />
            )}
          </div>
          <AppText variant="meta" as="p" className="truncate">
            {handle}
          </AppText>

          <div className="mt-1 flex items-center gap-1.5">
            <StatusLabel status={status} online={online} />
           
          </div>
        </div>
      </div>

      <div className="mt-3.5 pt-3.5 border-t border-shadow/60 flex items-center gap-2">
        <CardActions status={status} onAction={onAction} />
      </div>
    </div>
  );
}

function StatusLabel({ status, online }) {
  if (status === "friend") {
    return (
      <AppText variant="caption" active={online}>
        {online ? "Online" : "Offline"}
      </AppText>
    );
  }
  if (status === "pending_received") {
    return (
      <AppText variant="caption" active className="inline-flex items-center gap-1">
        <Clock size={11} strokeWidth={2} /> Sent you a request
      </AppText>
    );
  }
  if (status === "pending") {
    return (
      <AppText variant="caption" className="inline-flex max-sm:text-xs items-center gap-1">
        <Clock size={11} strokeWidth={2} /> Request pending
      </AppText>
    );
  }
  if (status === "blocked") {
    return (
      <AppText variant="caption" className="text-warning">
        Blocked
      </AppText>
    );
  }
  return <AppText variant="caption">Not connected</AppText>;
}

function CardActions({ status, onAction }) {
  if (status === "friend") {
    return (
      <>
        <AppButton variant="primary" size="sm" onClick={() => onAction("message")} className="flex-1 rounded-md max-md:text-xs">
          <MessageCircle size={15} strokeWidth={2} />
          Message
        </AppButton>
        <AppButton variant="secondary" className=" max-sm:text-xs" size="sm" onClick={() => onAction("block")}>
          <ShieldOff size={15} strokeWidth={2} />
          Block
        </AppButton>
        <AppButton
          variant="icon"
          size="xs"
          onClick={() => onAction("remove")}
          className="text-warning hover:text-warning/80"
        >
          <UserX size={16} strokeWidth={2} />
        </AppButton>
      </>
    );
  }

  if (status === "pending_received") {
    return (
      <>
        <AppButton variant="primary" size="sm" onClick={() => onAction("accept")} className="flex-1">
          <Check size={15} strokeWidth={2} />
          Accept
        </AppButton>
        <AppButton variant="secondary" size="sm" onClick={() => onAction("decline")} className="flex-1">
          <X size={15} strokeWidth={2} />
          Decline
        </AppButton>
      </>
    );
  }

  
  if (status === "blocked") {
    return (
      <AppButton variant="secondary" size="sm" onClick={() => onAction("unblock")} fullWidth>
        <Shield size={15} strokeWidth={2} />
        Unblock
      </AppButton>
    );
  }

 
  return (
     <>
      <AppButton variant="primary2" size="sm" onClick={() => onAction("message")} className="flex-1 rounded-md max-sm:text-sm">
        <MessageCircle size={15} strokeWidth={2} />
        Message
      </AppButton>
        {status === "pending" ? (
      <AppButton variant="secondary" size="sm" onClick={() => onAction("cancel_request")} className="flex-1 rounded-md">
        <X size={15} strokeWidth={2} />
        Cancel 
      </AppButton>
    ) : (
      <AppButton variant="secondary" size="sm" onClick={() => onAction("add")} className="flex-1 rounded-md max-sm:text-xs ">
        <UserPlus size={15} strokeWidth={2} />
        Add friend
      </AppButton>
    )}
    </>
  );
}