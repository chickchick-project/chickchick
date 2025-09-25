"use client";

import React, { Suspense, useState } from "react";
import { SubTabSwitcher } from "@/components/domains/user/tabs/SubTabs";
import { SubTabItem } from "../../tabs/tabs.type";
import PerfumeBookmarksLoader from "./PerfumeBookmarks";
import CommunityBookmarksLoader from "./CommunityBookmarks";
import { renderPerfumeBookmarks } from "./bookmarkSection.helper";
import { PerfumeBaseResponse } from "@/lib/hono/schemas/perfume.schema";
import { SkeletonBookmark } from "../Skeleton";

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
    return renderPerfumeBookmarks(initialPerfumeData || []);
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

  return (
    <>
      <SubTabSwitcher
        activeTab={activeTab}
        onTabChange={(key) => setActiveTab(key)}
        tabs={tabsItem}
      />

      <div className="mt-6">
        <Suspense fallback={<TabSkeletonSelector />}>
          {activeTab === "bookmarksPerfumes" && (
            <Suspense fallback={<SkeletonBookmark />}>
              <PerfumeBookmarksLoader userId={userId} />
            </Suspense>
          )}
          {activeTab === "bookmarksPosts" && (
            <Suspense fallback={<SkeletonBookmark />}>
              <CommunityBookmarksLoader userId={userId} />
            </Suspense>
          )}
        </Suspense>
      </div>
    </>
  );
};

function TabSkeletonSelector() {
  return <SkeletonBookmark />;
}
