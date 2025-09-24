import React from "react";
import { SubTabSwitcher } from "@/components/domains/user/tabs/SubTabs";
import { SubTabItem } from "../../tabs/tabs.type";
import PerfumeBookmarksLoader from "./PerfumeBookmarks";
import CommunityBookmarksLoader from "./CommunityBookmarks";
import { renderPerfumeBookmarks } from "./bookmarkSection.helper";
import { PerfumeBaseResponse } from "@/lib/hono/schemas/perfume.schema";

export const BookmarkSection = ({
  isMe,
  userId,
  initialPerfumeData,
}: {
  isMe?: boolean;
  userId: string;
  initialPerfumeData?: PerfumeBaseResponse[];
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
      content: <PerfumeBookmarksLoader userId={userId} />,
    },
    {
      key: "bookmarksPosts",
      label: "커뮤니티",
      content: <CommunityBookmarksLoader userId={userId} />,
    },
  ];

  return <SubTabSwitcher defaultKey="bookmarksPerfumes" tabs={tabsItem} />;
};
