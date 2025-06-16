"use client";

import { usePathname } from "next/navigation";
import { BottomNavBar } from "../bottomNavBar";

// TODO: BottomNavBar가 mypage에서 제대로 적용되지 않는 문제 해결 필요.
export const BodyWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className={`${isHome ? "" : "max-w-[1200px] mx-auto"} relative`}>
      {children}
      <BottomNavBar />
    </div>
  );
};
