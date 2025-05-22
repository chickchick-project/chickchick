import React from "react";
import Link from "next/link";
import { getRenderableTabItems } from "./tabs.helper";
import { users } from "@prisma/client";

const MainTabs = ({
  tab,
  isMe,
  pageOwner,
}: {
  tab: string;
  isMe?: boolean;
  pageOwner: users;
}) => {
  const tabItems = getRenderableTabItems(isMe, pageOwner.nickname);

  return (
    <div className="flex space-x-2 ml-10 mb-[-1px] z-10 relative h-[52px]">
      {tabItems.map(({ label, value }) => {
        return (
          <Link
            key={value}
            href={`/user/${pageOwner.id}/${value}`}
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
