import React from "react";
import Image from "next/image";
import Link from "next/link";
import { NAV_LABELS, NAV_PATHS } from "./navBar.constants";
import UserProfileSection from "./UserProfileSection";

export interface NavBarProps {
  currentPath: string;
}

export default function NavBar({ currentPath }: NavBarProps) {
  const selectedLink = (path: string) =>
    currentPath === path ? "text-black font-bold" : "text-gray-500";

  return (
    <>
      <header className="flex justify-between items-center px-7 h-20 w-full flex-shrink-0">
        {/* 로고 */}
        <div className="tablet:w-[108px] tablet:h-[40px] w-[80px] h-[30px] flex-shrink-0">
          <Link href={NAV_PATHS.HOME} className="block">
            <Image
              src="/images/Logo.svg"
              width={108}
              height={40}
              alt="logo"
              className="tablet:w-[108px] tablet:h-[40px] w-[80px] h-[30px]"
              priority
              fetchPriority="high"
              unoptimized
            />
          </Link>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-shrink-0">
          <ul className="flex gap-4 items-center tablet:text-label-1 text-body-2 tablet:font-semibold font-medium h-[40px]">
            <li className="tablet:divider-vertical h-full flex items-center justify-center">
              <Link
                href={NAV_PATHS.PERFUMES}
                className={`${selectedLink(NAV_PATHS.PERFUMES)} whitespace-nowrap`}
              >
                {NAV_LABELS.PERFUMES}
              </Link>
            </li>
            <li className="tablet:divider-vertical h-full flex items-center justify-center">
              <Link
                href={NAV_PATHS.COMMUNITY}
                className={`${selectedLink(NAV_PATHS.COMMUNITY)} whitespace-nowrap`}
              >
                {NAV_LABELS.COMMUNITY}
              </Link>
            </li>

            {/* 로그인 / 프로필 버튼 */}
            <li className="tablet:flex hidden h-full items-center justify-center">
              <UserProfileSection />
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
