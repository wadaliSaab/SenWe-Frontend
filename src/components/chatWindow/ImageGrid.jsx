import React, { useState } from "react";
import ImagePreviewModal from "./ImagePreviewModal";


function ImageGrid({ images }) {
  const [previewIndex, setPreviewIndex] = useState(null);
  const count = images.length;

  if (count === 0) return null;

  const openPreview = (index) => setPreviewIndex(index);
  const closePreview = () => setPreviewIndex(null);

  const Tile = ({ image, index, className = "", showOverlay = false }) => (
    <div
      key={image._id}
      className={`group relative overflow-hidden bg-background-secondary ${className}`}
    >
      <img
        src={image.filePath}
        alt={image.fileName || `Photo ${index + 1}`}
        loading="lazy"
        onClick={() => openPreview(index)}
        className="h-full w-full cursor-pointer object-cover transition-transform duration-300 ease-out group-hover:scale-105"
      />

      {showOverlay && (
        <div
          onClick={() => openPreview(index)}
          className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/55 text-2xl font-semibold text-white backdrop-blur-[1px] transition-colors duration-200 hover:bg-black/65"
        >
          +{count - 4}
        </div>
      )}
    </div>
  );

  return (
    <>
      {count === 1 && (
        <div className="overflow-hidden rounded-2xl">
          <img
            src={images[0].filePath}
            alt={images[0].fileName || "Photo"}
            loading="lazy"
            onClick={() => openPreview(0)}
            className="max-h-80 w-full cursor-pointer rounded-2xl object-cover"
          />
        </div>
      )}

      {count === 2 && (
        <div className="grid grid-cols-2 gap-1 overflow-hidden rounded-2xl">
          {images.map((image, index) => (
            <Tile key={image._id} image={image} index={index} className="aspect-square" />
          ))}
        </div>
      )}

      {count === 3 && (
        <div className="grid h-72 grid-cols-2 gap-1 overflow-hidden rounded-2xl">
          <Tile image={images[0]} index={0} className="h-full" />
          <div className="grid grid-rows-2 gap-1">
            <Tile image={images[1]} index={1} className="h-full" />
            <Tile image={images[2]} index={2} className="h-full" />
          </div>
        </div>
      )}

      {count >= 4 && (
        <div className="grid grid-cols-2 grid-rows-2 gap-1 overflow-hidden rounded-2xl">
          {images.slice(0, 4).map((image, index) => (
            <Tile
              key={image._id}
              image={image}
              index={index}
              className="aspect-square"
              showOverlay={count > 4 && index === 3}
            />
          ))}
        </div>
      )}

      {previewIndex !== null && (
        <ImagePreviewModal
          images={images}
          initialIndex={previewIndex}
          onClose={closePreview}
        />
      )}
    </>
  );
}

export default ImageGrid;