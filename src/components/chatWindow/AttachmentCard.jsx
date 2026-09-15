import React from "react";
import { File } from "lucide-react";
import AppText from "../ui/AppText";

function AttachmentCard({ attachment }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-background/60 border-accent/40   p-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15">
        <File size={20} className="text-accent" />
      </div>

      <div className="min-w-0 flex-1">
        <AppText
          variant="body"
          className="truncate"
        >
          {attachment.fileName}
        </AppText>
      </div>
    </div>
  );
}

export default AttachmentCard;