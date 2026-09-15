import React from "react";
import { X } from "lucide-react";
import AppText from "./AppText";
import AppButton from "../ui/AppButton";
import FileThumbnail from "./FileThumbnail";

function AttachmentCard({ file, onRemove, isSending, uploadProgress }) {
  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-shadow/70 bg-background-hover transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl">
      <div className="flex items-start justify-between p-2 border-b border-shadow/50">
        <div className="min-w-0 flex-1">
          <AppText variant="meta" className="truncate">
            {file.name}
          </AppText>
          <AppText variant="meta" className="text-text-secondary">
            {file.size}
          </AppText>
        </div>

        {!isSending && ( 
          <AppButton
            size="xs"
            onClick={onRemove}
            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-accent backdrop-blur-md border border-premium/10 transition-all duration-200 hover:bg-warning p-0 hover:text-premium"
          >
            <X className="w-4 h-4" />
          </AppButton>
        )}
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div className="w-full h-full">
          <FileThumbnail file={file} />
        </div>

       
        {isSending && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[1px]">
          <div
  className="relative w-12 h-12 rounded-full flex items-center justify-center transition-[background] duration-200 ease-linear"
  style={{
    background: `conic-gradient(var(--color-accent-light) ${uploadProgress * 3.6}deg, rgba(255,255,255,0.15) 0)`,
  }}
>
            
              <div className="absolute inset-[3px] rounded-full bg-background-hover flex items-center justify-center">
                <span className="text-[10px] font-semibold text-text-primary">
                  {uploadProgress}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AttachmentCard;