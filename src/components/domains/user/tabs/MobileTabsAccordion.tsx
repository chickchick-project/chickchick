"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ICONS from "@/shared/constants/icons";
import { useCurrentUser } from "@/client/hooks/useCurrentUser";
import { TabItem } from "./tabs.type";

interface MobileTabsAccordionProps {
  tabItems: TabItem[];
  currentTab: string;
  children?: React.ReactNode;
}

export const MobileTabsAccordion = ({
  tabItems,
  currentTab,
  children,
}: MobileTabsAccordionProps) => {
  const { user } = useCurrentUser();

  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setIsOpen(true);
  }, [currentTab]);

  const [showAllTabs, setShowAllTabs] = useState(false);
  const currentTabItem = tabItems.find(({ value }) => value === currentTab);

  return (
    <div className="w-full">
      <div className="sticky top-0 z-20 bg-white pb-2">
        <div className="border border-gray-200 rounded-lg bg-white">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full h-[52px] flex items-center justify-between px-4 text-left font-medium transition-colors rounded-lg text-primary-600 bg-primary-100"
          >
            <span className="truncate">{currentTabItem?.label}</span>
            <Image
              src={ICONS.ArrowDownGray.src}
              alt="toggle"
              width={20}
              height={20}
              className={`transform transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* 다른 탭들 드롭다운 */}
        <div className="mt-2">
          <button
            type="button"
            onClick={() => setShowAllTabs(!showAllTabs)}
            className="w-full h-[40px] flex items-center justify-between px-4 text-left text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <span>다른 탭 보기</span>
            <Image
              src={ICONS.ArrowDownGray.src}
              alt="toggle"
              width={16}
              height={16}
              className={`transform transition-transform duration-200 ${
                showAllTabs ? "rotate-180" : ""
              }`}
            />
          </button>

          {showAllTabs && (
            <ul className="mt-2 space-y-2">
              {tabItems
                .filter(({ value }) => value !== currentTab)
                .map(({ label, value }) => (
                  <li key={value}>
                    <Link
                      href={`/user/${user?.id}/${value}`}
                      onClick={() => setShowAllTabs(false)}
                      className="h-[48px] flex items-center px-4 text-left font-medium text-gray-800 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="truncate">{label}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>

      {/* 컨텐츠 영역 */}
      {isOpen && (
        <div className="mt-2">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
