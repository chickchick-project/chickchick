import { ModalContainer } from "@/components/modal/ModalContainer";
import Image from "next/image";
import { useState, useEffect } from "react";

interface ImageDetailModalProps {
  imageUrl: string;
  comment: string;
  perfumeName?: string;
  onClose: () => void;
  onSave: (newComment: string) => void;
}

const ImageDetailModal = ({
  imageUrl,
  comment,
  perfumeName,
  onClose,
  onSave,
}: ImageDetailModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment);

  useEffect(() => {
    setEditedComment(comment);
  }, [comment]);

  const handleSave = () => {
    onSave(editedComment);
    setIsEditing(false);
  };

  return (
    <ModalContainer closeModal={onClose}>
      <div className="p-8 flex flex-col items-center">
        <Image
          src={imageUrl}
          alt="detail image"
          width={500}
          height={500}
          style={{ objectFit: "contain" }}
        />
        {perfumeName && (
          <div className="mt-4 w-full text-center">
            <h3 className="text-lg font-semibold text-gray-800">{perfumeName}</h3>
          </div>
        )}
        <div className="mt-4 w-full text-center">
          {isEditing ? (
            <div className="flex flex-col items-center gap-2">
              <input
                type="text"
                value={editedComment}
                onChange={(e) => setEditedComment(e.target.value)}
                className="border rounded px-2 py-1 w-full max-w-sm"
                placeholder="코멘트를 입력하세요"
              />
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-1 rounded"
              >
                저장
              </button>
            </div>
          ) : (
            <p
              onClick={() => setIsEditing(true)}
              className="cursor-pointer text-gray-600 hover:text-gray-800"
            >
              {comment || "클릭하여 코멘트를 추가하세요"}
            </p>
          )}
        </div>
      </div>
    </ModalContainer>
  );
};

export default ImageDetailModal;
