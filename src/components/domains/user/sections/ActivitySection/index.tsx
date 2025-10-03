"use client";

import React, { Suspense, useState } from "react";
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

const ACTIVITY_TAB_KEYS = [
  "myReviews",
  "myPosts",
  "myComments",
  "likedPerfumes",
  "likedPosts",
] as const;

type ActivityTabKey = (typeof ACTIVITY_TAB_KEYS)[number];

export const ActivitySection = () => {
  const [activeTab, setActiveTab] = useState<ActivityTabKey>("myReviews");

  // (선택사항) 각 키에 대한 라벨을 매핑하는 객체
  const TAB_LABELS: Record<ActivityTabKey, string> = {
    myReviews: "나의 리뷰",
    myPosts: "내가 쓴 게시글",
    myComments: "내가 쓴 댓글",
    likedPerfumes: "좋아요 한 향수",
    likedPosts: "좋아요 한 글",
  };

  const tabItems: SubTabItem[] = ACTIVITY_TAB_KEYS.map((key) => ({
    key: key,
    label: TAB_LABELS[key],
  }));

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

  return (
    <>
      <SubTabSwitcher
        activeTab={activeTab}
        onTabChange={(key) => setActiveTab(key as ActivityTabKey)}
        tabs={tabItems}
      />

      {TABS[activeTab]}
    </>
  );
};
