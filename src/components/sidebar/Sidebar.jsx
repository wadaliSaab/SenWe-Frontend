import React, { useEffect, useState, useRef } from "react";
import SidebarHeader from "./SidebarHeader";
import SidebarFooter from "./SidebarFooter";
import { searchConversation } from "../../services/conversationService";
import { useStore } from "../../hooks/useStore";

function Sidebar({ onSelectChat, isConversationsLoading, isSavedLoading }) { 
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const { activeTab } = useStore();

  const debounceRef = useRef(null);
  const latestQueryRef = useRef("");

  useEffect(() => {
    const trimmed = query.trim();

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!trimmed) {
      setIsSearching(false);
      setIsLoading(false);
      setSearchError(null);
      setResults([]);
      return;
    }

    setIsSearching(true);
    setIsLoading(true);
    setSearchError(null);

    debounceRef.current = setTimeout(async () => {
      const currentQuery = trimmed;
      latestQueryRef.current = currentQuery;
      try {
        const data = await searchConversation(currentQuery, activeTab);
        if (latestQueryRef.current !== currentQuery) return;
        setResults(Array.isArray(data) ? data : data?.results || []);
        setSearchError(null);
      } catch (err) {
        if (latestQueryRef.current !== currentQuery) return;
        console.error(err);
        setSearchError("Something went wrong. Please try again.");
        setResults([]);
      } finally {
        if (latestQueryRef.current === currentQuery) setIsLoading(false);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, activeTab]);

  return (
    <div className="flex h-full w-full min-w-0 bg-background-secondary px-2 py-1 flex-col">
      <SidebarHeader setQuery={setQuery} />
      <SidebarFooter
        onSelectChat={onSelectChat}
        isSearching={isSearching}
        searchResults={results}
        isSearchLoading={isLoading}
        searchError={searchError}
        isConversationsLoading={isConversationsLoading}   
        isSavedLoading={isSavedLoading}                   
      />
    </div>
  );
}

export default Sidebar;