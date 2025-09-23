import type { User } from "@prisma/client";
import {
  fetchMockActivityData,
  fetchMockPerfumeBookmarksData,
  MockPerfumeBookmark,
} from "@/lib/mocks/fetchUser";
import {
  BookmarkSection,
  CollectionSection,
  ActivitySection,
  ProfileSection,
} from "../../sections";
import { fetchUserCollections } from "@/components/domains/user/user.helper";

interface TabContentLoaderProps {
  tap: string;
  pageOwner: User;
  isMe: boolean;
}

export default async function TabContentLoader({
  tap,
  pageOwner,
  isMe,
}: TabContentLoaderProps) {
  if (tap === "collection") {
    const result = await fetchUserCollections(pageOwner.id);
    const data = result.success ? result.data || [] : [];
    return <CollectionSection data={data} />;
  }

  if (tap === "bookmarks") {
    let initialPerfumeData: MockPerfumeBookmark[] | undefined = undefined;
    if (!isMe) {
      initialPerfumeData = await fetchMockPerfumeBookmarksData(pageOwner.id);
    }
    return (
      <BookmarkSection
        isMe={isMe}
        userId={pageOwner.id}
        initialPerfumeData={initialPerfumeData}
      />
    );
  }

  if (tap === "activity") {
    const data = await fetchMockActivityData(pageOwner.id);
    return <ActivitySection data={data} />;
  }

  if (tap === "profile") {
    return <ProfileSection data={pageOwner} />;
  }

  return null;
}
