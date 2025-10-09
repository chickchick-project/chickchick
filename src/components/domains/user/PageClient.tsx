"use client";

import React, { useState } from "react";
import MainTabs from "./tabs/MainTabs";
import PhotoUploadModal from "@/components/modal/photoUploadModal";
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
      />
      <div className="bg-white rounded-lg border-gray-200 border p-10">
        {children}
        <PhotoUploadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      </div>
    </>
  );
}
