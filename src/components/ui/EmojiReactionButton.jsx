import React, { useState, useRef, useEffect } from "react";
import { Smile } from "lucide-react";
import AppButton from "./AppButton";
import AppText from "./AppText";

const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

function EmojiReactionButton({ onSelect, tooltipPosition = "left" }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const isLeft = tooltipPosition === "left";

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="group relative flex items-center">
      <AppButton
        type="button"
        variant="icon"
        size="sm"
        aria-label="React with emoji"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Smile
          className={`h-5 w-5 transition-all duration-200 ${
            open
              ? "scale-110 text-premium"
              : "text-premium/80 hover:scale-110 hover:text-premium"
          }`}
        />
      </AppButton>

      
      {!open && (
        <div
          className={`pointer-events-none absolute top-1/2 z-10 -translate-y-1/2 whitespace-nowrap rounded-md border border-text-secondary/30 bg-background px-2 py-1 opacity-0 shadow-sm transition-all duration-150 ${
            isLeft
              ? "right-full mr-2 group-hover:-translate-x-0.5 group-hover:opacity-100"
              : "left-full ml-2 group-hover:translate-x-0.5 group-hover:opacity-100"
          }`}
        >
          <AppText variant="label2">React</AppText>
        </div>
      )}

      {/* emoji trail */}
      <div
        className={`absolute top-1/2 z-20 flex -translate-y-1/2 items-center gap-1 rounded-full border border-text-secondary/30 bg-background/95 px-2 py-1.5 shadow-lg backdrop-blur-sm transition-all duration-200 ${
          isLeft ? "right-full mr-2" : "left-full ml-2"
        } ${
          open
            ? "translate-x-0 opacity-100"
            : `pointer-events-none opacity-0 ${
                isLeft ? "translate-x-2" : "-translate-x-2"
              }`
        }`}
      >
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => {
              onSelect?.(emoji);
              setOpen(false);
            }}
            className="rounded-full p-1 text-base leading-none transition-transform duration-150 hover:scale-125"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

export default EmojiReactionButton;