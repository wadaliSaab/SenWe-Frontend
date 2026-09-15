import React from "react";
import AttachmentCard from "./AttachmentCard";
import AppText from "../ui/AppText";

function AttachmentPreview({ files, onRemove, layout = "horizontal", isSending, uploadProgress }) {
  const isVertical = layout === "vertical";
  if (!files?.length) return null;

  return (
    <div
      className={`
    z-40
    rounded-2xl
    border
    border-white/10
    backdrop-blur-xl
    shadow-2xl
    shadow-black/40
    p-2
  

    ${
      isVertical
        ? "relative w-full max-w-full h-full flex flex-col  "
        : "absolute bottom-full left-1/2 -translate-x-1/2 w-fit max-w-[calc(100%-4rem)]"
    }
  `}
    >
      <div className="flex items-center justify-between px-2  ">
        <AppText
          variant="label"
          className="text-xs text-text-secondary font-medium"
        >
          Attached Files ({files.length})
        </AppText>
      </div>

      <div
        className={`
    p-3
    gap-4
    flex
  

    ${
      isVertical
        ? "flex-col overflow-y-auto min-h-0    h-full  w-full hide-scrollbar"
        : "flex-row overflow-x-auto hide-scrollbar w-fit max-w-full"
    }
`}
      >
        {files.map((file) => (
          <div
            key={file.id}
            className={`relative aspect-square shrink-0 ${isVertical ? "w-full" : "w-36 sm:w-40"}`}
          >
            <AttachmentCard file={file} onRemove={() => onRemove(file.id)}   isSending={isSending}         
        uploadProgress={uploadProgress} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AttachmentPreview;
