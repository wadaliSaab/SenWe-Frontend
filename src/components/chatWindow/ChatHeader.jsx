import { CrossIcon, SearchIcon, Check, X, User as UserIcon } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import useBreakpoint from "../../hooks/useBreakpoint";
import { useNavigate } from "react-router-dom";
import AppButton from "../ui/AppButton";
import SenweBadge from "../ui/SenweBadge";
import AppText from "../ui/AppText";
import { useStore } from "../../hooks/useStore";

function ChatHeader({ className, onSearchQueryChange }) {
  const navigate = useNavigate();
  const { selectedConversation, onlineUserIds } = useStore();
  const [searchIsOpen, setSearchIsOpen] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const debounceRef = useRef(null);
  const width = useBreakpoint();
  const badgeSize = width < 640 ? 100 : 125;

  const { otherUser: user } = selectedConversation;
  const isOnline = onlineUserIds.includes(user._id);



  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearchQueryChange?.(chatSearchQuery.trim());
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [chatSearchQuery, onSearchQueryChange]);

  const handleToggleSearch = () => {
    if (searchIsOpen) {
      setChatSearchQuery("");
      onSearchQueryChange?.("");
    }
    setSearchIsOpen((prev) => !prev);
  };
  
  return (
    <div className={`${className} overflow-hidden`}>
      <div className="flex flex-row bg-background-secondary pr-1 gap-2 min-w-0">
        
        
        <div className="flex-shrink-0 flex justify-center items-center  origin-left">
          <SenweBadge
            color="#0653B1"
            verified={true}
            size={badgeSize}
            verificationIcon={<Check className="text-premium font-bold" />}
            iconSize={200}
            avatar={user.avatar}
          />
        </div>

        <div className="flex-1 flex flex-col gap-4 py-3 min-w-0">
          <div className="w-full flex items-center min-w-0">
            <div className="flex-1 min-w-0">
              <div className="grid">
                <div
                  className={`col-start-1 row-start-1 flex items-center gap-2 transition-all duration-300 ease-in-out ${
                    searchIsOpen
                      ? "translate-y-0 opacity-100"
                      : "-translate-y-3 opacity-0 pointer-events-none"
                  }`}
                >
                  {searchIsOpen && (
                    <input
                      autoFocus={searchIsOpen}
                      type="text"
                      value={chatSearchQuery}
                      onChange={(e) => setChatSearchQuery(e.target.value)}
                      placeholder="Search in conversation..."
                      className="w-full bg-transparent border-b border-accent-light text-sm text-text-primary placeholder:text-text-secondary focus:outline-none py-1"
                    />
                  )}
                </div>

                <div
                  className={`col-start-1 row-start-1 flex flex-col justify-center transition-all duration-200 ease-in-out ${
                    searchIsOpen
                      ? "translate-y-3 opacity-0 pointer-events-none"
                      : "translate-y-0 opacity-100"
                  }`}
                >
                  <AppText variant="title" className="truncate max-w-[140px] sm:max-w-120">
                    {user.name}
                  </AppText>
                  <AppText
                    variant="subtitle"
                    className="py-1 text-ellipsis text-text-secondary font-normal truncate max-w-[140px] sm:max-w-120"
                  >
                    @{user.username}
                  </AppText>
                </div>
              </div>
            </div>

            
            <div className="shrink-0 px-1 sm:px-4 flex items-center gap-2 sm:gap-6">
              <AppButton
                onClick={handleToggleSearch}
                variant="chip"
                size="sm"
                className="rounded-full p-1 aspect-square text-text-primary border-accent-light border-[1px]"
              >
                {searchIsOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <SearchIcon className="w-4 h-4" />
                )}
              </AppButton>

              
              <AppButton
                variant="chip"
                onClick={() => navigate("/settings?section=profile")}
                size="sm"
                className="text-text-primary border-accent-light border-[1px] rounded-full sm:rounded-md p-1 sm:px-4 sm:py-1 aspect-square sm:aspect-auto"
              >
                <UserIcon className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">PROFILE</span>
              </AppButton>
            </div>
          </div>

          <div className="flex min-w-0">
            <div className="shadow-sm p-1 flex items-start justify-center shrink-0">
              <AppText variant="label" as="span" className="text-xs">
                {isOnline ? "Online" : "Offline"}
              </AppText>
              <div className="w-1 h-1 bg-success rounded-full"></div>
            </div>
            <AppText
              variant="label2"
              className="px-2 sm:px-4  text-text-tertiary max-w-40 sm:w-50 lg:w-120 truncate"
            >
              {/* {user.bio} */}
            </AppText>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatHeader;