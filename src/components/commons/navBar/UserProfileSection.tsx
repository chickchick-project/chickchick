"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { useUserStore } from "@/lib/stores/useUserStore";
import { NAV_LABELS } from "./navBar.constants";
import ICONS from "@/lib/constants/icons";
import { NavDropdown } from "./Dropdown";
import { useModalStore, MODAL_KEYS } from "@/lib/stores/useModalStore";

const UserProfileSection = () => {
  const navBarRef = useRef<HTMLDivElement | null>(null);
  const { user, isLoading } = useUserStore();
  const { openModal } = useModalStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="w-[120px] pl-6 flex items-center justify-center h-[36px]">
        <div className="animate-pulse h-8 w-20 bg-white rounded" />
      </div>
    );
  }

  return (
    <div
      ref={navBarRef}
      className="w-[120px] pl-6 relative flex items-center gap-2"
    >
      {!user ? (
        <div className="w-full">
          <button
            className="text-body-2 font-medium text-black-300"
            onClick={() => openModal(MODAL_KEYS.LOGIN)}
          >
            {NAV_LABELS.LOGIN}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Image
            src={user.imageUrl || "/images/profile.svg"}
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
