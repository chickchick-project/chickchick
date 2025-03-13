import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import { Dropdown } from "./Dropdown";
import ICONS from "@/lib/constants/icons";

export interface NavBarProps {
  currentPath: string;
  isLoggedIn: boolean;
  onLogin: () => void;
}

const NavBar: React.FC<NavBarProps> = ({
  currentPath,
  isLoggedIn,
  onLogin,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const navBarRef = useRef<HTMLElement | null>(null);

  const selectedLink = (path: string) =>
    currentPath === path ? "text-black font-bold" : "text-gray-500";

  return (
    <>
      <header
        ref={navBarRef}
        className="flex justify-between items-center py-5 px-7 w-full h-20 relative"
      >
        {/* 로고 */}
        <div className="w-[108px]">
          {currentPath !== "/" && (
            <Image src="/images/Logo.svg" width={108} height={40} alt="logo" />
          )}
        </div>

        {/* 네비게이션 */}
        <nav>
          <ul className="flex gap-4 items-center">
            <li className="divider-vertical">
              <Link href="/purfumes" className={selectedLink("/purfumes")}>
                향수
              </Link>
            </li>
            <li className="divider-vertical">
              <Link href="/community" className={selectedLink("/community")}>
                커뮤니티
              </Link>
            </li>

            {/* 로그인 / 프로필 버튼 */}
            <li className="pl-6 relative flex items-center gap-2">
              {!isLoggedIn ? (
                <button
                  className="text-body-2 font-medium text-black-300"
                  onClick={onLogin}
                >
                  로그인/회원가입
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <Image
                    src="/images/Profile.svg"
                    width={36}
                    height={36}
                    alt="User"
                    priority
                  />

                  <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    <Image
                      src={ICONS.ArrowDownGray.src}
                      width={16}
                      height={16}
                      alt="Down"
                      priority
                    />
                  </button>
                </div>
              )}
            </li>
          </ul>
        </nav>
      </header>

      {/* 드롭다운을 NavBar의 바로 아래에 배치 */}
      {isDropdownOpen && navBarRef.current && (
        <Dropdown
          onClose={() => setIsDropdownOpen(false)}
          parentRef={navBarRef}
        />
      )}
    </>
  );
};

export default NavBar;
