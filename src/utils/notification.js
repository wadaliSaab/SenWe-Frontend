export function requestNotificationPermission() {
  if (!("Notification" in window)) {
    return Promise.resolve("unsupported");
  }

  if (Notification.permission === "granted") {
    return Promise.resolve("granted");
  }

  if (Notification.permission === "denied") {
    return Promise.resolve("denied");
  }

  return Notification.requestPermission();
}

export function showNewMessageNotification({
  senderName,
  text,
  avatar,
  conversationId,
  onClick,
}) {
  if (
    !("Notification" in window) ||
    Notification.permission !== "granted"
  ) {
    return;
  }

  const notification = new Notification(
    `New message from ${senderName}`,
    {
      body: text || "Sent a message",
      icon: avatar || "/favicon.ico",
      tag: `chat-${conversationId}`,
    }
  );

  notification.onclick = () => {
    window.focus();
    onClick?.();
    notification.close();
  };
}