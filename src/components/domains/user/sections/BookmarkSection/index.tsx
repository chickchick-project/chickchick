import React, { Suspense } from "react";
import { SubTabSwitcher } from "@/components/domains/user/tabs/SubTabs";
import { SubTabItem } from "../../tabs/tabs.type";
import { SkeletonBookmark } from "./SkeletonBookmark";
import PerfumeBookmarksLoader from "./PerfumeBookmarks";
import CommunityBookmarksLoader from "./CommunityBookmarks";
import { renderPerfumeBookmarks } from "./bookmarkSection.helper";
import { MockPerfumeBookmark } from "@/lib/mocks/fetchUser";

export const BookmarkSection = ({
  isMe,
  userId,
  initialPerfumeData,
}: {
  isMe?: boolean;
  userId: string;
  initialPerfumeData?: MockPerfumeBookmark[];
}) => {
  if (!isMe) {
    // 타인의 프로필: 향수만 표시
    return renderPerfumeBookmarks(initialPerfumeData || []);
  }

  // 나의 프로필: 향수 및 커뮤니티 북마크를 탭으로 표시
  const tabsItem: SubTabItem[] = [
    {
      key: "bookmarksPerfumes",
      label: "향수",
      content: (
        <Suspense fallback={<SkeletonBookmark />}>
          <PerfumeBookmarksLoader userId={userId} />
        </Suspense>
      ),
    },
    {
      key: "bookmarksPosts",
      label: "커뮤니티",
      content: (
        <Suspense fallback={<SkeletonBookmark />}>
          <CommunityBookmarksLoader userId={userId} />
        </Suspense>
      ),
    },
  ];

  return <SubTabSwitcher defaultKey="bookmarksPerfumes" tabs={tabsItem} />;
};
