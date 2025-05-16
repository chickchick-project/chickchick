"use client";

import { ActivitySection } from "./sections/ActivitySection";
import { CollectionSection } from "./sections/CollectionSection";
import { BookmarkSection } from "./sections/BookmarkSection";
import { ProfileSection } from "./sections/ProfileSection";
import MainTabs from "./tabs/MainTabs";
import {
  ActivityData,
  BookmarkData,
  CollectionItem,
  TabData,
} from "./sections/sections.type";
import { useUserStore } from "@/lib/stores/useUserStore";
import { users } from "@prisma/client";

interface PageClientProps {
  tap: TabData["tap"];
  data: TabData["data"];
}

export default function ClientComponent({ tap, data }: PageClientProps) {
  const user = useUserStore((state) => state.user);

  const isMe = user?.id === user?.id;

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
  ): data is users {
    return tap === "profile";
  }
  return (
    <>
      <MainTabs isMe={isMe} tab={tap} />
      <div className="bg-white rounded-lg border-gray-200 border p-10">
        {isCollectionData(data, tap) && <CollectionSection data={data} />}
        {isBookmarkData(data, tap) && (
          <BookmarkSection isMe={isMe} data={data} />
        )}
        {isActivityData(data, tap) && <ActivitySection data={data} />}
        {isProfileData(data, tap) && <ProfileSection data={data} />}
      </div>
    </>
  );
}
