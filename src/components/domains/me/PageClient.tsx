import { TabData } from "@/app/me/[tap]/page";
import { ActivitySection } from "./sections/ActivitySection";
import { CollectionSection } from "./sections/CollectionSection";
import { BookmarkSection } from "./sections/BookmarkSection";
import { ProfileSection } from "./sections/ProfileSection";
import MainTabs from "./tabs/MainTabs";

type PageClientProps =
  | Extract<TabData, { tap: "collection" | "bookmarks" | "profile" }>
  | Extract<TabData, { tap: "activity" }>;

export default function ClientComponent(props: PageClientProps) {
  const { tap, data } = props;

  return (
    <>
      <MainTabs tab={tap} />
      <div className="bg-white rounded-lg border-gray-200 border p-10">
        {tap === "collection" ? (
          <CollectionSection data={data} />
        ) : tap === "bookmarks" ? (
          <BookmarkSection data={data} />
        ) : tap === "activity" ? (
          <ActivitySection data={data} />
        ) : (
          <ProfileSection data={data} />
        )}
      </div>
    </>
  );
}
