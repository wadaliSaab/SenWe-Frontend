import React from "react";
import AttachmentCard from "./AttachmentCard";
import ImageGrid from "./ImageGrid";

function MessageAttachments({ attachments }) {
  if (!attachments?.length) return null;

  const images = attachments.filter(
    (attachment) => attachment.type === "image"
  );

  const files = attachments.filter(
    (attachment) => attachment.type !== "image"
  );

  return (
    <div className="mb-2 border-accent/30 border p-2 rounded-md flex flex-col gap-2">
      {images.length > 0 && <ImageGrid images={images} />}

      {files.map((attachment) => (
        <AttachmentCard
          key={attachment._id}
          attachment={attachment}
        />
      ))}
    </div>
  );
}

export default MessageAttachments;