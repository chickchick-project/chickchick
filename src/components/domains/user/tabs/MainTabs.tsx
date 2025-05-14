"use client";

import React from "react";
import Link from "next/link";
import { TabItemConfig, User } from "./type";

const TAB_CONFIGS: TabItemConfig[] = [
  {
    getLabel: (isMe, nickname) =>
      !isMe && nickname ? (
        <>
          {nickname}님의
          <br />
          컬렉션
        </>
      ) : (
        "나의 컬렉션"
      ),
    value: "collection",
  },
  {
    getLabel: (isMe, nickname) =>
      !isMe && nickname ? (
        <>
          {nickname}님의
          <br />
          취향
        </>
      ) : (
        "북마크"
      ),
    value: "bookmarks",
  },
  {
    getLabel: () => "내 활동",
    value: "activity",
    isMeOnly: true,
  },
  {
    getLabel: () => "내 정보",
    value: "profile",
    isMeOnly: true,
  },
];

const getRenderableTabItems = (isMe?: boolean, selectedUser?: User) => {
  return TAB_CONFIGS.filter((config) => isMe || !config.isMeOnly).map(
    (config) => ({
      label: config.getLabel(isMe, selectedUser?.nickname),
      value: config.value,
    })
  );
};

const MainTabs = ({
  tab,
  isMe,
  selectedUser,
}: {
  tab: string;
  isMe?: boolean;
  selectedUser?: User;
}) => {
  if (!isMe && !selectedUser?.id) {
    return null;
  }

  const profileOwnerId = selectedUser?.id;

  const tabItems = getRenderableTabItems(isMe, selectedUser);

  return (
    <div className="flex space-x-2 ml-10 mb-[-1px] z-10 relative h-[52px]">
      {tabItems.map(({ label, value }) => {
        if (!isMe && value !== "collection" && value !== "bookmarks")
          return null;
        return (
          <Link
            key={value}
            href={`/user/${profileOwnerId}/${value}`}
            className={`w-[140px] flex items-center justify-center rounded-t-md border transition-colors text-center ${
              value === tab
                ? "bg-white text-primary-200 border-b-white font-semibold"
                : "bg-primary-200 text-white font-regular"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
};

export default MainTabs;
