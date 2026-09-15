

function formatScheduledFor(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function scheduledCardMapper(raw) {
  return {
    type: "scheduled",
    id: raw._id,

    name: raw.receiver.username,
    handle: raw.receiver.username,
    email: raw.receiver.email,
    avatar: raw.receiver.avatar,

    message: raw.text,
    scheduledFor: formatScheduledFor(raw.sendAt),
    status: raw.status,
  };
}