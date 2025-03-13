import Image from "next/image";
import React from "react";
import { createPortal } from "react-dom";
import LevelChip from "../chip/levelChip";
import ICONS from "@/lib/constants/icons";

interface DropdownProps {
  onClose: () => void;
  parentRef: React.RefObject<HTMLElement>;
}

export const Dropdown: React.FC<DropdownProps> = ({ onClose, parentRef }) => {
  if (!parentRef.current) return null;

  const headerRect = parentRef.current.getBoundingClientRect();

  const MY_INFO = {
    nickname: "내 이름",
    level: 1,
  };

  const menuItems = [
    {
      icon: ICONS.Collection,
      label: "나의 컬렉션",
      onClick: () => console.log("나의 컬렉션"),
    },
    {
      icon: ICONS.BookmarkOutlined,
      label: "북마크",
      onClick: () => console.log("북마크"),
    },
    {
      icon: ICONS.Activity,
      label: "내 활동",
      onClick: () => console.log("내 활동"),
    },
  ];

  const footerItems = [
    {
      label: "의견 보내기",
      onClick: () => console.log("의견 보내기"),
    },
    {
      label: "로그아웃",
      onClick: onClose,
    },
  ];

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
          <LevelChip level={MY_INFO.level} />
          <span className="text-title-2 font-semibold text-black-100">
            {MY_INFO.nickname}
          </span>
        </div>
        {/* 마이페이지 */}
        <div className="grid grid-cols-3 gap-7 text-center">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 cursor-pointer"
              onClick={item.onClick}
            >
              <Image
                src={item.icon.src}
                alt={item.icon.alt}
                width={24}
                height={24}
                priority
              />
              <span className="text-body-2 font-medium">{item.label}</span>
            </div>
          ))}
        </div>
        {/* 푸터 */}
        <div className="flex items-center justify-center py-5 border-t border-gray-200 w-[400px]">
          {footerItems.map((item, index) => (
            <React.Fragment key={index}>
              <span
                className="text-body-2 font-medium text-black-300 cursor-pointer"
                onClick={item.onClick}
              >
                {item.label}
              </span>
              {index < footerItems.length - 1 && (
                <div className="w-0.5 h-4 mx-[60px] bg-gray-200" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
};
