import { useRef } from "react";
import { ActionButtons } from "./ActionButtons";
import { ImageDisplay } from "./ImageDisplay";

interface ProfileImageProps {
  initialImage?: string | null;
  previewUrl?: string | null;
  isUploading?: boolean;
  onFileSelect?: (file: File) => void;
  onCancel?: () => void;
}

export const ProfileImage = ({
  initialImage,
  previewUrl,
  isUploading = false,
  onFileSelect,
  onCancel,
}: ProfileImageProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 수정 버튼 클릭 시 숨겨진 파일 입력창을 트리거하는 함수
  const handleEditClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected file:", file.name);
      onFileSelect?.(file);
    }
  };
  const handleSave = () => {
    console.log("Save clicked");
    // onSaveImage();
  };
  const handleCancel = () => {
    onCancel?.();
  };
  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <ImageDisplay
        imageUrl={initialImage}
        previewUrl={previewUrl}
        onEditClick={handleEditClick}
      />

      {previewUrl && (
        <ActionButtons
          isUploading={isUploading}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
