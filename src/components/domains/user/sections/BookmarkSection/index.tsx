"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { SubTabSwitcher } from "@/components/domains/user/tabs/SubTabs";
import { SubTabItem } from "../../tabs/tabs.type";
import { ApiPerfumeSimpleResponse } from "@/lib/hono/schemas/perfume.schema";
import { SkeletonCard, SkeletonPerfume } from "../Skeleton";
import { PerfumeBookmarkList } from "./components";

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
  },
  {
    key: "bookmarkPosts",
    label: "커뮤니티",
  },
];

type BookmarkTabKey = (typeof BOOKMARK_TABS_CONFIG)[number]["key"];

const isValidBookmarkTabKey = (key: string | null): key is BookmarkTabKey => {
  return BOOKMARK_TABS_CONFIG.some((tab) => tab.key === key);
};

export const BookmarkSection = ({
  isMe,
  userId,
  initialPerfumeData,
}: {
  isMe?: boolean;
  userId: string;
  initialPerfumeData?: ApiPerfumeSimpleResponse[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!isMe) {
    return <PerfumeBookmarkList perfumes={initialPerfumeData || []} />;
  }

  const currentTab = searchParams.get("tab");

  const activeTab: BookmarkTabKey = isValidBookmarkTabKey(currentTab)
    ? currentTab
    : "bookmarkPerfumes";

  const tabsItem: SubTabItem<BookmarkTabKey>[] = BOOKMARK_TABS_CONFIG.map(
    ({ key, label }) => ({
      key,
      label,
    })
  );

  const TABS: Record<BookmarkTabKey, React.ReactNode> = {
    bookmarkPerfumes: (
      <PerfumeBookmarksLoader
        userId={userId}
        initialData={initialPerfumeData}
      />
    ),
    bookmarkPosts: <CommunityBookmarksLoader />,
  };

  const handleTabChange = (key: BookmarkTabKey) => {
    router.replace(`?tab=${key}`, { scroll: false });
  };

  return (
    <div className="h-[800px] overflow-y-auto pr-1">
      <SubTabSwitcher<BookmarkTabKey>
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={tabsItem}
      />

      <div className="mt-6">{TABS[activeTab]}</div>
    </div>
  );
};
