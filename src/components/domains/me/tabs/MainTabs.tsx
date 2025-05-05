"use client";

import React from "react";
import Link from "next/link";

const MainTabs = ({ tab }: { tab: string }) => {
  return (
    <div className="flex space-x-2 ml-10 mb-[-1px] z-10 relative h-[52px]">
      {[
        { label: "나의 컬렉션", value: "collection" },
        { label: "북마크", value: "bookmarks" },
        { label: "내 활동", value: "activity" },
        { label: "내 정보", value: "profile" },
      ].map(({ label, value }) => (
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
      ))}
    </div>
  );
};

export default MainTabs;
