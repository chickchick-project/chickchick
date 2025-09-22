"use client";

import Image from "next/image";
import { SkeletonMasonry } from "./SkeletonMasonry";
import { CollectionItem } from "../sections.type";
import ImageDetailModal from "@/components/modal/imageDetailModal";
import { useImageDetailModal } from "@/components/modal/imageDetailModal/useImageDetailModal";

export const CollectionSection = ({ data }: { data: CollectionItem[] }) => {
  const { isOpen, imageUrl, comment, openModal, closeModal, handleSave } =
    useImageDetailModal();

  return (
    <>
      <div className="h-[800px] overflow-y-auto pr-1">
        {data.length < 1 ? (
          <SkeletonMasonry />
        ) : (
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
        )}
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
