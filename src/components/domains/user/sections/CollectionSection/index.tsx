"use client";

import Image from "next/image";
import { CollectionItem } from "../sections.type";
import ImageDetailModal from "@/components/modal/imageDetailModal";
import { useImageDetailModal } from "@/components/modal/imageDetailModal/useImageDetailModal";

export const CollectionSection = ({ data }: { data: CollectionItem[] }) => {
  const { isOpen, imageUrl, comment, openModal, closeModal, handleSave } =
    useImageDetailModal();

  if (data.length < 1) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <p>저장된 컬렉션이 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="h-[800px] overflow-y-auto pr-1">
        <div className="columns-4 gap-4">
          {data.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="break-inside-avoid mb-4 relative cursor-pointer"
              style={{ height: "250px" }}
              onClick={() => {
                if (item.image?.imageUrl) {
                  openModal(item.image.imageUrl, item.comment || "");
                }
              }}
            >
              {item.image?.imageUrl && (
                <Image
                  key={item.image.id}
                  src={item.image.imageUrl}
                  width={item.image.width}
                  height={item.image.height}
                  alt="collection image"
                />
              )}
            </div>
          ))}
        </div>
      </div>
      {isOpen && (
        <ImageDetailModal
          imageUrl={imageUrl}
          comment={comment}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </>
  );
};
