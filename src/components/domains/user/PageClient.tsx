import { ActivitySection } from "./sections/ActivitySection";
import { CollectionSection } from "./sections/CollectionSection";
import { BookmarkSection } from "./sections/BookmarkSection";
import { ProfileSection } from "./sections/ProfileSection";
import MainTabs from "./tabs/MainTabs";
import {
  ActivityData,
  BookmarkData,
  CollectionItem,
  ProfileItem,
  TabData,
} from "./sections/type";

interface PageClientProps {
  tap: TabData["tap"];
  data: TabData["data"];
  isMe?: boolean;
  selectedUser?: { id: string; nickname: string };
}

export default function ClientComponent({
  tap,
  data,
  isMe,
  selectedUser,
}: PageClientProps) {
  return (
    <>
      <MainTabs selectedUser={selectedUser} isMe={isMe} tab={tap} />
      <div className="bg-white rounded-lg border-gray-200 border p-10">
        {tap === "collection" && (
          <CollectionSection data={data as CollectionItem[]} />
        )}
        {tap === "bookmarks" && (
          <BookmarkSection isMe={isMe} data={data as BookmarkData} />
        )}
        {isMe && tap === "activity" && (
          <ActivitySection data={data as ActivityData} />
        )}
        {isMe && tap === "profile" && (
          <ProfileSection data={data as ProfileItem} />
        )}
      </div>
    </>
  );
}
