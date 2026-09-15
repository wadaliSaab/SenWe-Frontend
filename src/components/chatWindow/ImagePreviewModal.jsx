import React, { useEffect, useCallback, useState } from "react";
import { X, Download, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";


function ImagePreviewModal({ images, initialIndex = 0, onClose }) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const count = images.length;
  const activeImage = images[activeIndex];
  const hasMultiple = count > 1;

  const goPrev = useCallback(() => {
    setIsImageLoading(true);
    setActiveIndex((i) => (i === 0 ? count - 1 : i - 1));
  }, [count]);

  const goNext = useCallback(() => {
    setIsImageLoading(true);
    setActiveIndex((i) => (i === count - 1 ? 0 : i + 1));
  }, [count]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowLeft" && hasMultiple) goPrev();
      if (e.key === "ArrowRight" && hasMultiple) goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, goPrev, goNext, hasMultiple]);


  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const handleDownload = async () => {
    if (!activeImage) return;
    setIsDownloading(true);
    try {
      const response = await fetch(activeImage.filePath);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = activeImage.fileName || `image-${activeIndex + 1}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!activeImage) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      onClick={onClose}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-sm font-medium text-white/70">
          {hasMultiple ? `${activeIndex + 1} / ${count}` : activeImage.fileName}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            aria-label="Download image"
            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60 sm:px-4"
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Download</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="rounded-full border border-white/15 bg-white/10 p-2 text-white transition-colors duration-150 hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Image stage */}
      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-4 sm:px-6"
        onClick={(e) => e.stopPropagation()}
      >
        {hasMultiple && (
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 bg-white/10 p-2 text-white transition-colors duration-150 hover:bg-white/20 sm:left-4 sm:p-3"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        )}

        {isImageLoading && (
          <Loader2 className="absolute h-8 w-8 animate-spin text-white/60" />
        )}

        <img
          key={activeImage._id}
          src={activeImage.filePath}
          alt={activeImage.fileName || `Photo ${activeIndex + 1}`}
          onLoad={() => setIsImageLoading(false)}
          className={`max-h-[75vh] max-w-[90vw] rounded-lg object-contain shadow-2xl transition-opacity duration-200 sm:max-w-[85vw] ${
            isImageLoading ? "opacity-0" : "opacity-100"
          }`}
        />

        {hasMultiple && (
          <button
            type="button"
            onClick={goNext}
            aria-label="Next image"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/15 bg-white/10 p-2 text-white transition-colors duration-150 hover:bg-white/20 sm:right-4 sm:p-3"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      {hasMultiple && (
        <div
          className="flex justify-center gap-2 overflow-x-auto px-4 pb-4"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((image, index) => (
            <button
              key={image._id}
              type="button"
              onClick={() => {
                setIsImageLoading(true);
                setActiveIndex(index);
              }}
              aria-label={`Go to image ${index + 1}`}
              className={`h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors duration-150 ${
                index === activeIndex
                  ? "border-white"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <img
                src={image.filePath}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImagePreviewModal;