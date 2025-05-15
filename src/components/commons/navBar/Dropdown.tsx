import Image from "next/image";
import Link from "next/link";
import React from "react";
import { createPortal } from "react-dom";
import LevelChip from "../chip/LevelChip";
import { NAV_MY_INFO, NAV_ITEMS } from "./navBar.constants";
import { useUserStore } from "@/lib/stores/useUserStore";

interface DropdownProps {
  onClose: () => void;
  parentRef: React.RefObject<HTMLElement>;
}

export function NavDropdown({ onClose, parentRef }: DropdownProps) {
  const { user } = useUserStore();

  if (!parentRef.current) return null;

  const headerRect = parentRef.current.getBoundingClientRect();

  return createPortal(
    <div
      className="absolute bg-white shadow-card rounded-xl z-50 w-[400px] flex flex-col items-center pt-5"
      style={{
        top: `${headerRect.bottom}px`,
        right: `${window.innerWidth - headerRect.right}px`,
      }}
    >
      <div className="flex flex-col items-center gap-6">
        {/* 프로필 */}
        <div className="flex flex-col items-center gap-2">
          <Image
            src={"/images/profile.svg"}
            width={80}
            height={80}
            alt="프로필"
          />
          <LevelChip level={NAV_MY_INFO.level} />
          <span className="text-title-2 font-semibold text-black-100">
            {user?.nickname}
          </span>
        </div>
        {/* 마이페이지 */}
        <div className="grid grid-cols-3 gap-7 text-center">
          {NAV_ITEMS.myPage
            .map((item) => ({
              ...item,
            }))
            .map((item) => renderNavItem(item, onClose))}
        </div>
        {/* 푸터 */}
        <div className="flex items-center justify-center py-5 border-t border-gray-200 w-[400px]">
          {NAV_ITEMS.footer.map((item, index) => (
            <React.Fragment key={item.label}>
              <form action={item.action}>
                <button
                  className="text-body-2 font-medium text-black-300 cursor-pointer"
                  onClick={item.onClick}
                  type={item.type}
                >
                  {item.label}
                </button>
              </form>
              {index < NAV_ITEMS.footer.length - 1 && (
                <div className="w-0.5 h-4 mx-[60px] bg-gray-200" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

const renderNavItem = (
  item: (typeof NAV_ITEMS.myPage)[number],
  onClose: () => void
) => (
  <Link
    href={item.href}
    key={item.label}
    className="flex flex-col items-center gap-2 cursor-pointer"
    onClick={onClose}
  >
    {item.icon && (
      <Image
        src={item.icon.src}
        alt={item.icon.alt}
        width={24}
        height={24}
        priority
      />
    )}
    <span className="text-body-2 font-medium">{item.label}</span>
  </Link>
);
