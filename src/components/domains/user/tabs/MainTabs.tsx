"use client";

import React from "react";
import Link from "next/link";
import { getRenderableTabItems } from "./tabs.helper";
import { User } from "./tabs.type";

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
