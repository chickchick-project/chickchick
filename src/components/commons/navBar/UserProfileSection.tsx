"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { useUserStore } from "@/lib/stores/useUserStore";
import { NAV_LABELS } from "./navBar.constants";
import ICONS from "@/lib/constants/icons";
import { NavDropdown } from "./Dropdown";
import { LoginModal } from "@/components/modal/LoginModal";

const UserProfileSection = () => {
  const [openModal, setOpenModal] = useState(false);
  const navBarRef = useRef<HTMLDivElement | null>(null);
  const { user, isLoading: isZustandLoading } = useUserStore();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  let displayContent = null;
  console.log(user);
  if (!user) {
    displayContent = (
      <div className="w-[120px]">
        <button
          className="text-body-2 font-medium text-black-300"
          onClick={() => {
            setOpenModal(true);
          }}
        >
          {NAV_LABELS.LOGIN}
        </button>
        {openModal && <LoginModal closeModal={() => setOpenModal(false)} />}
      </div>
    );
  } else {
    displayContent = (
      <div className="flex items-center gap-2">
        <Image
          src={user?.imageUrl ? user.imageUrl : "/images/profile.svg"}
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
    );
  }

  return (
    <div
      ref={navBarRef}
      className={`w-[120px] pl-6 relative flex items-center gap-2 transition-opacity duration-300 ${
        !isZustandLoading ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {displayContent}
      {isDropdownOpen && navBarRef.current && (
        <NavDropdown
          onClose={() => setIsDropdownOpen(false)}
          parentRef={navBarRef}
          userId={user!.id}
        />
      )}
    </div>
  );
};

export default UserProfileSection;
