import React, { useRef, useState, useEffect } from "react";
import { Camera, Loader2 } from "lucide-react";

import AppText from "../../../ui/AppText";
import AppButton from "../../../ui/AppButton";

import Avatar from "../../../ui/Avatar";
import { updateAvatar } from "../../../../services/userService";

export default function HeaderSection({ user, onUserUpdate, bio }) {
  const imageInputRef = useRef(null);

  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleCameraClick = () => {
    if (isUploading) return;
    imageInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");

    
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    setIsUploading(true);
    try {
      const updated = await updateAvatar(file);
    
      onUserUpdate?.(updated);
    } catch (err) {
      setUploadError(
        err?.response?.data?.message || "Failed to upload image."
      );
      setPreviewUrl(null); 
    } finally {
      setIsUploading(false);
      e.target.value = ""; 
    }
  };

  const displayImage =  user.avatar ;

  const profileBio =
    bio ||
    "Professional Verified User Professional Verified User Professional Verified User Professional Verified User ";

  const maxCharacters = isMobile ? 90 : 180;
  const shouldTruncate = profileBio.length > maxCharacters;
  const displayBio =
    !expanded && shouldTruncate
      ? `${profileBio.slice(0, maxCharacters)}...`
      : profileBio;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-2 sm:py-4">
      <div className="flex flex-col items-center">
        {/* Profile Image */}
        <div className="relative">
          <div className="relative">
            <img
              src={displayImage}
              alt="Profile"
              className="
              h-25
              w-25
              sm:h-40
              sm:w-40
              rounded-full
              object-cover
              object-top
            "
            />
          </div>

          <AppButton
            type="button"
            variant="icon"
            size="sm"
            disabled={isUploading}
            onClick={handleCameraClick}
            className="absolute bottom-1 right-1 p-0 sm:h-11 sm:w-11 h-6 w-6 rounded-full border border-white/20 shadow-xl backdrop-blur-sm"
          >
            {isUploading ? (
              <Loader2  className="animate-spin sm:size-4 size-3 text-white" />
            ) : (
              <Camera  className="text-white sm:size-4 size-3"  />
            )}
          </AppButton>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />
        </div>

        {uploadError && (
          <AppText variant="label2" className="mt-2 text-warning">
            {uploadError}
          </AppText>
        )}

        {/* Details */}
        <div className="mt-4 flex w-full sm:max-w-2xl max-w-xl flex-col items-center">
          <AppText as="h2" variant="heading" className="text-center  ">
            {user?.username}
          </AppText>

          <AppText className="mt-1 sm:text-xs text-2xs  text-center">{displayBio}</AppText>

          {shouldTruncate && (
            <AppButton
              variant="link"
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              className="mt-2 transition text-xs text-accent hover:underline"
            >
              {expanded ? "Read Less" : "Read More"}
            </AppButton>
          )}
        </div>
      </div>
    </div>
  );
}