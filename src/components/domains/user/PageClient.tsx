"use client";
import React, { Suspense, useState } from "react";
import { User } from "@prisma/client";
import MainTabs from "./tabs/MainTabs";
import PhotoUploadModal from "@/components/modal/photoUploadModal";
import { SkeletonMasonry } from "./sections/CollectionSection/SkeletonMasonry";
import { SkeletonBookmark } from "./sections/BookmarkSection/SkeletonBookmark";

interface PageClientProps {
  pageOwner: User;
  isMe: boolean;
  tap: string;
  children: React.ReactNode;
}

export default function ClientComponent({
  pageOwner,
  isMe,
  tap,
  children,
}: PageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUploadSuccess = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <MainTabs
        isMe={isMe}
        pageOwner={pageOwner}
        tab={tap}
        onAddPhotoClick={() => setIsModalOpen(true)}
      />
      <div className="bg-white rounded-lg border-gray-200 border p-10">
        <Suspense fallback={<TabSkeletonSelector tap={tap} />}>
          {children}
        </Suspense>
      </div>
      <PhotoUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </>
  );
}

function TabSkeletonSelector({ tap }: { tap: string }) {
  switch (tap) {
    case "collection":
      return <SkeletonMasonry />;
    case "bookmarks":
      return <SkeletonBookmark />;
    default:
      return null;
  }
}
