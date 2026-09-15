export const formatDate = (date) => {
  const conversationDate = new Date(date);
  const today = new Date();

 
  const conversationDay = new Date(conversationDate);
  conversationDay.setHours(0, 0, 0, 0);

  const todayDay = new Date(today);
  todayDay.setHours(0, 0, 0, 0);

  const diffInDays =
    (todayDay - conversationDay) / (1000 * 60 * 60 * 24);

 
  if (diffInDays === 0) {
    return conversationDate.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  }

 
  if (diffInDays === 1) {
    return "Yesterday";
  }

  
  if (diffInDays < 7) {
    return conversationDate.toLocaleDateString([], {
      weekday: "long",
    });
  }

 
  if (
    conversationDate.getFullYear() === today.getFullYear()
  ) {
    return conversationDate.toLocaleDateString([], {
      day: "numeric",
      month: "short",
    });
  }

 
  return conversationDate.toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};