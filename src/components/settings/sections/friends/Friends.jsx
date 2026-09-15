import React, { useState, useEffect, useRef, useMemo } from "react";
import FriendCard from "../../../ui/EntityCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchModal from "../../../modals/SearchModal";
import { useProfileStore } from "@/hooks/useProfileStore";
import { createConversation } from "../../../../services/conversationService";
import { useStore } from "../../../../hooks/useStore";

import {
  Search,
  HandshakeIcon,
  ShieldBan,
  BookUser,
  Cable,
} from "lucide-react";
import {
  getBlockedUsers,
  blockUser,
  unblockUser,
} from "../../../../services/blockUserService";
import {
  getFriends,
  getFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  removeFriend,
} from "../../../../services/friendShipService";
import { searchUsers } from "../../../../services/userService";

import { apiRequest } from "../../../../utils/apiRequest";
import { useAuth } from "../../../../hooks/useAuth";

const DEBOUNCE_DELAY = 400;

const ACTION_HANDLERS = {
  add: { fn: sendFriendRequest, tab: "requests", status: "pending" },
  block: { fn: blockUser, tab: "friends", status: "blocked" },
  unblock: { fn: unblockUser, tab: "blocked", status: "none" },
  accept: { fn: acceptFriendRequest, tab: "requests", status: "friend" },
  decline: { fn: rejectFriendRequest, tab: "requests", status: "none" },
  cancel_request: { fn: cancelFriendRequest, tab: "requests", status: "none" },
  remove: { fn: removeFriend, tab: "friends", status: "none" },
};

export default function Friends() {
  const { user } = useAuth();
  const { setSelectedConversation ,conversations ,setConversations } = useStore();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const { setSettingActions } = useProfileStore();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("friends");
  const [isLoading, setIsLoading] = useState(false);

  const [requests, setRequests] = useState([]);
  const [fetchedTabs, setFetchedTabs] = useState({});

  const [data, setData] = useState({
    friends: [],
    blocked: [],
  });

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const debounceRef = useRef(null);
  const latestQueryRef = useRef("");

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const currentQuery = query;
      latestQueryRef.current = currentQuery;
      setIsSearching(true);
      setSearchError(null);

      try {
        const data = await searchUsers(currentQuery);
        if (latestQueryRef.current !== currentQuery) return;
        setResults(data || []);
      } catch (err) {
        if (latestQueryRef.current !== currentQuery) return;
        console.error(err);
        setSearchError("Something went wrong. Please try again.");
        setResults([]);
      } finally {
        if (latestQueryRef.current === currentQuery) setIsSearching(false);
      }
    }, DEBOUNCE_DELAY);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const removeFromLists = (userId) => {
    setRequests((prev) =>
      prev.filter(
        (item) =>
          item.sender?._id !== userId && item.receiver?._id !== userId
      )
    );
    setData((prev) => ({
      friends: prev.friends.filter((item) => item._id !== userId),
      blocked: prev.blocked.filter((item) => item._id !== userId),
    }));
  };

  
  const invalidateTabs = (...tabKeys) => {
    setFetchedTabs((prev) => {
      const updated = { ...prev };
      tabKeys.forEach((key) => delete updated[key]);
      return updated;
    });
  };

  const handleCardAction = async (User, action) => {
    const normalizedAction = action?.toLowerCase();

    if (normalizedAction === "message") {
      const res = await apiRequest(() => createConversation(User._id));
      if (res?.success) {
        setSelectedConversation(res.data);

      
        const alreadyExists = conversations.some((c) => c._id === res.data._id);
        if (!alreadyExists) {
          setConversations([res.data, ...conversations]);
        }

        navigate("/");
      }
      return;
    }

    const handler = ACTION_HANDLERS[normalizedAction];
    if (!handler) {
      console.warn("No handler found for action:", action);
      return;
    }

    const res = await apiRequest(() => handler.fn(User._id));
    if (!res?.success) return;

    removeFromLists(User._id);

    setResults((prev) =>
      prev.map((u) =>
        u._id === User._id ? { ...u, status: handler.status } : u
      )
    );

    
    if (normalizedAction === "add" && res?.data) {
      setRequests((prev) => [...prev, res.data]);
    }

    invalidateTabs(handler.tab, "requests");
  };

  const getData = async (fn, tabId) => {
    setIsSearchOpen(false);
    setActiveTab(tabId);

    const cacheKey = tabId === "sent-requests" ? "requests" : tabId;

    if (fetchedTabs[cacheKey] || isLoading) return;

    setIsLoading(true);
    const res = await apiRequest(fn);

    if (res?.success) {
      if (cacheKey === "requests") {
        setRequests(res.data || []);
      } else {
        setData((prev) => ({ ...prev, [tabId]: res.data || [] }));
      }
      setFetchedTabs((prev) => ({ ...prev, [cacheKey]: true }));
    }

    setIsLoading(false);
  };

  const Actions = useMemo(
    () => [
      {
        id: "search",
        icon: Search,
        label: "Search",
        active: isSearchOpen,
        onClick: () => setIsSearchOpen(true),
      },
      {
        id: "friends",
        icon: HandshakeIcon,
        label: "friends",
        active: !isSearchOpen && activeTab === "friends",
        onClick: () => getData(getFriends, "friends"),
      },
      {
        id: "blocked",
        icon: ShieldBan,
        label: "Blocked",
        active: !isSearchOpen && activeTab === "blocked",
        onClick: () => getData(getBlockedUsers, "blocked"),
      },
      {
        id: "requests",
        icon: BookUser,
        label: "Requests",
        active: !isSearchOpen && activeTab === "requests",
        onClick: () => getData(getFriendRequests, "requests"),
      },
      {
        id: "sent-requests",
        icon: Cable,
        label: "Sent-Requests",
        active: !isSearchOpen && activeTab === "sent-requests",
        onClick: () => getData(getFriendRequests, "sent-requests"),
      },
    ],
    [activeTab, isSearchOpen]
  );

  useEffect(() => {
    getData(getFriends, "friends");
    if (searchParams.get("action") === "search") {
      setIsSearchOpen(true);
    }
  }, []);

  useEffect(() => {
    setSettingActions(Actions);

    return () => {
      setSettingActions([]);
    };
  }, [Actions]);

  const currentList = useMemo(() => {
    if (activeTab === "requests") {
      return requests.filter((item) => String(item.receiver?._id) === user._id);
    }
    if (activeTab === "sent-requests") {
      return requests.filter((item) => String(item.sender?._id) === user._id);
    }

    return data[activeTab] || [];
  }, [activeTab, requests, data]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div className="h-full w-full overflow-y-auto hide-scrollbar px-6 py-8 ">
        {isLoading ? (
          <div className="flex items-center justify-center py-10 text-text-secondary text-sm">
            Loading...
          </div>
        ) : currentList.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-text-secondary text-sm">
            Empty
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentList.map((item) => {
              const person =
                activeTab === "requests"
                  ? item.sender
                  : activeTab === "sent-requests"
                    ? item.receiver
                    : item;

              if (!person) return null;

              return (
                <FriendCard
                  key={item._id || person._id}
                  name={person.name || person.username}
                  handle={person.username}
                  avatarUrl={person.avatarUrl || person.avatar}
                  online={person.online ?? person.isOnline}
                  verified={person.verified}
                  status={
                    activeTab === "requests"
                      ? "pending_received"
                      : activeTab === "sent-requests"
                        ? "pending"
                        : activeTab === "blocked"
                          ? "blocked"
                          : "friend"
                  }
                  onAction={(action) => handleCardAction(person, action)}
                />
              );
            })}
          </div>
        )}
      </div>

      <div
        onClick={() => setIsSearchOpen(false)}
        className={`absolute inset-0 bg-background/90 z-40 transition-opacity duration-300 ${
          isSearchOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      <div
        className={`absolute top-0 left-0 h-full w-full max-w-xs sm:w-80 sm:max-w-none z-50 transition-transform duration-300 ease-out ${
          isSearchOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SearchModal
          onClose={() => setIsSearchOpen(false)}
          query={query}
          onQueryChange={setQuery}
          results={results}
          isLoading={isSearching}
          error={searchError}
          onAction={handleCardAction}
          placeholder="Search user..."
        />
      </div>
    </div>
  );
}