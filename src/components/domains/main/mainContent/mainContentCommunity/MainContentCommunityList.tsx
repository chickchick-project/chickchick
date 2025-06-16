"use client";

import { BOARD_TYPES } from "@/lib/constants/communityBoard";
import ICONS from "@/lib/constants/icons";
import Image from "next/image";
import { useState } from "react";
import { boardDataMap } from "@/lib/mocks/communityPosts";
import BoardTabBar from "@/components/commons/tabBar/BoardTabBar";

interface IMainContentCommunityList {
  size: "s" | "m";
}

export const MainContentCommunityList = ({
  size,
}: IMainContentCommunityList) => {
  const boards = Object.entries(BOARD_TYPES).map(([key, value]) => ({
    key,
    label: value,
  }));

  const [selectedTab, setSelectedTab] = useState(boards[0].key);

  const handleTabClick = (key: string) => {
    setSelectedTab(key);
  };

  return (
    <div
      className={`${
        size === "m" ? "tablet:w-[460px] w-full" : "w-80"
      } p-6 bg-white rounded-xl shadow-[0px_4px_20px_0px_rgba(0,0,0,0.08)] flex flex-col justify-start items-center gap-2`}
    >
      <div className="px-10 py-3 rounded-3 flex flex-col justify-start items-start w-full">
        <BoardTabBar
          boards={boards}
          selectedTab={selectedTab}
          handleTabClick={handleTabClick}
        />
      </div>
      <div className="w-full">
        {boardDataMap[selectedTab].map((post) => (
          <div
            key={post.id}
            className="flex justify-between items-start w-full"
          >
            <div className="text-black-100 tablet:text-body-2 text-label-2 font-medium py-2">
              {post.title}
            </div>
            <div className="flex items-center justify-end gap-0.5">
              <Image
                src={ICONS.Comment.src}
                alt={ICONS.Comment.alt}
                width={16}
                height={16}
              />
              <div className="text-gray-100 tablet:text-body-2 text-label-2">
                {post.commentCount > 1000 ? "999+" : post.commentCount}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
