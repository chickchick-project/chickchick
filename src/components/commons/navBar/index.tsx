import React from "react";
import Image from "next/image";
import Link from "next/link";
import { NAV_LABELS, NAV_PATHS } from "./navBar.constants";
import IMAGES from "@/lib/constants/images";
import UserProfileSection from "./UserProfileSection";

export interface NavBarProps {
  currentPath: string;
}

export default function NavBar({ currentPath }: NavBarProps) {
  const selectedLink = (path: string) =>
    currentPath === path ? "text-black font-bold" : "text-gray-500";

  return (
    <>
      <header className="flex justify-between items-center py-5 px-7 w-full h-20 relative">
        {/* 로고 */}
        <div>
          <Link
            href={NAV_PATHS.HOME}
            className={
              currentPath === NAV_PATHS.HOME ? "block tablet:hidden" : ""
            }
          >
            <Image
              src={IMAGES.Logo.src}
              width={108}
              height={40}
              alt="logo"
              className="tablet:w-[108px] tablet:h-[40px] w-[80px] h-[32px]"
            />
          </Link>
        </div>

        {/* 네비게이션 */}
        <nav>
          <ul className="flex gap-4 items-center tablet:text-label-1 text-body-2 tablet:font-semibold font-medium">
            <li className="tablet:divider-vertical">
              <Link
                href={NAV_PATHS.PERFUMES}
                className={selectedLink(NAV_PATHS.PERFUMES)}
              >
                {NAV_LABELS.PERFUMES}
              </Link>
            </li>
            <li className="tablet:divider-vertical">
              <Link
                href={NAV_PATHS.COMMUNITY}
                className={selectedLink(NAV_PATHS.COMMUNITY)}
              >
                {NAV_LABELS.COMMUNITY}
              </Link>
            </li>

            {/* 로그인 / 프로필 버튼 */}
            <div className="tablet:block hidden">
              <UserProfileSection />
            </div>
          </ul>
        </nav>
      </header>

      {/* 드롭다운을 NavBar의 바로 아래에 배치 */}
    </>
  );
}
