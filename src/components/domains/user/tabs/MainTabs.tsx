import React from "react";
import Link from "next/link";
import { getVisibleTabs } from "./tabs.helper";
import { useUserStore } from "@/client/stores/useUserStore";
import { MobileTabsAccordion } from "./MobileTabsAccordion";
import { FloatingActionButton } from "../components/FAB";

const MainTabs = ({
  tab,
  isMe,
  onAddPhotoClick,
  pageOwnerId,
  children,
}: {
  tab: string;
  isMe?: boolean;
  pageOwnerId: string;
  onAddPhotoClick: () => void;
  children?: React.ReactNode;
}) => {
  const { user } = useUserStore();
  const tabItems = getVisibleTabs(isMe, user?.nickname);
  const isCollectionTab = isMe && tab === "collection";

  return (
    <>
      {/* 데스크톱 뷰 - tablet(768px) 이상에서만 표시 */}
      <div className="hidden tablet:block">
        <div className="flex items-end w-full relative z-10 h-[52px]">
          {/* 탭 그룹 */}
          <nav role="tablist" aria-label="사용자 프로필 탭">
            <div className="flex space-x-2 mb-[-1px]">
              {tabItems.map(({ label, value }) => {
                const isActive = value === tab;
                return (
                  <Link
                    key={value}
                    href={`/user/${pageOwnerId}/${value}`}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`${value}-panel`}
                    className={`min-w-[120px] px-4 h-[52px] flex items-center justify-center rounded-t-lg border transition-colors text-center font-medium
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
          </nav>

          {isCollectionTab && (
            <button
              className="ml-auto mb-1 px-5 py-2.5 bg-primary-200 text-white rounded-lg font-regular hover:bg-primary-300 transition-colors"
              onClick={onAddPhotoClick}
            >
              사진 추가하기
            </button>
          )}
        </div>

        {children && (
          <div
            role="tabpanel"
            className="bg-white rounded-lg border-gray-200 border p-4 tablet:p-10"
          >
            {children}
          </div>
        )}
      </div>

      {/* 모바일 뷰 - tablet(768px) 미만에서만 표시 */}
      <div className="block tablet:hidden w-full">
        <MobileTabsAccordion tabItems={tabItems} currentTab={tab}>
          {children}
        </MobileTabsAccordion>
      </div>

      {/* FAB는 모바일에서만 표시 */}
      <div className="block tablet:hidden">
        <FloatingActionButton
          show={!!isCollectionTab}
          onClick={onAddPhotoClick}
        />
      </div>
    </>
  );
};

export default MainTabs;
