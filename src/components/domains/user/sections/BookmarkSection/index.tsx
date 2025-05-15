import React from "react";
import { SubTabSwitcher } from "@/components/domains/user/tabs/SubTabs";
import { BookmarkData } from "../sections.type";
import { SubTabItem } from "../../tabs/tabs.type";
import {
  renderPerfumeBookmarks,
  renderCommunityBookmarks,
} from "./bookmarkSection.helper";

export const BookmarkSection = ({
  data,
  isMe,
}: {
  data: BookmarkData;
  isMe?: boolean;
}) => {
  if (!isMe) {
    // 타인의 프로필: 향수만 표시
    return renderPerfumeBookmarks(data.perfumes);
  }

  // 나의 프로필: 향수 및 커뮤니티 북마크를 탭으로 표시
  const tabsItem: SubTabItem[] = [
    {
      key: "bookmarksPerfumes",
      label: "향수",
      content: renderPerfumeBookmarks(data.perfumes),
    },
    {
      key: "bookmarksPosts",
      label: "커뮤니티",
      content: renderCommunityBookmarks(data.community),
    },
  ];

  return <SubTabSwitcher defaultKey="bookmarksPerfumes" tabs={tabsItem} />;
};
