import React, { useState, useRef, useEffect } from "react";
import { LucideMoreVertical, LucidePin, LucideTrash2 } from "lucide-react";
import AppButton from "../ui/AppButton";
import AppText from "../ui/AppText";
import Avatar from "../ui/Avatar";

function ConversationCard({
  username,
  avatar,
  date,
  displayName,
  lastMessage,
  onClick,
  isSelected = false,
  unreadCount = 0,
  isPinned = false,
  onPin,
  onDelete,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  const handlePin = (e) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onPin?.();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onDelete?.();
  };
  const displayUnread = unreadCount > 99 ? "99+" : unreadCount;
  
  return (
    <div
      onClick={onClick}
      className={`flex w-full min-w-0 items-center gap-1 border-b ${
        isSelected ? "bg-accent/60" : "bg-background"
      } ${isPinned ? "border-accent-light/60" : "border-shadow/80"}  pl-4 pr-2 py-2 rounded-xl cursor-pointer transition-all hover:bg-accent/50 hover:scale-95`}
    >
      {/* Avatar */}
      <div className="shrink-0">
        <Avatar variant="medium" src={avatar}  />
      </div>

      {/* User Info */}
      <div className="min-w-0 flex-1 pl-2 ">
        <div className="flex items-start justify-between gap-3 ">
          {/* Left Content */}
          <div className="min-w-0 flex-1 ">
            <AppText as="p" variant="label2" className="truncate max-w-36">
              {username}
            </AppText>

            <AppText as="p" variant="subtitle" className="truncate mt-1 pr-2 ">
              {displayName}
            </AppText>

            <AppText as="p" variant="meta" className="truncate mt-2 pr-2">
              {lastMessage}
            </AppText>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="  h-full space-y-1  ">
        <AppText as="p" variant="meta2" className="truncate min-h-4">
          {date}
        </AppText>
        <div className="flex justify-end relative" ref={menuRef}>
          <AppButton
            variant="icon"
            size
            className="w-5 h-5"
            onClick={handleMenuToggle}
          >
            <LucideMoreVertical className="size-4" />
          </AppButton>

          {/* Dropdown */}
          {isMenuOpen && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute top-6 right-0 z-50 w-36 bg-background/50 backdrop-blur border border-shadow/60 rounded-lg  overflow-hidden"
            >
              <button
                onClick={handlePin}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-accent/50 backdrop-blur transition-colors"
              >
                <LucidePin className="size-4 text-text-secondary" />
                <AppText as="span" variant="label2">
                  {isPinned ? "Unpin" : "Pin"}
                  
                </AppText>
              </button>
              <div className="h-px bg-shadow/50" />
              <button
                onClick={handleDelete}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-warning/30 backdrop-blur transition-colors"
              >
                <LucideTrash2 className="size-4 text-red-500" />
                <AppText as="span" variant="label2" className="text-red-500">
                  Delete
                </AppText>
              </button>
            </div>
          )}
        </div>
      
        {/* Unread Notification */} {unreadCount > 0 && (  <div className=" items-center  justify-end flex"><span className="   flex  text-center h-[19px] w-[19px]  items-center justify-center rounded-full  text-premium  bg-accent text-2xs font-semibold leading-none shadow-sm">{displayUnread} </span>
          
        </div>  )}
      </div>
    </div>
  );
}

export default ConversationCard;