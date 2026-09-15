

function formatTimestamp(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function privateCardMapper(raw) {
  return {
    type: "private",
    id: raw.groupId,
    conversationId: raw.conversationId,
    name: raw.user.name,
    handle: raw.user.username,
    avatar: raw.user.avatar,
  };
}