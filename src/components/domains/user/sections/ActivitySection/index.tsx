"use client";

import React, { useState } from "react";
import { SubTabSwitcher } from "../../tabs/SubTabs";
import { ActivityData } from "../sections.type";
import { SubTabItem } from "../../tabs/tabs.type";
import {
  MyReviewList,
  MyPostList,
  MyCommentsList,
  LikePerfumeList,
  LikePostList,
} from "./components";

const ACTIVITY_TAB_KEYS = [
  "myReviews",
  "myPosts",
  "myComments",
  "likedPerfumes",
  "likedPosts",
] as const;

type ActivityTabKey = (typeof ACTIVITY_TAB_KEYS)[number];

export const ActivitySection = ({ data }: { data: ActivityData }) => {
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

  if (!data) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <p>활동 데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const TABS: Record<ActivityTabKey, React.ReactNode> = {
    myReviews: <MyReviewList reviews={data.myReviews || []} />,
    myPosts: <MyPostList posts={data.myPosts || []} />,
    myComments: <MyCommentsList comments={data.myComments || []} />,
    likedPerfumes: <LikePerfumeList likedPerfumes={data.likedPerfumes || []} />,
    likedPosts: <LikePostList likedPosts={data.likedPosts || []} />,
  };

  return (
    <>
      <SubTabSwitcher
        activeTab={activeTab}
        onTabChange={(key) => setActiveTab(key as ActivityTabKey)}
        tabs={tabItems}
      />

      <div className="mt-6">{TABS[activeTab]}</div>
    </>
  );
};
