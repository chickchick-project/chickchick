import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
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
  const queryClient = new QueryClient();
  if (tap === "collection") {
    await queryClient.prefetchQuery({
      queryKey: ["collections", pageOwner.id],
      queryFn: () => fetchUserCollections(pageOwner.id),
    });
    const dehydratedState = dehydrate(queryClient);
    return (
      <HydrationBoundary state={dehydratedState}>
        <CollectionSection pageOwner={pageOwner} />
      </HydrationBoundary>
    );
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
