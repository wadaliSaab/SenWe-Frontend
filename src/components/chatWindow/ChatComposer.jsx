import React, { useState } from "react";
import InputArea from "./InputArea";
import AttachmentPreview from "../ui/AttachmentPreview";

function ChatComposer() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSending, setIsSending] = useState(false);       
  const [uploadProgress, setUploadProgress] = useState(0); 

  const handleRemoveFile = (id) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
  };

  return (
    <div className="relative w-full items-center flex justify-center sm:px-4 px-2">
      <AttachmentPreview
        files={selectedFiles}
        onRemove={handleRemoveFile}
        isSending={isSending}          
        uploadProgress={uploadProgress} 
      />

      <InputArea
        setSelectedFiles={setSelectedFiles}
        selectedFiles={selectedFiles}
        isSending={isSending}                 
        setIsSending={setIsSending}           
        setUploadProgress={setUploadProgress}  
      />
    </div>
  );
}

export default ChatComposer;