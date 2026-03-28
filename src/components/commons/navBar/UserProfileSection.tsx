"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { useUserStore } from "@/client/stores/useUserStore";
import { NAV_LABELS } from "./navBar.constants";
import ICONS from "@/shared/constants/icons";
import { NavDropdown } from "./Dropdown";
import { useModalStore, MODAL_KEYS } from "@/client/stores/uiStore";

const UserProfileSection = () => {
  const navBarRef = useRef<HTMLDivElement | null>(null);
  const { user, isLoading } = useUserStore();
  const { openModal } = useModalStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div
      ref={navBarRef}
      className="w-[120px] relative flex items-center h-[36px] flex-shrink-0 pl-6"
    >
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="h-8 w-20" />
        </div>
      ) : !user ? (
        <div className="w-full h-full flex items-center">
          <button
            className="text-body-2 font-medium text-black-300 whitespace-nowrap"
            onClick={() => openModal(MODAL_KEYS.LOGIN)}
          >
            {NAV_LABELS.LOGIN}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 h-full">
          <div className="w-[36px] h-[36px] flex-shrink-0">
            <Image
              src={user.imageUrl || "/images/profile.svg"}
              className="rounded-full"
              width={36}
              height={36}
              alt="User"
              loading="eager"
              quality={85}
            />
          </div>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-4 h-4 flex-shrink-0"
            aria-label="메뉴 열기"
          >
            <Image
              src={ICONS.ArrowDownGray.src}
              width={16}
              height={16}
              alt="Down"
              loading="eager"
            />
          </button>
          {isDropdownOpen && navBarRef.current && (
            <NavDropdown
              onClose={() => setIsDropdownOpen(false)}
              parentRef={navBarRef}
              userId={user.id}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfileSection;
