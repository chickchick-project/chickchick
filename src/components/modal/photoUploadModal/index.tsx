import React, { useCallback, useEffect, useState } from "react";
import ModalPortal from "@/lib/portal/ModalPortal";
import { ModalContainer } from "../ModalContainer";
import { PhotoDropzone } from "./PhotoDropzone";
import { PerfumeTagger } from "./PerfumeTagger";
import { uploadPhotoCollection } from "./photoUpload.helper";
import { PerfumeSimpleResponse } from "@/lib/hono/schemas/perfume.schema";

interface PhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

function PhotoUploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
}: PhotoUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [selectedPerfume, setSelectedPerfume] =
    useState<PerfumeSimpleResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 모달이 닫힐 때 상태 초기화
  const resetState = useCallback(() => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setComment("");
    setSelectedPerfume(null);
    setIsLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => resetState(), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, resetState]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = useCallback(
    (file: File) => {
      setSelectedFile(file);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(URL.createObjectURL(file));
    },
    [previewUrl]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("사진을 선택해주세요.");
      return;
    }
    if (!selectedPerfume) {
      setError("사진 속 향수를 태그해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await uploadPhotoCollection({
        file: selectedFile,
        comment,
        perfume: selectedPerfume,
      });

      onUploadSuccess();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <ModalContainer closeModal={onClose}>
      <div
        className="bg-white rounded-lg p-10 w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            내 향수 컬렉션 등록
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <PhotoDropzone
            onFileSelect={handleFileSelect}
            previewUrl={previewUrl}
          />

          <PerfumeTagger
            selectedPerfume={selectedPerfume}
            onSelectionChange={setSelectedPerfume}
          />

          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              코멘트 (선택사항)
            </label>
            <textarea
              id="comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="이 향수와 관련된 나만의 추억이나 느낌을 기록해보세요."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-200 focus:border-primary-200"
            />
          </div>

          <div className="p-3 bg-gray-50 rounded-md text-xs text-gray-600">
            <p>
              <strong>📷 사진 등록 안내</strong>
            </p>
            <ul className="list-disc list-inside mt-1">
              <li>
                직접 촬영한 향수 사진을 공유하며 당신의 컬렉션을 자랑해보세요.
              </li>
              <li>
                타인의 사진 도용 등 부적절한 이미지는 사전 통보 없이 삭제될 수
                있습니다.
              </li>
            </ul>
          </div>

          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          <div className="mt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading || !selectedFile}
              className="px-4 py-2 bg-primary-200 text-white rounded-md hover:bg-primary-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              )}
              {isLoading ? "업로드 중..." : "등록하기"}
            </button>
          </div>
        </form>
      </div>
    </ModalContainer>
  );

  return <ModalPortal>{modalContent}</ModalPortal>;
}

export default PhotoUploadModal;
