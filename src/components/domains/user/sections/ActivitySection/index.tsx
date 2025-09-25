"use client";

import React, { useState } from "react";
import { SubTabSwitcher } from "../../tabs/SubTabs";
import {
  renderMyReviews,
  renderMyPosts,
  renderMyComments,
  renderLikedPerfumes,
  renderLikedPosts,
} from "./activitySection.helper";
import { ActivityData } from "../sections.type";
import { SubTabItem } from "../../tabs/tabs.type";

export const ActivitySection = ({ data }: { data: ActivityData }) => {
  const [activeTab, setActiveTab] = useState("myReviews");
  const tabItems: SubTabItem[] = [
    {
      key: "myReviews",
      label: "나의 리뷰",
    },
    {
      key: "myPosts",
      label: "내가 쓴 게시글",
    },
    {
      key: "myComments",
      label: "내가 쓴 댓글",
    },
    {
      key: "likedPerfumes",
      label: "좋아요 한 향수",
    },
    {
      key: "likedPosts",
      label: "좋아요 한 글",
    },
  ];
  if (!data) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <p>활동 데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "myReviews":
        return renderMyReviews(data.myReviews || []);
      case "myPosts":
        return renderMyPosts(data.myPosts || []);
      case "myComments":
        return renderMyComments(data.myComments || []);
      case "likedPerfumes":
        return renderLikedPerfumes(data.likedPerfumes || []);
      case "likedPosts":
        return renderLikedPosts(data.likedPosts || []);
      default:
        return null;
    }
  };

  return (
    <>
      <SubTabSwitcher
        activeTab={activeTab}
        onTabChange={(key) => setActiveTab(key)}
        tabs={tabItems}
      />

      <div className="mt-6">{renderActiveTabContent()}</div>
    </>
  );
};
