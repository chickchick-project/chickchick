"use client";

import { useUserStore } from "@/client/stores/useUserStore";
import { BOTTOM_NAV_BAR_ICONS } from "./BottomNavBar.constants";
import { BottomNavBarIcon } from "./BottomNavBarIcon";
import { usePathname } from "next/navigation";

export const BottomNavBar = () => {
  const pathname = usePathname();
  const { user } = useUserStore();

  return (
    <div className="tablet:hidden block sticky bottom-0 left-0 w-full h-[50px] px-10 py-1 bg-white border-t border-gray300 z-50">
      <div className="flex justify-between items-center">
        {BOTTOM_NAV_BAR_ICONS(user?.id || "").map((icon) => {
          // 각 아이콘별 활성화 조건
          const isActive =
            icon.key === "home"
              ? pathname === "/"
              : pathname.startsWith(icon.href);

          return (
            <BottomNavBarIcon image={icon} key={icon.key} isActive={isActive} />
          );
        })}
      </div>
    </div>
  );
};
