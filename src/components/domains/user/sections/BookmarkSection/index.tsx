"use client";

import React, { Suspense, useState } from "react";
import { SubTabSwitcher } from "@/components/domains/user/tabs/SubTabs";
import { SubTabItem } from "../../tabs/tabs.type";
import PerfumeBookmarksLoader from "./PerfumeBookmarks";
import CommunityBookmarksLoader from "./CommunityBookmarks";
import { PerfumeBaseResponse } from "@/lib/hono/schemas/perfume.schema";
import { SkeletonBookmark } from "../Skeleton";
import { PerfumeBookmarkList } from "./bookmarkSection.components";

export const BookmarkSection = ({
  isMe,
  userId,
  initialPerfumeData,
}: {
  isMe?: boolean;
  userId: string;
  initialPerfumeData?: PerfumeBaseResponse[];
}) => {
  const [activeTab, setActiveTab] = useState("bookmarksPerfumes");

  if (!isMe) {
    // 타인의 프로필: 향수만 표시
    return <PerfumeBookmarkList perfumes={initialPerfumeData || []} />;
  }

  // 나의 프로필: 향수 및 커뮤니티 북마크를 탭으로 표시
  const tabsItem: SubTabItem[] = [
    {
      key: "bookmarksPerfumes",
      label: "향수",
    },
    {
      key: "bookmarksPosts",
      label: "커뮤니티",
    },
  ];

  const TABS: { [key: string]: React.ReactNode } = {
    bookmarksPerfumes: (
      <Suspense fallback={<SkeletonBookmark />}>
        <PerfumeBookmarksLoader
          userId={userId}
          initialData={initialPerfumeData}
        />
      </Suspense>
    ),
    bookmarksPosts: (
      <Suspense fallback={<SkeletonBookmark />}>
        <CommunityBookmarksLoader />
      </Suspense>
    ),
  };

  return (
    <>
      <SubTabSwitcher
        activeTab={activeTab}
        onTabChange={(key) => setActiveTab(key)}
        tabs={tabsItem}
      />

      <div className="mt-6">{TABS[activeTab]}</div>
    </>
  );
};
