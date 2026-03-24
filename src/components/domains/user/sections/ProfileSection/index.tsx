"use client";

import { useState, useCallback, useEffect } from "react";
import { PersonalInfo } from "./components/PersonalInfo";
import { ProfileImage } from "./components/ProfileImage";
import { useUploadProfileImage, useUserProfile } from "@/client/hooks/query/useUserQuery";
import { ProfileSectionSkeleton } from "./components/ProfileSectionSkeleton";
import { PROFILE_BUCKET_NAME } from "@/shared/constants/buckets";

export const ProfileSection = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { data: user, isLoading } = useUserProfile();
  const uploadProfileImageMutation = useUploadProfileImage();

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

  const onSaveImage = () => {
    if (selectedFile) {
      uploadProfileImageMutation.mutate(
        { file: selectedFile, bucketName: PROFILE_BUCKET_NAME },
        {
          onSuccess: () => {
            resetState();
          },
        }
      );
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (isLoading) {
    return <ProfileSectionSkeleton />;
  }

  return (
    <div className="w-full flex flex-row items-start gap-12 p-[120px]">
      <div className="w-1/3 flex-shrink-0">
        <ProfileImage
          initialImage={user?.imageUrl}
          previewUrl={previewUrl}
          onSaveImage={onSaveImage}
          onFileSelect={onFileSelect}
          onCancel={onCancel}
          isUploading={uploadProfileImageMutation.isPending}
        />
      </div>
      <div className="w-2/3 flex-grow">
        {user && <PersonalInfo {...user} />}
      </div>
    </div>
  );
};
