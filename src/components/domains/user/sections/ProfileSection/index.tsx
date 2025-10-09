"use client";

import { PersonalInfo } from "./components/PersonalInfo";
import { ProfileImage } from "./components/ProfileImage";
import { useState, useCallback, useEffect } from "react";

export const ProfileSection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const resetState = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
  }, []);

  const onFileSelect = useCallback(
    (file: File) => {
      setSelectedFile(file);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(file));
    },
    [previewUrl]
  );

  const onCancel = () => {
    resetState();
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="w-full flex flex-row items-start gap-12 p-[120px]">
      <div className="w-1/3 flex-shrink-0">
        <ProfileImage
          previewUrl={previewUrl}
          onFileSelect={onFileSelect}
          onCancel={onCancel}
          isUploading={false}
        />
      </div>
      <div className="w-2/3 flex-grow">
        <PersonalInfo />
      </div>
    </div>
  );
};
