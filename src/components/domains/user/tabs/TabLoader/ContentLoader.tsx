import type { User } from "@prisma/client";
import { fetchMockActivityData } from "@/lib/mocks/fetchUser";
import {
  BookmarkSection,
  CollectionSection,
  ActivitySection,
  ProfileSection,
} from "../../sections";
import {
  fetchUserBookmarksPerfumes,
  fetchUserCollections,
} from "@/components/domains/user/user.helper";
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
    const collections = await fetchUserCollections(pageOwner.id);
    return <CollectionSection data={collections.data} />;
  }

  if (tap === "bookmarks") {
    const response = await fetchUserBookmarksPerfumes(pageOwner.id);
    const transformedData = response.data.map((perfume) => ({
      id: perfume.id,
      nameEn: perfume.nameEn,
      nameKo: perfume.nameKo,
      brand: perfume.brand,
      perfumeImage: perfume.perfumeImage,
    }));
    return (
      <BookmarkSection
        isMe={isMe}
        userId={pageOwner.id}
        initialPerfumeData={transformedData}
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
