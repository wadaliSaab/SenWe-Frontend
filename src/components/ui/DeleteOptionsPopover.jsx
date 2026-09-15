import React, { useEffect, useRef } from "react";
import { Trash2, Users } from "lucide-react";
import AppText from "./AppText";

function DeleteOptionsPopover({
  isOpen,
  onClose,
  onDeleteForMe,
  onDeleteForEveryone,
  disableForEveryone = false,
  position = "left",
}) {
  const popoverRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popoverRef}
      className={`absolute top-1/2 z-22 w-40 -translate-y-1/2 overflow-hidden rounded-lg border border-text-secondary/20 bg-background shadow-lg animate-in fade-in zoom-in-95 ${
        position === "left" ? "right-full mr-4" : "left-full ml-2"
      }`}
    >
      <button
        onClick={disableForEveryone ? undefined : onDeleteForEveryone}
        disabled={disableForEveryone}
        aria-disabled={disableForEveryone}
        className={`flex w-full items-center gap-2 px-3 py-2.5 text-left transition-colors ${
          disableForEveryone
            ? "cursor-not-allowed opacity-40"
            : "hover:bg-red-500/10"
        }`}
      >
        <Users className={`h-4 w-4 ${disableForEveryone ? "text-text-tertiary" : "text-red-500"}`} />
        <AppText
          variant="label2"
          className={disableForEveryone ? "text-text-tertiary" : "text-red-500"}
        >
          Delete for Everyone
        </AppText>
      </button>

      <div className="h-px bg-text-secondary/10" />

      <button
        onClick={onDeleteForMe}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-text-secondary/10 transition-colors"
      >
        <Trash2 className="h-4 w-4 text-text-tertiary" />
        <AppText variant="label2">Delete for Me</AppText>
      </button>
    </div>
  );
}

export default DeleteOptionsPopover;