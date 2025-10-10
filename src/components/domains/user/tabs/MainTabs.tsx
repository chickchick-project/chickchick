import React from "react";
import Link from "next/link";
import { getRenderableTabItems } from "./tabs.helper";
import { useUserStore } from "@/lib/stores/useUserStore";

const MainTabs = ({
  tab,
  isMe,
  onAddPhotoClick,
}: {
  tab: string;
  isMe?: boolean;
  onAddPhotoClick: () => void;
}) => {
  const user = useUserStore((state) => state.user);
  const tabItems = getRenderableTabItems(isMe, user?.nickname);
  const isCollectionTab = isMe && tab === "collection";

  return (
    <div className="flex items-end w-full px-10 relative z-10 h-[52px]">
      {/* 탭 그룹 */}
      <div className="flex space-x-2 mb-[-1px]">
        {tabItems.map(({ label, value }) => {
          const isActive = value === tab;
          return (
            <Link
              key={value}
              href={`/user/${user?.id}/${value}`}
              className={`w-[140px] h-[52px] flex items-center justify-center rounded-t-lg border transition-colors text-center font-medium
                ${
                  isActive
                    ? "bg-white text-gray-800 border-b-white"
                    : "bg-primary-200 text-white font-regular hover:bg-primary-300"
                }`}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {isCollectionTab && (
        <button
          className="ml-auto mb-1 px-5 py-2.5 bg-primary-200 text-white rounded-lg font-regular hover:bg-primary-300 transition-colors"
          onClick={onAddPhotoClick}
        >
          사진 추가하기
        </button>
      )}
    </div>
  );
};

export default MainTabs;
