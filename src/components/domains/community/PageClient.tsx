"use client";
import { useState } from "react";
import { COMMUNITY_BOARDS } from "@/lib/constants/communityBoard";
import { Header } from "./header";
import CommunityCards from "./communityCards";
import { communityPostData } from "./communityCards/dummyCommunityCards";

export default function PageClient() {
  const boards = Object.entries(COMMUNITY_BOARDS).map(([key, value]) => ({
    key,
    label: value,
  }));
  const [selectedTab, setSelectedTab] = useState(boards[0].key);

  const handleTabClick = (key: string) => {
    setSelectedTab(key);
  };
  //임시 목데이터
  const postData =
    selectedTab === "best"
      ? communityPostData
      : communityPostData.filter((post) => post.categoryType === selectedTab);

  return (
    <div className="px-4 w-full flex flex-col items-center gap-5">
      <Header
        boards={boards}
        selectedTab={selectedTab}
        handleTabClick={handleTabClick}
      />
      <main className="pb-[280px]">
        <CommunityCards postData={postData} selectedTab={selectedTab} />
      </main>
    </div>
  );
}
