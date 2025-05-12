"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NavBar from ".";
import { LoginModal } from "@/components/modal/LoginModal";
import { useUserStore } from "@/lib/stores/useUserStore";

//NavBar로 전달된 클라이언트 설정 및 상태를 담은 Wrapper
export default function NavBarWrapper() {
  const [openModal, setOpenModal] = useState(false);
  const currentPath = usePathname();
  const { fetchUser } = useUserStore();

  const handleOpenModal = () => {
    setOpenModal((prev) => !prev);
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <NavBar currentPath={currentPath} onLogin={handleOpenModal} />
      {openModal && (
        <LoginModal
          closeModal={() => {
            setOpenModal(false);
          }}
        />
      )}
    </>
  );
}
