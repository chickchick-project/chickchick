"use client";
import React, { useState } from "react";
import { User } from "@prisma/client";
import { ActivitySection } from "./sections/ActivitySection";
import { CollectionSection } from "./sections/CollectionSection";
import { BookmarkSection } from "./sections/BookmarkSection";
import { ProfileSection } from "./sections/ProfileSection";
import MainTabs from "./tabs/MainTabs";
import PhotoUploadModal from "@/components/modal/photoUploadModal";
import {
  ActivityData,
  BookmarkData,
  CollectionItem,
  TabData,
} from "./sections/sections.type";

interface PageClientProps {
  pageOwner: User;
  isMe: boolean;
  tap: TabData["tap"];
  data: TabData["data"];
}

export default function ClientComponent({
  pageOwner,
  isMe,
  tap,
  data,
}: PageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function isCollectionData(
    data: TabData["data"],
    tap: TabData["tap"]
  ): data is CollectionItem[] {
    return tap === "collection";
  }

  function isBookmarkData(
    data: TabData["data"],
    tap: TabData["tap"]
  ): data is BookmarkData {
    return tap === "bookmarks";
  }

  function isActivityData(
    data: TabData["data"],
    tap: TabData["tap"]
  ): data is ActivityData {
    return tap === "activity";
  }

  function isProfileData(
    data: TabData["data"],
    tap: TabData["tap"]
  ): data is User {
    return tap === "profile";
  }

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
        {isCollectionData(data, tap) && <CollectionSection data={data} />}
        {isBookmarkData(data, tap) && (
          <BookmarkSection isMe={isMe} data={data} />
        )}
        {isActivityData(data, tap) && <ActivitySection data={data} />}
        {isProfileData(data, tap) && <ProfileSection data={data} />}
      </div>
      <PhotoUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </>
  );
}
