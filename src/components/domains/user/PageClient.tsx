"use client";

import React, { useState } from "react";
import MainTabs from "./tabs/MainTabs";
import PhotoCollectionUploadModal from "@/components/modal/photocollectionUploadModal";
import { usePathname } from "next/navigation";

interface PageClientProps {
  isMe: boolean;
  children: React.ReactNode;
}

export default function PageClient({ isMe, children }: PageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleUploadSuccess = () => {
    setIsModalOpen(false);
  };

  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);
  const activeTab = pathSegments.length > 2 ? pathSegments[2] : "collection";

  return (
    <>
      <MainTabs
        isMe={isMe}
        tab={activeTab}
        onAddPhotoClick={() => setIsModalOpen(true)}
      >
        {children}
        <PhotoCollectionUploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      </MainTabs>
    </>
  );
}
