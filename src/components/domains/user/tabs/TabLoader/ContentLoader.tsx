/**
 * @deprecated 이 파일은 병렬 라우팅으로 마이그레이션되면서 더 이상 사용되지 않습니다.
 *
 * 병렬 라우팅 이전에는 이 컴포넌트가 탭별로 조건부 렌더링을 담당했지만,
 * 이제 각 슬롯(@collection, @bookmarks, @activity, @profile)에서
 * 직접 데이터 로딩과 렌더링을 처리합니다.
 *
 * 관련 파일:
 * - src/app/user/[id]/@collection/page.tsx
 * - src/app/user/[id]/@bookmarks/page.tsx
 * - src/app/user/[id]/@activity/page.tsx
 * - src/app/user/[id]/@profile/page.tsx
 */

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
        <CollectionSection pageOwner={pageOwner} initialCollectionData={[]} />
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
