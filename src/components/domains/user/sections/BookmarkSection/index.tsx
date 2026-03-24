"use client";

import React, { useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { SubTabSwitcher } from "@/components/domains/user/tabs/SubTabs";
import { useUrlTabs } from "../../useUrlTabs";
import { SkeletonCard, SkeletonPerfume } from "../../components/skeletons";
import { useMediaQuery } from "@/client/hooks/useMediaQuery";
const PerfumeBookmarksLoader = dynamic(
  () => import("./loader/PerfumeBookmarksLoader"),
  {
    ssr: false,
    loading: () => <SkeletonPerfume />,
  }
);

const CommunityBookmarksLoader = dynamic(
  () => import("./loader/CommunityBookmarksLoader"),
  {
    ssr: false,
    loading: () => <SkeletonCard />,
  }
);

const BOOKMARK_TABS_CONFIG = [
  {
    key: "bookmarkPerfumes",
    label: "향수",
    component: (userId: string) => <PerfumeBookmarksLoader userId={userId} />,
  },
  {
    key: "bookmarkPosts",
    label: "커뮤니티",
    component: () => <CommunityBookmarksLoader />,
  },
] as const;

type BookmarkTabKey = (typeof BOOKMARK_TABS_CONFIG)[number]["key"];

export const BookmarkSection = ({
  isMe,
  userId,
}: {
  isMe?: boolean;
  userId: string;
}) => {
  const subTabRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const tabConfigs = useMemo(
    () => BOOKMARK_TABS_CONFIG.map(({ key, label }) => ({ key, label })),
    []
  );

  const { activeTab, handleTabChange, tabItems } = useUrlTabs<BookmarkTabKey>(
    tabConfigs,
    "bookmarkPerfumes"
  );

  const TABS = BOOKMARK_TABS_CONFIG.reduce((acc, tab) => {
    if (tab.key === "bookmarkPerfumes") {
      acc[tab.key] = tab.component(userId);
    } else {
      acc[tab.key] = tab.component();
    }
    return acc;
  }, {} as Record<BookmarkTabKey, React.ReactNode>);

  if (!isMe) {
    return <PerfumeBookmarksLoader userId={userId} />;
  }

  return (
    <>
      <SubTabSwitcher<BookmarkTabKey>
        ref={subTabRef}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={tabItems}
        autoScrollOnChange={isMobile}
        scrollBehavior="smooth"
        scrollDelayMs={0}
      />
      <div className="mt-6">{TABS[activeTab]}</div>
    </>
  );
};
