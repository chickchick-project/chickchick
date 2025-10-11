import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud } from "lucide-react";

interface PhotoDropzoneProps {
  onFileSelect: (file: File) => void;
  previewUrl: string | null;
}

export function PhotoDropzone({
  onFileSelect,
  previewUrl,
}: PhotoDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive
          ? "border-primary-300 bg-primary-50"
          : "border-gray-300 hover:border-primary-200"
      }`}
    >
      <input {...getInputProps()} />
      {previewUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt="미리보기"
          className="max-h-60 w-auto mx-auto rounded-md object-contain"
        />
      ) : (
        <div className="text-gray-500">
          <UploadCloud className="mx-auto mb-2" size={48} />
          <p className="font-semibold">
            {isDragActive
              ? "이제 여기에 파일을 놓으세요!"
              : "사진을 업로드하려면 클릭하거나 파일을 드래그하세요."}
          </p>
          <p className="text-xs mt-1">PNG, JPG, GIF up to 10MB</p>
        </div>
      )}
    </div>
  );
}
