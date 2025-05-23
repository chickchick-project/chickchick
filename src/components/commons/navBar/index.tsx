import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import { NavDropdown } from "./Dropdown";
import ICONS from "@/lib/constants/icons";
import { NAV_LABELS, NAV_PATHS } from "./navBar.constants";
import IMAGES from "@/lib/constants/images";
import { useUserStore } from "@/lib/stores/useUserStore";

export interface NavBarProps {
  currentPath: string;
  onLogin: () => void;
}

export default function NavBar({ currentPath, onLogin }: NavBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const navBarRef = useRef<HTMLElement | null>(null);
  const { user, isHydrated } = useUserStore();

  const selectedLink = (path: string) =>
    currentPath === path ? "text-black font-bold" : "text-gray-500";

  return (
    <>
      <header ref={navBarRef} className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center py-5 px-7 h-20 relative">
          {/* 로고 */}
          <div>
            {currentPath !== NAV_PATHS.HOME && (
              <Link href={NAV_PATHS.HOME}>
                <Image
                  src={IMAGES.Logo.src}
                  width={108}
                  height={40}
                  alt="logo"
                  className="size-auto"
                />
              </Link>
            )}
          </div>

          {/* 네비게이션 */}
          <nav>
            <ul className="flex gap-4 items-center">
              <li className="divider-vertical">
                <Link
                  href={NAV_PATHS.PERFUMES}
                  className={selectedLink(NAV_PATHS.PERFUMES)}
                >
                  {NAV_LABELS.PERFUMES}
                </Link>
              </li>
              <li className="divider-vertical">
                <Link
                  href={NAV_PATHS.COMMUNITY}
                  className={selectedLink(NAV_PATHS.COMMUNITY)}
                >
                  {NAV_LABELS.COMMUNITY}
                </Link>
              </li>

              {/* 로그인 / 프로필 버튼 */}
              <li
                className={`w-[120px] pl-6 relative flex items-center gap-2 transition-opacity duration-300 ${
                  isHydrated ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
              >
                {!user ? (
                  <button
                    className="text-body-2 font-medium text-black-300"
                    onClick={onLogin}
                  >
                    {NAV_LABELS.LOGIN}
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Image
                      src={
                        user.image_url ? user.image_url : "/images/profile.svg"
                      }
                      className="rounded-full"
                      width={36}
                      height={36}
                      alt="User"
                    />
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                      <Image
                        src={ICONS.ArrowDownGray.src}
                        width={16}
                        height={16}
                        alt="Down"
                      />
                    </button>
                  </div>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* 드롭다운을 NavBar의 바로 아래에 배치 */}
      {isDropdownOpen && navBarRef.current && (
        <NavDropdown
          onClose={() => setIsDropdownOpen(false)}
          parentRef={navBarRef}
          userId={user!.id}
        />
      )}
    </>
  );
}
