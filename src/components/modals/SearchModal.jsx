import React from "react";
import { Search as SearchIcon, X, Loader2 } from "lucide-react";
import EntityCard from "../ui/EntityCard";
import AppButton from "../ui/AppButton";
import AppText from "../ui/AppText";

function SearchModal({
 
  onClose,
 
  query,
  onQueryChange,
  results = [],
  isLoading = false,
  error = null,
  onAction,
  placeholder = "Search...",
}) {
  return (
    <div className="h-full w-full bg-background-secondary/80 border-r border-shadow/60 shadow-lg shadow-text-secondary/10 flex flex-col">
      {/* Header */}
      <div className="w-full px-3 py-3 border-b border-shadow/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1">
          <SearchIcon size={16} className="text-text-secondary shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={placeholder}
            autoComplete="off"
            className="w-full bg-transparent focus:outline-none text-sm text-text-primary placeholder:text-text-secondary"
          />
        </div>
        <AppButton variant="icon" size="xs" onClick={onClose}>
          <X size={18} />
        </AppButton>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2 p-4 pb-8 hide-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={20} className="animate-spin text-text-secondary" />
          </div>
        ) : error ? (
          <div className="px-2 py-6 text-center">
            <AppText variant="label2" className="text-red-500">
              {error}
            </AppText>
          </div>
        ) : !query.trim() ? (
          <div className="px-2 py-6 text-center">
            <AppText variant="label2" className="text-text-secondary">
              Search for people by name or username
            </AppText>
          </div>
        ) : results.length === 0 ? (
          <div className="px-2 py-6 text-center">
            <AppText variant="label2">No results for "{query}"</AppText>
          </div>
        ) : (
          results.map((user) => (
             
            <EntityCard
              key={user._id}
              name={user.name}
              handle={user.username}
              avatarUrl={user.avatar}
              online={user.online}
              verified={user.verified}
            
              status={user.status}
              onAction={(action) =>  onAction?.(user, action)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default SearchModal;