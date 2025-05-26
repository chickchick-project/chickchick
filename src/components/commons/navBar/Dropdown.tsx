import Image from "next/image";
import Link from "next/link";
import React, { ButtonHTMLAttributes } from "react";
import { createPortal } from "react-dom";
import LevelChip from "../chip/LevelChip";
import { getMyPageNavItems } from "./navBar.constants";
import { useUserStore } from "@/lib/stores/useUserStore";
import { logout } from "@/lib/database/action/login";
import { useRouter } from "next/navigation";

interface DropdownProps {
  onClose: () => void;
  parentRef: React.RefObject<HTMLElement>;
  userId: string;
}

export function NavDropdown({ onClose, parentRef }: DropdownProps) {
  const { user, reset } = useUserStore();
  const router = useRouter();

  if (!parentRef.current) return null;

  const headerRect = parentRef.current.getBoundingClientRect();
  const navItems = getMyPageNavItems(user!.id);

  const handleLogout = async () => {
    try {
      await logout();
      reset();
      router.push("/");
      onClose();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const NAV_ITEMS_FOOTER: {
    label: string;
    type: ButtonHTMLAttributes<HTMLButtonElement>["type"];
    onClick?: () => void;
    action?: () => void;
  }[] = [
    {
      label: "의견 보내기",
      type: "button",
      onClick: () => {
        console.log("의견 보내기");
      },
    },
    {
      label: "로그아웃",
      type: "submit",
      onClick: handleLogout,
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
            src={user?.imageUrl ? user.imageUrl : "/images/profile.svg"}
            className="rounded-full"
            width={80}
            height={80}
            alt="프로필"
          />
          <LevelChip level={1} />
          <span className="text-title-2 font-semibold text-black-100">
            {user?.nickname}
          </span>
        </div>

        {/* 마이페이지 */}
        <div className="grid grid-cols-3 gap-7 text-center">
          {navItems.map((item) => renderNavItem(item, onClose))}
        </div>

        {/* 푸터 */}
        <div className="flex items-center justify-center py-5 border-t border-gray-200 w-[400px]">
          {NAV_ITEMS_FOOTER.map((item, index) => (
            <React.Fragment key={item.label}>
              <form onSubmit={item.onClick}>
                <button
                  className="text-body-2 font-medium text-black-300 cursor-pointer"
                  type={item.type}
                >
                  {item.label}
                </button>
              </form>
              {index < NAV_ITEMS_FOOTER.length - 1 && (
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
  item: ReturnType<typeof getMyPageNavItems>[number],
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
