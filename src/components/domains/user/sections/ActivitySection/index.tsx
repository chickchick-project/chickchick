"use client";

import React, { Suspense } from "react";
import { SubTabSwitcher } from "../../tabs/SubTabs";
import { SubTabItem } from "../../tabs/tabs.type";

import {
  LikePerfumeListLoader,
  LikePostListLoader,
  MyCommentsListLoader,
  MyPostListLoader,
  MyReviewListLoader,
} from "./loader";
import { SkeletonBookmark } from "../Skeleton";
import { useRouter, useSearchParams } from "next/navigation";

const ACTIVITY_TAB_KEYS = [
  "myReviews",
  "myPosts",
  "myComments",
  "likedPerfumes",
  "likedPosts",
] as const;

type ActivityTabKey = (typeof ACTIVITY_TAB_KEYS)[number];

const isValidActivityTabKey = (key: string | null): key is ActivityTabKey => {
  return ACTIVITY_TAB_KEYS.includes(key as ActivityTabKey);
};

export const ActivitySection = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentTab = searchParams.get("tab");

  const activeTab: ActivityTabKey = isValidActivityTabKey(currentTab)
    ? currentTab
    : "myReviews";

  const TAB_LABELS: Record<ActivityTabKey, string> = {
    myReviews: "나의 리뷰",
    myPosts: "내가 쓴 게시글",
    myComments: "내가 쓴 댓글",
    likedPerfumes: "좋아요 한 향수",
    likedPosts: "좋아요 한 글",
  };

  const tabItems: SubTabItem<ActivityTabKey>[] = ACTIVITY_TAB_KEYS.map(
    (key) => ({
      key: key,
      label: TAB_LABELS[key],
    })
  );
  const TABS: Record<ActivityTabKey, React.ReactNode> = {
    myReviews: (
      <Suspense fallback={<SkeletonBookmark />}>
        <MyReviewListLoader />
      </Suspense>
    ),
    myPosts: (
      <Suspense fallback={<SkeletonBookmark />}>
        <MyPostListLoader />
      </Suspense>
    ),
    myComments: (
      <Suspense fallback={<SkeletonBookmark />}>
        <MyCommentsListLoader />
      </Suspense>
    ),
    likedPerfumes: (
      <Suspense fallback={<SkeletonBookmark />}>
        <LikePerfumeListLoader />
      </Suspense>
    ),
    likedPosts: (
      <Suspense fallback={<SkeletonBookmark />}>
        <LikePostListLoader />
      </Suspense>
    ),
  };

  const handleTabChange = (key: ActivityTabKey) => {
    router.replace(`?tab=${key}`, { scroll: false });
  };

  return (
    <>
      <SubTabSwitcher<ActivityTabKey>
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={tabItems}
      />

      {TABS[activeTab]}
    </>
  );
};
