"use client";

import Image from "next/image";
import { User } from "@zod/modelSchema";
import ImageDetailModal from "@/components/modal/imageDetailModal";
import { useImageDetailModal } from "@/components/modal/imageDetailModal/useImageDetailModal";
import type { CollectionItem } from "../sections.type";
import { useUserCollections } from "./useUserCollections";
import { SkeletonMasonry } from "../Skeleton/SkeletonMasonry";

export const CollectionSection = ({
  pageOwner,
  initialCollectionData,
}: {
  pageOwner: User;
  initialCollectionData: CollectionItem[];
}) => {
  const {
    isOpen,
    imageUrl,
    comment,
    perfumeName,
    openModal,
    closeModal,
    handleSave,
  } = useImageDetailModal();
  const {
    data: collectionsData,
    isLoading,
    error,
  } = useUserCollections(pageOwner.id, initialCollectionData);

  if (error) {
    console.error("CollectionSection error:", error);
    return (
      <div className="flex justify-center items-center h-[200px]">
        <p>컬렉션을 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }

  if (isLoading) {
    return <SkeletonMasonry />;
  }

  if (!collectionsData) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <p>컬렉션 데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  if (!collectionsData.data || collectionsData.data.length === 0) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <p>저장된 컬렉션이 없습니다.</p>
      </div>
    );
  }

  const displayData = collectionsData.data;
  // const displayData = Array(5)
  //   .fill(null)
  //   .flatMap(() => collectionsData.data);

  return (
    <>
      <div className="h-[800px] overflow-y-auto pr-1">
        <div className="columns-4 gap-4">
          {displayData.map((item: CollectionItem, index: number) => (
            <CollectionItem
              key={`${item.id}-${index}`}
              item={item}
              index={index}
              openModal={openModal}
            />
          ))}
        </div>
      </div>

      {isOpen && (
        <ImageDetailModal
          imageUrl={imageUrl}
          comment={comment}
          perfumeName={perfumeName}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </>
  );
};

function CollectionItem({
  item,
  index,
  openModal,
}: {
  item: CollectionItem;
  index: number;
  openModal: (imageUrl: string, comment: string, perfumeName: string) => void;
}) {
  const perfumeName = item.perfume?.nameKo || item.perfume?.nameEn || "";
  if (!item.image?.width || !item.image?.height) {
    return null;
  }

  return (
    <div
      key={`${item.id}-${index}`}
      data-key={`${item.id}-${index}`}
      className="group rounded-lg bg-gray-100 overflow-hidden break-inside-avoid mb-4"
      onClick={() => {
        if (item.image?.imageUrl) {
          openModal(item.image.imageUrl, item.comment || "", perfumeName);
        }
      }}
    >
      <div className="relative w-full cursor-pointer">
        <Image
          src={item.image.imageUrl}
          width={item.image.width}
          height={item.image.height}
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          alt={item.comment || "collection image"}
          className="w-full h-auto transition-transform duration-200 group-hover:scale-105"
          priority={index < 8}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <p className="text-white text-sm line-clamp-2">{perfumeName}</p>
        </div>
      </div>
    </div>
  );
}
