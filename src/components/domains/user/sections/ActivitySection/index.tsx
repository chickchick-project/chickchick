"use client";

import React, { useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { SubTabSwitcher } from "../../tabs/SubTabs";
import { useUrlTabs } from "../../useUrlTabs";

import { SkeletonCard, SkeletonComment, SkeletonPerfume } from "../Skeleton";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

const MyReviewListLoader = dynamic(
  () => import("./loader/MyReviewListLoader"),
  {
    ssr: false,
    loading: () => <SkeletonCard />,
  }
);
const MyPostListLoader = dynamic(() => import("./loader/MyPostListLoader"), {
  ssr: false,
  loading: () => <SkeletonCard />,
});
const LikePerfumeListLoader = dynamic(
  () => import("./loader/LikePerfumeListLoader"),
  {
    ssr: false,
    loading: () => <SkeletonPerfume />,
  }
);
const LikePostListLoader = dynamic(
  () => import("./loader/LikePostListLoader"),
  {
    ssr: false,
    loading: () => <SkeletonCard />,
  }
);
const MyCommentsListLoader = dynamic(
  () => import("./loader/MyCommentsListLoader"),
  {
    ssr: false,
    loading: () => <SkeletonComment />,
  }
);

const ACTIVITY_TABS_CONFIG = [
  {
    key: "myReviews",
    label: "나의 리뷰",
    component: <MyReviewListLoader />,
  },
  {
    key: "myPosts",
    label: "내가 쓴 게시글",
    component: <MyPostListLoader />,
  },
  {
    key: "likedPerfumes",
    label: "좋아요 한 향수",
    component: <LikePerfumeListLoader />,
  },
  {
    key: "likedPosts",
    label: "좋아요 한 글",
    component: <LikePostListLoader />,
  },
  {
    key: "myComments",
    label: "내가 쓴 댓글",
    component: <MyCommentsListLoader />,
  },
] as const;

type ActivityTabKey = (typeof ACTIVITY_TABS_CONFIG)[number]["key"];

export const ActivitySection = () => {
  const subTabRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const tabConfigs = useMemo(
    () => ACTIVITY_TABS_CONFIG.map(({ key, label }) => ({ key, label })),
    []
  );

  const { activeTab, handleTabChange, tabItems } = useUrlTabs<ActivityTabKey>(
    tabConfigs,
    "myReviews"
  );

  const TABS = ACTIVITY_TABS_CONFIG.reduce((acc, tab) => {
    acc[tab.key] = tab.component;
    return acc;
  }, {} as Record<ActivityTabKey, React.ReactNode>);

  return (
    <>
      <SubTabSwitcher<ActivityTabKey>
        ref={subTabRef}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={tabItems}
        autoScrollOnChange={isMobile}
        scrollBehavior="smooth"
        scrollDelayMs={0}
      />
      <div className="p-6">{TABS[activeTab]}</div>
    </>
  );
};
