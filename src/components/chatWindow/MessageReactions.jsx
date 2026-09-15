import React from "react";
import AppText from "../ui/AppText";

function groupReactions(reactions = [], currentUserId) {
  const map = new Map();
  for (const r of reactions) {
    const entry = map.get(r.emoji) || { emoji: r.emoji, count: 0, mine: false };
    entry.count += 1;
    if (r.user === currentUserId || r.user?._id === currentUserId) entry.mine = true;
    map.set(r.emoji, entry);
  }
  return Array.from(map.values());
}

function MessageReactions({ reactions, currentUserId,  onToggle }) {
  const grouped = groupReactions(reactions, currentUserId);
  if (grouped.length === 0) return null;

  return (
    <div
      className={`    flex     backdrop-blur-xl  items-center justify-center  shadow-sm `}
    >
      {grouped.map(({ emoji, count}) => (
        <button
          key={emoji}
          onClick={(e) => {
            e.stopPropagation();
            onToggle(emoji);
          }}
          className={`flex items-center justify-center    rounded-full  text-lg transition-transform hover:scale-110 `}
        >
          <span className="leading-none">{emoji}</span>
          {count > 1 && (
            <AppText variant="meta2" className="leading-none">
              {count}
            </AppText>
          )}
        </button>
      ))}
    </div>
  );
}

export default MessageReactions;