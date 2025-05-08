"use client";

import React from "react";
import Link from "next/link";

const MainTabs = ({
  tab,
  isMe,
  selectedUser,
}: {
  tab: string;
  isMe?: boolean;
  selectedUser?: string;
}) => {
  return (
    <div className="flex space-x-2 ml-10 mb-[-1px] z-10 relative h-[52px]">
      {[
        {
          label: !isMe ? `${selectedUser}님의 컬렉션` : "나의 컬렉션",
          value: "collection",
        },
        {
          label: !isMe ? `${selectedUser}님의 취향` : "북마크",
          value: "bookmarks",
        },
        { label: "내 활동", value: "activity" },
        { label: "내 정보", value: "profile" },
      ].map(({ label, value }) => {
        if (!isMe && value !== "collection" && value !== "bookmarks")
          return null;
        return (
          <Link
            key={value}
            href={`/me/${value}`}
            className={`w-[140px] flex items-center justify-center rounded-t-md border transition-colors ${
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
