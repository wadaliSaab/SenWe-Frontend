import React from "react";
import {
  FileText,
  FileArchive,
  FileVideo,
  Music2,
  Image as ImageIcon,
} from "lucide-react";

function FileThumbnail({ file }) {
  const type = file.type || "";

  if (type.startsWith("image/")) {
    return (
      <img
        src={file.preview}
        alt={file.name}
    className=" h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    );
  }

  if (type.startsWith("video/")) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background-hover">
        <FileVideo className="w-10 h-10 text-accent-light" />
      </div>
    );
  }

  if (type.startsWith("audio/")) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background-hover ">
        <Music2 className="w-10 h-10 text-accent-light" />
      </div>
    );
  }

  if (
    type === "application/pdf"
  ) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background-hover ">
        <FileText className="w-10 h-10 text-red-400" />
      </div>
    );
  }

  if (
    type.includes("zip") ||
    type.includes("rar") ||
    type.includes("7z")
  ) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background-hover ">
        <FileArchive className="w-10 h-10 text-yellow-400" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-background-hover ">
      <ImageIcon className="w-10 h-10 text-text-secondary" />
    </div>
  );
}

export default FileThumbnail; 