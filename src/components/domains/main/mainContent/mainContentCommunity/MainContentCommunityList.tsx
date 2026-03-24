"use client";

import { BOARD_TYPES } from "@/shared/constants/communityBoard";
import ICONS from "@/shared/constants/icons";
import Image from "next/image";
import { useState } from "react";
import BoardTabBar from "@/components/commons/tabBar/BoardTabBar";
import Link from "next/link";
import { useCommunityPosts } from "@/client/hooks/query/useCommunityQuery";
import { PostCategory } from "@prisma/client";
import { Indicator } from "@/components/commons/loading/Indicator";
import { BasePost } from "@/server/hono/utils/prisma.utils";

interface IMainContentCommunityList {
  size: "s" | "m";
  initialData?: BasePost[];
}

export const MainContentCommunityList = ({
  size,
  initialData = [],
}: IMainContentCommunityList) => {
  const boards = Object.entries(BOARD_TYPES).map(([key, value]) => ({
    key,
    label: value,
  }));

  const [selectedTab, setSelectedTab] = useState(boards[0].key);
  const [hasChangedTab, setHasChangedTab] = useState(false);

  const { data: apiData, isLoading } = useCommunityPosts(
    {
      category: selectedTab as PostCategory,
      sortBy: "popular",
      limit: 8,
    },
    hasChangedTab,
  );

  const posts = !hasChangedTab ? initialData : apiData?.data || [];

  const handleTabClick = (key: string) => {
    setSelectedTab(key);
    setHasChangedTab(true);
  };

  return (
    <div
      className={`${
        size === "m" ? "pc:w-[460px] w-full" : "w-80"
      } p-6 bg-white rounded-xl shadow-[0px_4px_20px_0px_rgba(0,0,0,0.08)] flex flex-col justify-start items-center gap-2`}
    >
      <div className="px-10 py-3 rounded-3 flex flex-col justify-start items-start w-full">
        <BoardTabBar
          boards={boards}
          selectedTab={selectedTab}
          handleTabClick={handleTabClick}
        />
      </div>
      <div className="w-full min-h-[320px] flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Indicator />
          </div>
        ) : posts.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            게시글이 없습니다.
          </div>
        ) : (
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/community/post/${post.id}`}
                  className="flex items-center justify-between gap-3 py-2"
                >
                  {/* title */}
                  <span className="flex-1 min-w-0 text-black-100 tablet:text-body-2 text-label-2 font-medium truncate">
                    {post.title}
                  </span>

                  {/* comment meta */}
                  <div className="flex items-center gap-0.5 shrink-0 text-black-100 tablet:text-body-2 text-label-2">
                    <Image
                      src={ICONS.Comment.src}
                      alt={ICONS.Comment.alt}
                      width={16}
                      height={16}
                    />
                    <span>
                      {post.commentCount > 1000 ? "999+" : post.commentCount}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
